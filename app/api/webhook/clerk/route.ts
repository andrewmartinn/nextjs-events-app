import { Webhook } from "svix";
import { headers } from "next/headers";
import { clerkClient, WebhookEvent } from "@clerk/nextjs/server";
import { createUser, deleteUser, updateUser } from "@/lib/actions/user.actions";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local",
    );
  }

  // Get request headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get request body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  const eventType = evt.type;

  // Respond to new user creation event by adding user to DB
  if (eventType === "user.created") {
    const { id, email_addresses, image_url, first_name, last_name, username } =
      evt.data;

    // Create user object according to user model
    const clerkUser = {
      clerkId: id,
      email: email_addresses[0].email_address,
      username: username!,
      firstName: first_name!,
      lastName: last_name || "",
      photo: image_url,
    };

    // Create new user on DB
    const newUser = await createUser(clerkUser);

    // sync clerk metadata with DB
    if (newUser) {
      await clerkClient.users.updateUserMetadata(id, {
        publicMetadata: {
          userId: newUser._id,
        },
      });
    }
    // acknowledgement to clerk request received and processed successfully
    return NextResponse.json({ message: "OK", user: newUser });
  }

  // Respond to update user event by updating user to DB
  if (eventType === "user.updated") {
    const { id, image_url, first_name, last_name, username } = evt.data;

    // Create user object according to user model
    const clerkUser = {
      username: username!,
      firstName: first_name!,
      lastName: last_name || "",
      photo: image_url,
    };

    // Update user on DB
    const updatedUser = await updateUser(id, clerkUser);

    // acknowledgement to clerk request received and processed successfully
    return NextResponse.json({ message: "OK", user: updatedUser });
  }

  // Respond to delete user event by deleting user to DB
  if (eventType === "user.deleted") {
    const { id } = evt.data;
    // delete user on DB
    const deletedUser = await deleteUser(id!);
    // acknowledgement to clerk request received and processed successfully
    return NextResponse.json({ message: "OK", user: deletedUser });
  }

  return new Response("", { status: 200 });
}
