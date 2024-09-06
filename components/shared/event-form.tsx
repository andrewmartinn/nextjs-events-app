"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { eventFormSchema } from "@/lib/validator";
import { eventFormDefaultValues } from "@/constants";

type EventFormProps = {
  userId: string;
  type: "Create" | "Update";
};

export default function EventForm({ userId, type }: EventFormProps) {
  console.log("[event-form] userId, formType", userId, type);

  // default form field values
  const initialFormValues = eventFormDefaultValues;

  // 1. Define your form.
  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: initialFormValues,
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof eventFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        {/* event title input */}
        {/* event category select dropdown */}
        {/* event description input */}
        {/* file upload input */}
        {/* event location input */}
        {/* event start date input */}
        {/* event end date input */}
        {/* event price input */}
        {/* event url input */}
        <Button type="submit">Create Event</Button>
      </form>
    </Form>
  );
}
