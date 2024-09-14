import stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { createOrder } from "@/lib/actions/order.actions";

export async function POST(req: NextRequest) {
  const body = await req.text();

  const sig = req.headers.get("stripe-signature") as string;
  const endpointSecrect = process.env.STRIPE_WEBHOOK_SECRET!;

  let event;

  try {
    // verify webhook payload
    event = stripe.webhooks.constructEvent(body, sig, endpointSecrect);
  } catch (err) {
    return NextResponse.json({ message: "Webhook Error", error: err });
  }

  // get webhook event type
  const eventType = event.type;

  // process checkout completed event
  if (eventType === "checkout.session.completed") {
    // retreive checkout info from payload
    const { id, amount_total, metadata } = event.data.object;
    // construct order object
    const stripeOrder = {
      stripeId: id,
      eventId: metadata?.eventId || "",
      buyerId: metadata?.buyerId || "",
      totalAmount: amount_total ? (amount_total / 100).toString() : "0",
      createdAt: new Date(),
    };
    // create order in DB
    const newOrder = await createOrder(stripeOrder);
    // acknowledgement to stripe request received and processed successfully
    return NextResponse.json({ message: "OK", order: newOrder });
  }

  return new Response("", { status: 200 });
}
