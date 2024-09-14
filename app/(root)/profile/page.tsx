import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

import { Button } from "@/components/ui/button";
import Collection from "@/components/shared/events-collection";

import { SearchParamProps } from "@/lib/definitions";
import { IOrder } from "@/lib/database/models/order.model";
import { getEventsByUser } from "@/lib/actions/event.actions";
import { getOrdersByUser } from "@/lib/actions/order.actions";

export default async function ProfilePage({ searchParams }: SearchParamProps) {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;

  // retrieve pagination count from URL
  const ordersPage = Number(searchParams?.ordersPage) || 1;
  const eventsPage = Number(searchParams?.eventsPage) || 1;

  // get all orders made by user
  const userOrders = await getOrdersByUser({ userId, page: ordersPage });
  // get event details from user orders
  const orderedEvents = userOrders?.data.map(
    (order: IOrder) => order.event || [],
  );
  // get events organized by user
  const organizedEvents = await getEventsByUser({ userId, page: eventsPage });

  return (
    <>
      {/* my tickets section */}
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className="h3-bold text-center sm:text-left">My Tickets</h3>
          <Button asChild className="button hidden px-10 sm:flex">
            <Link href="/#events">Explore More Events</Link>
          </Button>
        </div>
      </section>
      <section className="wrapper my-8">
        <Collection
          data={orderedEvents}
          emptyTitle="No Tickets Purchased"
          emptyMessage="Place an order to see your tickets."
          collectionType="My_Tickets"
          limit={3}
          page={ordersPage}
          urlParamName="ordersPage"
          totalPages={userOrders?.totalResults}
        />
      </section>

      {/* events organized section */}
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className="h3-bold text-center sm:text-left">Events Organized</h3>
          <Button asChild className="button hidden px-10 sm:flex">
            <Link href="/events/create">Create New Event</Link>
          </Button>
        </div>
      </section>
      <section className="wrapper my-8">
        <Collection
          data={organizedEvents?.data}
          emptyTitle="No Created Events to Show"
          emptyMessage="Organize some events and check back later."
          collectionType="Events_Organized"
          limit={6}
          page={eventsPage}
          urlParamName="eventsPage"
          totalPages={organizedEvents?.totalResults}
        />
      </section>
    </>
  );
}
