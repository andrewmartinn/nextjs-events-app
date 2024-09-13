"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DatePicker from "react-datepicker";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

import FileUploader from "./file-uploader";
import DropdownSelect from "./dropdown-select";

import { eventFormSchema } from "@/lib/validator";
import { useUploadThing } from "@/lib/uploadthing";
import { eventFormDefaultValues } from "@/constants";

import { createEvent, updateEvent } from "@/lib/actions/event.actions";
import { IEvent } from "@/lib/database/models/event.model";

import "react-datepicker/dist/react-datepicker.css";

type EventFormProps = {
  userId: string;
  event?: IEvent;
  eventId?: string;
  type: "Create" | "Update";
};

export default function EventForm({
  userId,
  type,
  event,
  eventId,
}: EventFormProps) {
  const router = useRouter();

  const [imageFiles, setImageFiles] = useState<File[]>([]);

  // default form values incase of update use event values from prop
  const initialFormValues =
    type === "Update" && event
      ? {
          ...event,
          startDateTime: new Date(event.startDateTime),
          endDateTime: new Date(event.endDateTime),
        }
      : eventFormDefaultValues;

  const { startUpload } = useUploadThing("imageUploader");

  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: initialFormValues,
  });

  async function onSubmit(values: z.infer<typeof eventFormSchema>) {
    // get uploaded image url
    let uploadedImageUrl = values.imageUrl;
    // check if the user has uploaded image
    if (imageFiles.length > 0) {
      // upload image to uploadthing
      const uploadedImage = await startUpload(imageFiles);
      console.log(uploadedImage);
      if (!uploadedImage) {
        return;
      }
      uploadedImageUrl = uploadedImage[0].url;
    }

    if (type === "Create") {
      try {
        // form new event object
        const newEventData = {
          event: { ...values, imageUrl: uploadedImageUrl },
          userId,
          path: "/profile",
        };

        // create event on DB
        const createdEvent = await createEvent(newEventData);

        if (createdEvent) {
          form.reset();
          router.push(`/events/${createdEvent._id}`);
        }
      } catch (error) {
        console.log(error);
      }
    }

    if (type === "Update") {
      if (!eventId) {
        router.back();
        return;
      }

      try {
        const updateEventData = {
          event: { ...values, imageUrl: uploadedImageUrl, _id: eventId },
          userId,
          path: `/events/${eventId}`,
        };

        // update event on DB
        const updatedEvent = await updateEvent(updateEventData);

        // reset and redirect to event details
        if (updatedEvent) {
          form.reset();
          router.push(`/events/${updatedEvent._id}`);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    {...field}
                    className="input-field"
                    placeholder="Event title"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <DropdownSelect
                    onChangeHandler={field.onChange}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl className="h-72">
                  <Textarea
                    {...field}
                    placeholder="Description"
                    className="textarea rounded-2xl"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl className="h-72">
                  <FileUploader
                    onFieldChange={field.onChange}
                    imageUrl={field.value}
                    setImageFiles={setImageFiles}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center h-[54px] w-full overflow-hidden rounded-xl bg-grey-50 px-4 py-2">
                    <Image
                      src="/assets/icons/location-grey.svg"
                      alt="location"
                      width={24}
                      height={24}
                    />
                    <Input
                      {...field}
                      className="input-field"
                      placeholder="Event location or online"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="startDateTime"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center h-[54px] w-full overflow-hidden rounded-xl bg-grey-50 px-4 py-2">
                    <Image
                      src="/assets/icons/calendar.svg"
                      alt="calendar"
                      width={24}
                      height={24}
                      className="filter-grey h-[24px] w-[24px]"
                    />
                    <p className="ml-3 whitespace-nowrap text-grey-600">
                      Start Date:
                    </p>
                    <DatePicker
                      showTimeSelect
                      timeInputLabel="Time:"
                      wrapperClassName="datePicker"
                      dateFormat="MM/dd/yyyy h:mm aa"
                      selected={field.value}
                      onChange={(date: Date | null) => field.onChange(date)}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDateTime"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center h-[54px] w-full overflow-hidden rounded-xl bg-grey-50 px-4 py-2">
                    <Image
                      src="/assets/icons/calendar.svg"
                      alt="calendar"
                      width={24}
                      height={24}
                      className="filter-grey h-[24px] w-[24px]"
                    />
                    <p className="ml-3 whitespace-nowrap text-grey-600">
                      End Date:
                    </p>
                    <DatePicker
                      showTimeSelect
                      timeInputLabel="Time:"
                      wrapperClassName="datePicker"
                      dateFormat="MM/dd/yyyy h:mm aa"
                      selected={field.value}
                      onChange={(date: Date | null) => field.onChange(date)}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center h-[54px] w-full overflow-hidden rounded-xl bg-grey-50 px-4 py-2">
                    <Image
                      src="/assets/icons/dollar.svg"
                      alt="price"
                      width={24}
                      height={24}
                    />
                    <Input
                      {...field}
                      type="number"
                      placeholder="Price"
                      className="p-regular-16 border-0 bg-grey-50 outline-offset-0 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <FormField
                      control={form.control}
                      name="isFree"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="flex items-center">
                              <label
                                htmlFor="isFree"
                                className="whitespace-nowrap pr-3 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Free Ticket
                              </label>
                              <Checkbox
                                id="isFree"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="mr-2 size-5 border-2 border-primary-500"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center h-[54px] w-full overflow-hidden rounded-xl bg-grey-50 px-4 py-2">
                    <Image
                      src="/assets/icons/link.svg"
                      alt="url"
                      width={24}
                      height={24}
                    />
                    <Input
                      {...field}
                      className="input-field"
                      placeholder="Event link"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="button col-span-2 w-full"
        >
          {form.formState.isSubmitting ? (
            <div className="flex items-center gap-2">
              <div
                className="text-surface inline-block size-6 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                role="status"
              />
              <span>Submitting...</span>
            </div>
          ) : (
            `${type} Event`
          )}
        </Button>
      </form>
    </Form>
  );
}
