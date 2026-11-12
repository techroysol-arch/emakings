import type { AIOutput } from "./validation";
export type Person = {
  id: string;
  name: string;
  category: string;
  interests: string;
  notes: string;
  important_date: string | null;
  occasion: string;
  created_at?: string;
};
export type Reminder = {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  completed: boolean;
  created_at?: string;
};
export type Generation = {
  id: string;
  occasion: string;
  category: string;
  result: AIOutput;
  created_at: string;
};
export type Preferences = { display_name: string; save_generations: boolean };
export type WorkspaceData = {
  relationships: Person[];
  reminders: Reminder[];
  ai_generations: Generation[];
  user_preferences: Preferences[];
};
export const emptyWorkspace: WorkspaceData = {
  relationships: [],
  reminders: [],
  ai_generations: [],
  user_preferences: [],
};
export function sampleWorkspace(): WorkspaceData {
  const day = (offset: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };
  return {
    relationships: [
      {
        id: "demo-jamie",
        name: "Jamie",
        category: "Partner",
        interests: "Books, travelling, photography",
        notes:
          "Loves quiet bookshops and coffee. Prefers experiences over things.",
        important_date: day(7),
        occasion: "Anniversary",
      },
      {
        id: "demo-sam",
        name: "Sam",
        category: "Friend",
        interests: "Hiking, cooking, music",
        notes: "Ask how the new job is going.",
        important_date: day(12),
        occasion: "Birthday",
      },
      {
        id: "demo-mom",
        name: "Mom",
        category: "Family",
        interests: "Gardening, art, Sunday walks",
        notes: "A handwritten card always makes her day.",
        important_date: null,
        occasion: "",
      },
    ],
    reminders: [
      {
        id: "demo-anniversary",
        title: "Plan a little anniversary surprise",
        date: day(4),
        time: "10:00",
        description:
          "Bookshop date with Jamie. Find a book and write a note inside.",
        completed: false,
      },
      {
        id: "demo-checkin",
        title: "Check in with Sam",
        date: day(1),
        time: "17:30",
        description: "Ask about the first week at the new job.",
        completed: false,
      },
    ],
    ai_generations: [],
    user_preferences: [{ display_name: "Alex", save_generations: true }],
  };
}
export function displayDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
