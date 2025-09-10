"use server";

import { cookies } from "next/headers";
import { Client, Account } from "node-appwrite";
import { Auth_Cookie } from "./constants";

export const getCurrent = async () => {
  try {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

    const session = await cookies().get(Auth_Cookie);

    if (!session) {
      return null;
    }

    client.setSession(session.value);
    const account = new Account(client);

    return await account.get();
  } catch {
    return null;
  }
};
