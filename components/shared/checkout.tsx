"use client";

import { useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";

import { Button } from "../ui/button";

import { IEvent } from "@/lib/database/models/event.model";
import { checkoutOrder } from "@/lib/actions/order.actions";

type CheckoutProps = {
  userId: string;
  event: IEvent;
};

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function Checkout({ userId, event }: CheckoutProps) {
  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      console.log("Order placed! You will receive an email confirmation.");
    }

    if (query.get("canceled")) {
      console.log(
        "Order canceled -- continue to shop around and checkout when you’re ready.",
      );
    }
  }, []);

  const handleCheckout = async () => {
    console.log("Checkout successful");
    // create checkout object
    const order = {
      eventTitle: event.title,
      eventId: event._id,
      price: event.price,
      isFree: event.isFree,
      buyerId: userId,
    };
    console.log(order);
    // pass order object to create a checkout session
    await checkoutOrder(order);
  };
  return (
    <form action={handleCheckout}>
      <Button type="submit" role="link" className="rounded-full px-8 sm:w-fit">
        {event.isFree ? "Get Ticket" : "Buy Ticket"}
      </Button>
    </form>
  );
}
