/* eslint-disable @typescript-eslint/no-unused-vars */
import { IEvent } from "@/lib/database/models/event.model";
import Image from "next/image";
import Card from "./card";

type CollectionProps = {
  data: IEvent[];
  emptyTitle: string;
  emptyMessage: string;
  limit: number;
  page: number | string;
  totalPages?: number;
  urlParamName?: string;
  collectionType?: "All_Events" | "Events_Organized" | "My_Tickets";
};

export default function Collection({
  data,
  emptyTitle,
  emptyMessage,
  page,
  totalPages = 0,
  collectionType,
  urlParamName,
}: CollectionProps) {
  return (
    <>
      {data.length > 0 ? (
        <div className="flex flex-col items-center gap-10">
          <ul className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-10">
            {data.map((event) => {
              const hasOrderLink = collectionType === "Events_Organized";
              const hidePrice = collectionType === "My_Tickets";
              return (
                <li key={event._id} className="flex justify-center">
                  <Card
                    event={event}
                    hasOrderLink={hasOrderLink}
                    hidePrice={hidePrice}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <div className="flex-center wrapper min-h-[200px] w-full flex-col gap-3 rounded-[14px] bg-gray-50 py-28 text-center">
          <div className="flex items-center gap-2">
            <h3 className="p-bold-20 md:h5-bold">{emptyTitle}</h3>
            <Image
              src="/assets/icons/error.png"
              alt="error"
              height={34}
              width={34}
              className="h-[34px] w-[34px]"
            />
          </div>
          <p className="p-regular-14">{emptyMessage}</p>
        </div>
      )}
    </>
  );
}
