import { z } from "zod";
const text = (max = 500) => z.string().trim().min(1).max(max);
export const aiInput = z.object({
  occasion: text(150),
  interests: text(500),
  relationship: text(80),
  tone: z.enum([
    "Warm & thoughtful",
    "Romantic",
    "Playful",
    "Simple & sincere",
  ]),
  category: z.enum([
    "Everything",
    "Message",
    "Gift ideas",
    "Thoughtful gesture",
  ]),
  context: z.string().trim().max(1000).default(""),
});
export type AIInput = z.infer<typeof aiInput>;
export const aiOutput = z.object({
  message: text(3000),
  gifts: z.array(z.object({ title: text(150), reason: text(500) })).length(3),
  gesture: text(1000),
  followUp: text(500),
});
export type AIOutput = z.infer<typeof aiOutput>;
export const waitlistInput = z.object({
  name: text(100),
  email: z
    .email()
    .max(254)
    .transform((v) => v.toLowerCase()),
  website: z.string().max(0).optional(),
});
const date = z.iso.date();
export const personInput = z.object({
  name: text(100),
  category: text(60),
  interests: z.string().trim().max(1000),
  notes: z.string().trim().max(2000),
  important_date: date.nullable(),
  occasion: z.string().trim().max(100),
});
export const reminderInput = z.object({
  title: text(150),
  date,
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  description: z.string().trim().max(1000),
  completed: z.boolean().default(false),
});
export const preferencesInput = z.object({
  display_name: text(100),
  save_generations: z.boolean(),
});
