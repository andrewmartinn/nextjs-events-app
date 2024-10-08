import Link from "next/link";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";

import DeleteConfirmation from "./delete-confirmation";

import { formatDateTime } from "@/lib/utils";
import { IEvent } from "@/lib/database/models/event.model";

type CardProps = {
  event: IEvent;
  hasOrderLink?: boolean;
  hidePrice?: boolean;
};

export default function Card({ event, hasOrderLink, hidePrice }: CardProps) {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;

  const isEventCreator = userId === event.eventOrganizer._id.toString();

  return (
    <div className="group relative flex min-h-[380px] w-full max-w-[400px] flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg md:min-h-[438px]">
      <Link
        href={`/events/${event._id}`}
        className="flex-center flex-grow bg-gray-50 bg-cover bg-center text-grey-500"
        style={{ backgroundImage: `url(${event.imageUrl})` }}
      />
      {isEventCreator && !hidePrice && (
        <div className="absolute right-2 top-2 flex flex-col gap-4 rounded-xl bg-white p-3 shadow-sm transition-all">
          <Link href={`/events/${event._id}/update`}>
            <Image
              src="/assets/icons/edit.svg"
              alt="edit"
              width={20}
              height={20}
              className="h-[20px] w-[20px]"
            />
          </Link>
          <DeleteConfirmation eventId={event._id} />
        </div>
      )}
      <div className="flex min-h-[230px] flex-col gap-3 p-5 md:gap-4">
        {!hidePrice && (
          <div className="flex gap-2">
            <span className="p-semibold-14 w-min rounded-full bg-green-100 px-4 py-1 text-green-600">
              {event.isFree ? "FREE" : `$${event.price}`}
            </span>
            <p className="p-semibold-14 w-min whitespace-nowrap rounded-full bg-grey-500/10 px-4 py-1 text-grey-500">
              {event.category.name}
            </p>
          </div>
        )}
        <p className="p-medium-16 p-medium-18 text-grey-500">
          {formatDateTime(event.startDateTime).dateTime}
        </p>
        <Link href={`/events/${event._id}`}>
          <p className="p-medium-16 md:p-medium-20 line-clamp-2 flex-1 text-black">
            {event.title}
          </p>
        </Link>
        <div className="flex-between w-full">
          <p className="p-medium-14 md:p-medium-16 capitalize text-grey-600">
            {event.eventOrganizer.firstName}
          </p>
          {hasOrderLink && (
            <Link href={`/orders?eventId=${event._id}`} className="flex gap-2">
              <p className="text-primary-500">Order Details</p>
              <Image
                src="/assets/icons/arrow.svg"
                alt="arrow"
                width={10}
                height={10}
                className="h-[10px] w-[10px]"
              />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
