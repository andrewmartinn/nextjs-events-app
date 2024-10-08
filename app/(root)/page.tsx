import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Collection from "@/components/shared/events-collection";
import { getAllEvents } from "@/lib/actions/event.actions";
import Search from "@/components/shared/search";
import { SearchParamProps } from "@/lib/definitions";
import CategoryFilter from "@/components/shared/category-filter";

export default async function Home({ searchParams }: SearchParamProps) {
  const page = Number(searchParams?.page) || 1;
  const searchText = (searchParams?.query as string) || "";
  const category = (searchParams?.category as string) || "";

  const events = await getAllEvents({
    query: searchText,
    category: category,
    page: page,
    limit: 6,
  });

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-contain py-5 md:py-10">
        <div className="wrapper grid grid-cols-1 gap-5 md:grid-cols-2 2xl:gap-0">
          <div className="flex flex-col justify-center gap-8">
            <h1 className="h1-bold">
              Discover, Connect, Experience: Your Events, Our Platform
            </h1>
            <p className="p-regular-20 md:p-regular-24">
              Experience the future through innovative events that bring ideas
              to life. Trusted by leading brands and with over 200+ successful
              events completed.
            </p>
            <Button asChild className="button w-full px-10 sm:w-fit">
              <Link href="#events">Discover Now</Link>
            </Button>
          </div>
          <Image
            src="/assets/images/hero.png"
            alt="hero image"
            width={1000}
            height={1000}
            className="max-h-[70vh] object-contain object-center 2xl:max-h-[50vh]"
          />
        </div>
      </section>
      <section
        id="events"
        className="wrapper my-8 flex flex-col gap-8 md:gap-12"
      >
        <h2 className="h2-bold">
          Trusted by <br />
          Thousands of Events
        </h2>
        <div className="flex w-full flex-col gap-5 md:flex-row">
          <Search />
          <CategoryFilter />
        </div>
        <Collection
          data={events?.data}
          emptyTitle="No Events Found"
          emptyMessage="There are currently no events available. Please check back later."
          collectionType="All_Events"
          limit={6}
          page={page}
          totalPages={events?.totalResults}
        />
      </section>
    </>
  );
}
