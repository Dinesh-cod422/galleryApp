import { type Pin } from "@/data/mock-pins";

/**
 * Generates genuinely useful, human-readable editorial content for an individual
 * pin/prompt page. The output is derived from each pin's own tags, title and
 * prompt text so that every page reads differently instead of repeating a single
 * boilerplate block. This adds real explanatory value for visitors (and search
 * engines) on top of the raw copy-paste prompt.
 */

export interface PinFaq {
  question: string;
  answer: string;
}

export interface PinContent {
  /** A clean, plain-text title (falls back when the source title is empty/generic). */
  displayTitle: string;
  /** Short one-line summary used for meta descriptions and intros. */
  summary: string;
  /** 2 paragraphs of unique overview text. */
  overview: string[];
  /** Recommended tools for this style. */
  recommendedTools: string[];
  /** Step-by-step usage guidance. */
  howToSteps: { title: string; detail: string }[];
  /** Practical tips for getting the best result. */
  tips: string[];
  /** Per-page FAQ (also emitted as FAQPage structured data). */
  faqs: PinFaq[];
}

const GENERIC_TITLES = new Set([
  "",
  "create an ultra-realistic...",
  "untitled",
  "ai prompt",
]);

/** Build a readable title when the source data has a generic/empty one. */
function buildDisplayTitle(pin: Pin): string {
  const raw = (pin.title || "").trim();
  if (raw && !GENERIC_TITLES.has(raw.toLowerCase())) return raw;

  const tags = pin.filter || [];
  if (tags.length >= 2) return `${tags[0]} ${tags[1]} Prompt`;
  if (tags.length === 1) return `${tags[0]} AI Prompt`;
  return "Cinematic AI Portrait Prompt";
}

/** Lowercased searchable blob of a pin's text. */
function blob(pin: Pin): string {
  return `${pin.title} ${(pin.filter || []).join(" ")} ${pin.prompt}`.toLowerCase();
}

function has(text: string, ...needles: string[]): boolean {
  return needles.some((n) => text.includes(n));
}

/** Recommend image generators based on the look the prompt is going for. */
function recommendTools(text: string): string[] {
  const tools: string[] = [];
  // Identity-preserving / face reference prompts work best in tools with image input.
  if (has(text, "face", "identity", "reference image", "uploaded", "portrait", "selfie")) {
    tools.push("Google Gemini (Nano Banana) — strong facial identity from a reference photo");
    tools.push("Midjourney with --cref (character reference)");
  }
  if (has(text, "anime", "illustration", "digital painting", "watercolor")) {
    tools.push("Stable Diffusion / SDXL — great for stylised and illustrated looks");
  }
  if (has(text, "cinematic", "photorealistic", "8k", "realistic", "poster")) {
    tools.push("Midjourney v6+ — cinematic, photoreal lighting");
    tools.push("Flux — sharp photorealistic detail and clean typography");
  }
  // Always-useful fallbacks so the list is never empty.
  if (tools.length === 0) {
    tools.push("Midjourney", "Stable Diffusion (SDXL)", "Google Gemini");
  }
  // De-duplicate while preserving order.
  return Array.from(new Set(tools));
}

function buildSteps(pin: Pin, text: string): { title: string; detail: string }[] {
  const usesReference = has(text, "face", "identity", "reference image", "uploaded", "selfie");

  const steps: { title: string; detail: string }[] = [
    {
      title: "Copy the full prompt",
      detail:
        "Use the “Copy Full Prompt” button above to grab the complete text. Reading the whole prompt first helps you spot the parts you’ll want to personalise.",
    },
  ];

  if (usesReference) {
    steps.push({
      title: "Upload a clear reference photo",
      detail:
        "Pick a well-lit, front-facing photo of the person whose likeness you want to keep. A sharp, high-resolution face gives the model the best chance of preserving identity. Only use photos you have permission to use.",
    });
  }

  steps.push(
    {
      title: "Replace the placeholders",
      detail:
        "Swap any bracketed values — names, quotes, outfit colours or background details — with your own. The square-bracket sections are meant to be edited, not pasted verbatim.",
    },
    {
      title: "Paste into your AI image generator",
      detail: `Drop the prompt into a tool such as ${recommendTools(text)[0].split(" — ")[0]}. Keep the aspect ratio close to the original 4:5 portrait framing for the most faithful result.`,
    },
    {
      title: "Refine and iterate",
      detail:
        "Generate a few variations, then nudge the wording — stronger lighting, a different mood, a tighter crop — until it matches what you pictured. Small edits to the prompt often make a big difference.",
    },
  );

  return steps;
}

function buildTips(text: string): string[] {
  const tips: string[] = [];

  if (has(text, "typography", "text", "quote", "poster", "name")) {
    tips.push(
      "For clean lettering, keep the on-image text short. Long sentences are where AI generators most often introduce spelling errors — generate a few times and pick the cleanest one.",
    );
  }
  if (has(text, "face", "identity", "portrait", "selfie")) {
    tips.push(
      "If the face drifts from your reference, lower the creativity/stylize setting and describe the key features (hair, jawline, skin tone) explicitly in the prompt.",
    );
  }
  if (has(text, "negative prompt")) {
    tips.push(
      "Keep the negative prompt in place — it filters out common artefacts like extra fingers, distorted anatomy and watermarks.",
    );
  }
  tips.push(
    "Lighting verbs carry a lot of weight. Words like “golden hour”, “rim light” and “soft bokeh” change the whole mood, so adjust those first.",
    "Generate in batches of four and compare. The strongest image is rarely the first one — iteration is part of the process.",
  );

  return Array.from(new Set(tips));
}

function buildFaqs(pin: Pin, display: string, text: string): PinFaq[] {
  const tool = recommendTools(text)[0].split(" — ")[0];
  const faqs: PinFaq[] = [
    {
      question: `What is the “${display}” prompt used for?`,
      answer: `It’s a ready-to-use text prompt for generating a ${(pin.filter || ["cinematic"]).slice(0, 2).join(", ").toLowerCase()} style AI image. Copy it into your favourite image generator, personalise the editable parts, and create your own version.`,
    },
    {
      question: "Is this prompt free to use?",
      answer:
        "Yes. Every prompt in the gallery is free to copy, edit and use in your own AI generations. We only ask that you respect the rights of any people whose photos you upload as a reference.",
    },
    {
      question: `Which AI tool works best for this style?`,
      answer: `${tool} is a great starting point for this look, but the prompt is written to work across most modern generators including Midjourney, Stable Diffusion and Google Gemini.`,
    },
  ];

  if (has(text, "face", "identity", "reference", "selfie", "uploaded")) {
    faqs.push({
      question: "Do I need to upload a photo?",
      answer:
        "This prompt is designed around a reference image so the AI can keep a person’s likeness. Use a clear, front-facing photo that you own or have permission to use. You can also remove the identity lines to generate a fully imaginary subject.",
    });
  }

  return faqs;
}

export function getPinContent(pin: Pin): PinContent {
  const text = blob(pin);
  const display = buildDisplayTitle(pin);
  const tagList = (pin.filter || []).slice(0, 3).join(", ");

  const overview: string[] = [
    `${display} is a curated AI image prompt${tagList ? ` in the ${tagList.toLowerCase()} space` : ""}. It captures a specific, repeatable aesthetic so you can recreate the same polished look without starting from a blank page. Below you’ll find the full prompt along with a short guide on how to adapt it for your own images.`,
    `Great results with AI art come down to the wording of the prompt — the lighting, the camera language, the composition and the small descriptive details all steer the final image. This page breaks the prompt down and shows you how to use it, which tools suit it best, and how to tweak it so the output feels like your own.`,
  ];

  return {
    displayTitle: display,
    summary: `A ready-to-use ${tagList ? tagList.toLowerCase() + " " : ""}AI image prompt with a step-by-step guide on how to use and customise it.`,
    overview,
    recommendedTools: recommendTools(text),
    howToSteps: buildSteps(pin, text),
    tips: buildTips(text),
    faqs: buildFaqs(pin, display, text),
  };
}
