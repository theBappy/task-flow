import { Hono } from "hono";
import { z } from "zod";
import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { createAdminClient } from "@/lib/appwrite";
import { getMember } from "../utils";
import { DATABASE_ID, MEMBERS_ID } from "@/config";
import { Query } from "node-appwrite";
import { Member, MemberRole } from "../types";

const app = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator("query", z.object({ workspaceId: z.string() })),
    async (c) => {
      try {
        const { users } = await createAdminClient();
        const databases = c.get("databases");
        const user = c.get("user");
        const { workspaceId } = c.req.valid("query");

        const member = await getMember({
          databases,
          workspaceId,
          userId: user.$id,
        });

        if (!member) {
          return c.json({ error: "Unauthorized" }, 401);
        }

        const members = await databases.listDocuments<Member>(DATABASE_ID, MEMBERS_ID, [
          Query.equal("workspaceId", workspaceId),
        ]);

        const populatedMembers = await Promise.all(
          members.documents.map(async (doc) => {
            const userData = await users.get(doc.userId);
            return {
              ...doc,
              name: userData.name,
              email: userData.email,
            };
          })
        );

        return c.json({
          data: {
            ...members,
            documents: populatedMembers,
          },
        });
      } catch (err: any) {
        return c.json({ error: err.message || "Something went wrong" }, 500);
      }
    }
  )
  .delete("/:memberId", sessionMiddleware, async (c) => {
    try {
      const { memberId } = c.req.param();
      const user = c.get("user");
      const databases = c.get("databases");

      const memberToDelete = await databases.getDocument(
        DATABASE_ID,
        MEMBERS_ID,
        memberId
      );

      const allMembersInWorkspace = await databases.listDocuments(
        DATABASE_ID,
        MEMBERS_ID,
        [Query.equal("workspaceId", memberToDelete.workspaceId)]
      );

      const member = await getMember({
        databases,
        workspaceId: memberToDelete.workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // Only admin can delete other members
      if (member.$id !== memberToDelete.$id && member.role !== MemberRole.ADMIN) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // Check if deleting last member
      if (allMembersInWorkspace.total === 1) {
        return c.json({ error: "Cannot delete the only member" }, 400);
      }

      // Check if deleting last admin
      const admins = allMembersInWorkspace.documents.filter(
        (m) => m.role === MemberRole.ADMIN
      );
      if (memberToDelete.role === MemberRole.ADMIN && admins.length === 1) {
        return c.json({ error: "Cannot delete the only admin" }, 400);
      }

      await databases.deleteDocument(DATABASE_ID, MEMBERS_ID, memberId);

      return c.json({ data: { $id: memberToDelete.$id } });
    } catch (err: any) {
      return c.json({ error: err.message || "Something went wrong" }, 500);
    }
  })
  .patch(
    "/:memberId",
    sessionMiddleware,
    zValidator("json", z.object({ role: z.nativeEnum(MemberRole) })),
    async (c) => {
      try {
        const { memberId } = c.req.param();
        const { role } = c.req.valid("json");
        const user = c.get("user");
        const databases = c.get("databases");

        const memberToUpdate = await databases.getDocument(
          DATABASE_ID,
          MEMBERS_ID,
          memberId
        );

        const allMembersInWorkspace = await databases.listDocuments(
          DATABASE_ID,
          MEMBERS_ID,
          [Query.equal("workspaceId", memberToUpdate.workspaceId)]
        );

        const member = await getMember({
          databases,
          workspaceId: memberToUpdate.workspaceId,
          userId: user.$id,
        });

        if (!member) {
          return c.json({ error: "Unauthorized" }, 401);
        }

        if (member.$id !== memberToUpdate.$id && member.role !== MemberRole.ADMIN) {
          return c.json({ error: "Unauthorized" }, 401);
        }

        // Check if downgrading last admin
        const admins = allMembersInWorkspace.documents.filter(
          (m) => m.role === MemberRole.ADMIN
        );
        if (
          memberToUpdate.role === MemberRole.ADMIN &&
          role !== MemberRole.ADMIN &&
          admins.length === 1
        ) {
          return c.json({ error: "Cannot downgrade the only admin" }, 400);
        }

        await databases.updateDocument(DATABASE_ID, MEMBERS_ID, memberId, { role });

        return c.json({ data: { $id: memberToUpdate.$id } });
      } catch (err: any) {
        return c.json({ error: err.message || "Something went wrong" }, 500);
      }
    }
  );

export default app;
