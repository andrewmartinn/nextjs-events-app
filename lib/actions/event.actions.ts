"use server";

import { connectToDb } from "../database";
import Event from "../database/models/event.model";
import User from "../database/models/user.model";
import { CreateEventParams } from "../definitions";
import { handleError } from "../utils";

// CREATE EVENT
export const createEvent = async ({
  event,
  userId,
  path,
}: CreateEventParams) => {
  try {
    await connectToDb();
    // find event organizer for the event
    const organizer = User.findById(userId);

    if (!organizer) {
      throw new Error("SERVER ERROR: Failed to find event organizer");
    }

    // create new event on DB
    const createdEvent = await Event.create({
      ...event,
      category: event.categoryId,
      eventOrganizer: userId,
    });

    if (!createdEvent) {
      throw new Error("SERVER ERROR: Failed to create event");
    }

    return JSON.parse(JSON.stringify(createdEvent));
  } catch (error) {
    handleError(error);
  }
};
