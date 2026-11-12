import type { AIInput, AIOutput } from "./validation";
export const defaultInput: AIInput = {
  occasion: "Partner’s birthday",
  interests: "Books, travelling, and photography",
  relationship: "Partner",
  tone: "Warm & thoughtful",
  category: "Everything",
  context: "",
};
export function sampleSuggestion(input: AIInput): AIOutput {
  const interests = input.interests
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
  const subject = interests[0] || "their favourite hobby";
  const greetings = {
    "Warm & thoughtful":
      "You make the everyday feel a little more extraordinary.",
    Romantic: "Every chapter with you is my favourite adventure.",
    Playful: "Another year of being my favourite human. Lucky me!",
    "Simple & sincere": "I’m grateful to have you in my life.",
  };
  return {
    message: `For ${input.occasion.toLowerCase()}: ${greetings[input.tone]} Here’s to more shared moments, more ${subject.toLowerCase()}, and more memories worth keeping. I hope you feel as appreciated as you are.`,
    gifts: [
      {
        title: `A personal take on ${subject.toLowerCase()}`,
        reason:
          "Choose something connected to an interest they shared, and add a handwritten note.",
      },
      {
        title: "A little adventure together",
        reason: `Plan a local experience inspired by ${interests[1] || subject}. Keep the budget comfortable.`,
      },
      {
        title: "A keepsake of your favourite moment",
        reason:
          "Print a meaningful photo and write the story behind it on the back.",
      },
    ],
    gesture: `Set aside an unhurried afternoon for ${subject.toLowerCase()}. Let them choose the details, and put your phone away.`,
    followUp:
      "Add a reminder a few days before the occasion to prepare your note and check any booking.",
  };
}
