/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { connectToDb } from "../database";

import User from "../database/models/user.model";
import Event from "../database/models/event.model";
import Category from "../database/models/category.model";

import { handleError } from "../utils";
import {
  CreateEventParams,
  DeleteEventParams,
  GetAllEventsParams,
} from "../definitions";
import { revalidatePath } from "next/cache";

// POPULATE EVENT INFO (USER, CATEGORY)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const populateEventDetails = async (query: any) => {
  return query
    .populate({
      path: "eventOrganizer",
      model: User,
      select: "_id firstName lastName",
    })
    .populate({
      path: "category",
      model: Category,
      select: "_id name",
    });
};

// CREATE EVENT
export const createEvent = async ({ event, userId }: CreateEventParams) => {
  try {
    await connectToDb();
    // find event organizer for the event
    const organizer = await User.findById(userId);

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

// GET EVENT BY ID
export const getEventById = async (eventId: string) => {
  try {
    await connectToDb();

    // populate event organizer and category details
    const event = await populateEventDetails(Event.findById(eventId));

    if (!event) {
      throw new Error("SERVER ERROR: Failed to find event");
    }

    return JSON.parse(JSON.stringify(event));
  } catch (error) {
    handleError(error);
  }
};

// GET ALL EVENTS
export const getAllEvents = async ({
  query,
  limit = 6,
  page,
  category,
}: GetAllEventsParams) => {
  try {
    await connectToDb();

    // sort and filter conditions (title, category, etc)
    const queryConditions = {};

    const eventsQuery = Event.find(queryConditions)
      .sort({ createdAt: "desc" })
      .skip(0)
      .limit(limit);

    const events = await populateEventDetails(eventsQuery);
    const totalResultsCount = await Event.countDocuments(queryConditions);

    if (!events) {
      throw new Error("SERVER ERROR: Failed to fetch events data");
    }

    return {
      data: JSON.parse(JSON.stringify(events)),
      totalResults: Math.ceil(totalResultsCount / limit),
    };
  } catch (error) {
    handleError(error);
  }
};

// DELETE EVENT
export const deleteEvent = async ({ eventId, path }: DeleteEventParams) => {
  try {
    await connectToDb();

    const deletedEvent = await Event.findByIdAndDelete(eventId);

    if (!deletedEvent) {
      throw new Error("SERVER ERROR: Failed to delete event");
    }

    revalidatePath(path);
  } catch (error) {
    handleError(error);
  }
};
