"use client";

import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import { IEvent } from "@/lib/database/models/event.model";
import { Button } from "../ui/button";
import Checkout from "./checkout";

type CheckoutButtonProps = {
  event: IEvent;
};

export default function CheckoutButton({ event }: CheckoutButtonProps) {
  const { user } = useUser();
  const userId = user?.publicMetadata.userId as string;
  const hasEventFinished = new Date(event.endDateTime) < new Date();

  return (
    <div className="flex items-center gap-3">
      {/* conditionally render UI according to event end date */}
      {hasEventFinished ? (
        <p className="p-2 text-red-400">
          Sorry, tickets are no longer available
        </p>
      ) : (
        <>
          <SignedIn>
            <Checkout event={event} userId={userId} />
          </SignedIn>
          <SignedOut>
            <SignInButton>
              <Button className="rounded-full px-8">Get Tickets</Button>
            </SignInButton>
          </SignedOut>
        </>
      )}
    </div>
  );
}
