import { z } from "zod";

export const eventTypes = [
  "athletic",
  "conference",
  "film_production",
  "event",
  "rehearsal",
  "meeting",
  "other",
] as const;

export const spaceTypes = [
  "studio",
  "warehouse",
  "event_hall",
  "outdoor",
  "gym",
  "classroom",
  "office",
  "other",
] as const;

export const createRequestSchema = z.object({
  eventType: z.enum(eventTypes, {
    message: "Please select a valid event type",
  }),
  spaceType: z.enum(spaceTypes, {
    message: "Please select a valid space type",
  }),
  // Support dates parsed from strings (e.g. ISO string datetime representation)
  startDate: z.string().datetime({ message: "Start date must be a valid ISO datetime string" }),
  endDate: z.string().datetime({ message: "End date must be a valid ISO datetime string" }),
  budget: z.coerce
    .number()
    .positive({ message: "Hourly budget must be a positive number" }),
  headcount: z.coerce
    .number()
    .int()
    .positive({ message: "Capacity headcount must be a positive integer" }),
  amenities: z.string().min(2, { message: "Amenities preference must be at least 2 characters" }),
  locationPreference: z.string().min(3, { message: "Location preference must be at least 3 characters" }),
  notes: z.string().max(1000, { message: "Notes must be under 1000 characters" }).optional().nullable(),
});

export type CreateRequestInput = z.infer<typeof createRequestSchema>;

export const createProposalSchema = z.object({
  requestId: z.string().uuid({ message: "Invalid request ID" }),
  sublerLink: z.string().url({ message: "Please enter a valid URL" }),
  pitch: z.string().min(10, { message: "Pitch must be at least 10 characters" }).max(500, { message: "Pitch must be under 500 characters" }),
});

export type CreateProposalInput = z.infer<typeof createProposalSchema>;
