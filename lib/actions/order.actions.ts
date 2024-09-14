"use server";

import Stripe from "stripe";

import { CheckoutOrderParams, CreateOrderParams } from "../definitions";
import { redirect } from "next/navigation";
import { handleError } from "../utils";
import { connectToDb } from "../database";
import Order from "../database/models/order.model";

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
