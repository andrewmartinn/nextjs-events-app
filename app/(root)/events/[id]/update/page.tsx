import { auth } from "@clerk/nextjs/server";
import EventForm from "@/components/shared/event-form";
import { getEventById } from "@/lib/actions/event.actions";

type UpateEventProps = {
  params: {
    id: string;
  };
};

export default async function UpdateEvent({ params: { id } }: UpateEventProps) {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;

  const event = await getEventById(id);
  console.log(event);

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left">
          Update Event
        </h3>
      </section>
      <div className="wrapper my-8">
        <EventForm
          userId={userId}
          type="Update"
          event={event}
          eventId={event._id}
        />
      </div>
    </>
  );
}
