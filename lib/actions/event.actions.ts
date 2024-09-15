/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { connectToDb } from "../database";
import { revalidatePath } from "next/cache";

import User from "../database/models/user.model";
import Event from "../database/models/event.model";
import Category from "../database/models/category.model";

import {
  CreateEventParams,
  DeleteEventParams,
  GetAllEventsParams,
  GetEventsByUserParams,
  GetRelatedEventsByCategoryParams,
  UpdateEventParams,
} from "../definitions";
import { handleError } from "../utils";

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

const getCategoryByName = async (name: string) => {
  return Category.findOne({ name: { $regex: name, $options: "i" } });
};

// CREATE EVENT
export const createEvent = async ({
  event,
  userId,
  path,
}: CreateEventParams) => {
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

    revalidatePath(path);
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

    const titleCondition = query
      ? { title: { $regex: query, $options: "i" } }
      : {};

    const categoryCondition = category
      ? await getCategoryByName(category)
      : null;

    // sort and filter conditions (title, category, etc)
    const queryConditions = {
      $and: [
        titleCondition,
        categoryCondition ? { category: categoryCondition._id } : {},
      ],
    };

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

// UPDATE EVENT
export const updateEvent = async ({
  userId,
  event,
  path,
}: UpdateEventParams) => {
  try {
    await connectToDb();

    const eventToUpdate = await Event.findById(event._id);
    if (
      !eventToUpdate ||
      eventToUpdate.eventOrganizer.toHexString() !== userId
    ) {
      throw new Error("SERVER ERROR: Unauthorized or event not found");
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      event._id,
      { ...event, category: event.categoryId },
      { new: true },
    );
    // invalidate cache and refresh app data
    revalidatePath(path);
    return JSON.parse(JSON.stringify(updatedEvent));
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

// GET RELATED EVENTS: EVENTS MATCHING SAME CATEGORY
export const getRelatedEventsByCategory = async ({
  categoryId,
  eventId,
  page = 1,
  limit = 3,
}: GetRelatedEventsByCategoryParams) => {
  try {
    await connectToDb();

    // pagination calculation
    const skipAmount = (Number(page) - 1) * limit;
    // fetch all events matching the same category id excludes current event
    const queryConditions = {
      $and: [{ category: categoryId }, { _id: { $ne: eventId } }],
    };

    const eventsQuery = Event.find(queryConditions)
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(limit);

    const events = await populateEventDetails(eventsQuery);
    const totalResultsCount = await Event.countDocuments(eventsQuery);

    if (!events) {
      throw new Error(
        "SERVER ERROR: Unable to find related events matching the query",
      );
    }

    return {
      data: JSON.parse(JSON.stringify(events)),
      totalResults: Math.ceil(totalResultsCount / limit),
    };
  } catch (error) {
    handleError(error);
  }
};

// GET EVENTS CREATED BY USER
export const getEventsByUser = async ({
  userId,
  page,
  limit = 6,
}: GetEventsByUserParams) => {
  try {
    await connectToDb();

    const skipAmount = (Number(page) - 1) * limit;
    const queryConditions = { eventOrganizer: userId };

    const eventsQuery = Event.find(queryConditions)
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(limit);

    const events = await populateEventDetails(eventsQuery);
    const totalResultsCount = await Event.countDocuments(eventsQuery);

    if (!events) {
      throw new Error("SERVER ERROR: Failed to fetch events organized");
    }

    return {
      data: JSON.parse(JSON.stringify(events)),
      totalResults: Math.ceil(totalResultsCount / limit),
    };
  } catch (error) {
    handleError(error);
  }
};
