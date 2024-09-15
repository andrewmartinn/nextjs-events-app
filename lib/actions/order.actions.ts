"use server";

import Stripe from "stripe";
import { connectToDb } from "../database";
import { redirect } from "next/navigation";
import { ObjectId } from "mongodb";

import Order from "../database/models/order.model";
import Event from "../database/models/event.model";
import User from "../database/models/user.model";

import {
  CheckoutOrderParams,
  CreateOrderParams,
  GetOrdersByEventParams,
  GetOrdersByUserParams,
} from "../definitions";
import { handleError } from "../utils";

// CREATE STRIPE CHECKOUT SESSION
export const checkoutOrder = async (order: CheckoutOrderParams) => {
  // load stripe instance
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  // format price
  const price = order.isFree ? 0 : Number(order.price) * 100;

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: price,
            product_data: {
              name: order.eventTitle,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        eventId: order.eventId,
        buyerId: order.buyerId,
      },
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/profile`,
      cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/`,
    });

    redirect(session.url!);
  } catch (error) {
    throw error;
  }
};

// CREATE ORDER
export const createOrder = async (order: CreateOrderParams) => {
  try {
    await connectToDb();

    const newOrder = await Order.create({
      ...order,
      event: order.eventId,
      buyer: order.buyerId,
    });

    if (!newOrder) {
      throw new Error("SERVER ERROR: Failed to create order");
    }

    return JSON.parse(JSON.stringify(newOrder));
  } catch (error) {
    handleError(error);
  }
};

// GET ALL ORDERS FOR A SPECIFIC USER
export const getOrdersByUser = async ({
  userId,
  limit = 3,
  page,
}: GetOrdersByUserParams) => {
  try {
    await connectToDb();

    const skipAmount = (Number(page) - 1) * limit;
    const queryConditions = { buyer: userId };

    const orders = await Order.distinct("event._id")
      .find(queryConditions)
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(limit)
      .populate({
        path: "event",
        model: Event,
        populate: {
          path: "eventOrganizer",
          model: User,
          select: "_id firstName lastName",
        },
      });
    const totalResultsCount =
      await Order.distinct("event._id").countDocuments(queryConditions);

    if (!orders) {
      throw new Error("SERVER ERROR: Failed to get user orders");
    }

    return {
      data: JSON.parse(JSON.stringify(orders)),
      totalResults: Math.ceil(totalResultsCount / limit),
    };
  } catch (error) {
    handleError(error);
  }
};

// GET ALL ORDERS FOR A SPECIFIC EVENT
export const getOrdersByEvent = async ({
  eventId,
  searchString,
}: GetOrdersByEventParams) => {
  try {
    await connectToDb();

    if (!eventId) {
      throw new Error("SERVER ERROR: Event ID not provided");
    }

    const eventObjectId = new ObjectId(eventId);

    const orders = await Order.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "buyer",
          foreignField: "_id",
          as: "buyer",
        },
      },
      {
        $unwind: "$buyer",
      },
      {
        $lookup: {
          from: "events",
          localField: "event",
          foreignField: "_id",
          as: "event",
        },
      },
      {
        $unwind: "$event",
      },
      {
        $project: {
          _id: 1,
          totalAmount: 1,
          createdAt: 1,
          eventTitle: "$event.title",
          eventId: "$event._id",
          buyer: {
            $concat: ["$buyer.firstName", " ", "$buyer.lastName"],
          },
        },
      },
      {
        $match: {
          $and: [
            { eventId: eventObjectId },
            { buyer: { $regex: RegExp(searchString, "i") } },
          ],
        },
      },
    ]);

    return JSON.parse(JSON.stringify(orders));
  } catch (error) {
    handleError(error);
  }
};
