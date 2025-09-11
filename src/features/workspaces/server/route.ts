import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { sessionMiddleware } from "@/lib/session-middleware";

import { ID } from "node-appwrite";
import { createWorkspaceSchema } from "../schemas";
import { DATABASE_ID, IMAGES_BUCKET_ID, WORKSPACES_ID } from "@/config";

const app = new Hono().post(
  "/",
  zValidator("form", createWorkspaceSchema),
  sessionMiddleware,
  async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");
    const storage = c.get("storage");

    const { name, image } = c.req.valid("form");

    let uploadedImageUrl: string | undefined;

    if (image instanceof File) {
      const file = await storage.createFile(
        IMAGES_BUCKET_ID,
        ID.unique(),
        image
      );

      const fileUrl = storage.getFileView(IMAGES_BUCKET_ID, file.$id);

      uploadedImageUrl = fileUrl.toString();
    }

    const workspaces = await databases.createDocument(
      DATABASE_ID,
      WORKSPACES_ID,
      ID.unique(),
      {
        name,
        userId: user.$id,
        imageUrl: uploadedImageUrl,
      }
    );

    return c.json({ data: workspaces });
  }
);

export default app;
