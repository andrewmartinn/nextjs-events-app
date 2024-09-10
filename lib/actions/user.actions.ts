"use server";

import { revalidatePath } from "next/cache";
import { connectToDb } from "../database";

import Event from "../database/models/event.model";
import User from "../database/models/user.model";
import Order from "../database/models/order.model";

import { handleError } from "../utils";
import { CreateUserParams, UpdateUserParams } from "../definitions";

// CREATE USER
export const createUser = async (user: CreateUserParams) => {
  try {
    await connectToDb();

    const existingUser = await User.findOne({ clerkId: user.clerkId });

    if (existingUser) {
      console.log("SERVER_ACTION: User aldready exists", existingUser);
      return JSON.parse(JSON.stringify(existingUser));
    }

    const newUser = await User.create(user);

    if (!newUser) {
      throw new Error("SERVER ERROR: Failed to create new user");
    }

    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    handleError(error);
  }
};

// UPDATE USER
export const updateUser = async (clerkId: string, user: UpdateUserParams) => {
  try {
    await connectToDb();

    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, {
      new: true,
    });

    if (!updateUser) {
      throw new Error("SERVER ERROR: Failed to update user");
    }

    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    handleError(error);
  }
};

// DELETE USER
export const deleteUser = async (clerkId: string) => {
  try {
    await connectToDb();

    const userToDelete = await User.findOne({ clerkId });

    if (!userToDelete) {
      throw new Error("SERVER ERROR: User not found");
    }

    // unlink references to other collections
    await Promise.all([
      // remove user references from events collection
      Event.updateMany(
        { _id: { $in: userToDelete.events } },
        { $pull: { eventOrganizer: userToDelete._id } },
      ),

      // remove user references from orders collection
      Order.updateMany(
        { _id: { $in: userToDelete.orders } },
        { $unset: { buyer: 1 } },
      ),
    ]);

    const deletedUser = await User.findOneAndDelete(userToDelete._id);
    revalidatePath("/");

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
  } catch (error) {
    handleError(error);
  }
};
