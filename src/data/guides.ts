/**
 * Original long-form guide content for Moments Gallari.
 *
 * These are genuine, hand-written editorial articles about AI image prompting.
 * They exist to give the site real, substantial, unique content beyond the
 * prompt gallery itself — useful to readers and to search engines alike.
 */

export interface GuideSection {
  heading: string;
  /** Paragraphs of body copy. */
  body: string[];
  /** Optional bullet list rendered after the paragraphs. */
  list?: string[];
}

export interface Guide {
  slug: string;
  title: string;
  description: string;
  /** Short category label shown on cards. */
  category: string;
  /** Estimated reading time, e.g. "6 min read". */
  readingTime: string;
  /** ISO date the article was last updated. */
  updated: string;
  /** One or two intro paragraphs shown under the title. */
  intro: string[];
  sections: GuideSection[];
}

export const guides: Guide[] = [
  {
    slug: "how-to-write-ai-image-prompts",
    title: "How to Write AI Image Prompts That Actually Work",
    description:
      "A practical, beginner-friendly guide to writing AI image prompts — structure, the words that matter most, and a repeatable formula you can reuse for any style.",
    category: "Fundamentals",
    readingTime: "8 min read",
    updated: "2026-06-20",
    intro: [
      "A great AI image almost always starts with a great prompt. The same model can produce a flat, generic picture or a striking, gallery-worthy one depending entirely on the words you feed it. The good news is that prompt writing is a skill, not a secret — and once you understand the structure behind a strong prompt, you can recreate almost any look you can describe.",
      "This guide walks through a simple, repeatable formula for writing prompts, explains which words carry the most weight, and shows you how to refine a result instead of starting over every time.",
    ],
    sections: [
      {
        heading: "The anatomy of a strong prompt",
        body: [
          "Most effective prompts, no matter the tool, follow the same underlying order: subject, then context, then style, then technical details. When you keep that order in mind, your prompts become easier to read, easier to edit, and far more consistent.",
          "Think of it as answering four questions in sequence: Who or what is in the image? Where are they and what are they doing? What artistic style should it look like? And finally, what camera, lighting and quality settings should the model emulate?",
        ],
        list: [
          "Subject — the main focus (a woman holding flowers, a vintage car, a mountain lake).",
          "Context — the setting, action and mood (standing in a golden flower garden at sunset).",
          "Style — the artistic direction (cinematic photography, watercolour illustration, 3D render).",
          "Technical detail — camera, lens, lighting and quality cues (85mm lens, f/1.4, soft rim light, 8K).",
        ],
      },
      {
        heading: "The words that move the needle most",
        body: [
          "Not all words in a prompt are equal. A handful of categories do most of the heavy lifting, and learning to reach for them first will improve your results faster than anything else.",
          "Lighting words are the single biggest lever. Phrases like 'golden hour', 'soft window light', 'dramatic rim light' or 'moody low-key lighting' change the entire emotional tone of an image. After lighting, composition and lens language ('shallow depth of field', 'wide-angle', 'close-up portrait') shape how the subject sits in the frame. Only then do colour and texture cues fine-tune the look.",
        ],
      },
      {
        heading: "A formula you can reuse",
        body: [
          "If you want a dependable starting point, try this template and fill in the blanks: '[subject], [doing something] in [setting], [style] style, [lighting], [camera/lens], [quality cues]'.",
          "For example: 'A young woman laughing in a sunlit wildflower field, cinematic photography style, warm golden-hour light, 85mm lens with shallow depth of field, ultra-detailed, photorealistic.' That single sentence already contains everything the model needs to produce something polished, and every bracket is a place you can swap in your own idea.",
        ],
      },
      {
        heading: "Refine, don't restart",
        body: [
          "Beginners often throw away a prompt the moment the first image disappoints. Experienced creators do the opposite: they change one thing at a time. If the lighting feels flat, adjust only the lighting words. If the face is too stylised, lower the stylisation and describe the features more precisely. If the composition feels cramped, change the lens or framing.",
          "By isolating one variable per generation, you learn what each word actually does — and you converge on the image you pictured far more quickly than by rewriting the whole prompt from scratch.",
        ],
      },
      {
        heading: "Common mistakes to avoid",
        body: [
          "A few habits quietly sabotage otherwise good prompts. Watch out for these:",
        ],
        list: [
          "Overloading the prompt with twenty competing adjectives — the model averages them into mush. Be specific, not exhaustive.",
          "Contradictory instructions, like 'minimalist' and 'highly detailed ornate background' in the same line.",
          "Forgetting the negative prompt, which is where you remove unwanted artefacts like extra fingers or watermarks.",
          "Ignoring aspect ratio — a portrait subject in a wide landscape frame rarely looks right.",
        ],
      },
    ],
  },
  {
    slug: "best-ai-image-generators-compared",
    title: "Midjourney vs Stable Diffusion vs Google Gemini: Which Should You Use?",
    description:
      "An honest comparison of the most popular AI image generators in 2026 — strengths, weaknesses, and which one fits your project best.",
    category: "Tools",
    readingTime: "7 min read",
    updated: "2026-06-22",
    intro: [
      "There is no single 'best' AI image generator — only the best one for a particular job. Each major tool has a distinct personality: a look it nails effortlessly and a few things it struggles with. Knowing those tendencies saves you hours of trial and error.",
      "Here is a practical, plain-English comparison of the three generators most people reach for today, and guidance on which to pick for different kinds of work.",
    ],
    sections: [
      {
        heading: "Midjourney — the cinematic specialist",
        body: [
          "Midjourney has long been the go-to for images that look like a film still or a high-end editorial photo. Out of the box it produces rich lighting, pleasing composition and a polished, slightly stylised aesthetic that many people find instantly attractive.",
          "Its character reference feature makes it strong for keeping a consistent face or character across multiple images. The trade-offs: it runs through a subscription, gives you slightly less granular control than open tools, and its 'house style' can creep into everything unless you steer against it.",
        ],
      },
      {
        heading: "Stable Diffusion — the flexible workhorse",
        body: [
          "Stable Diffusion (and its SDXL family) is the most customisable option. Because it can run on your own hardware and supports a huge ecosystem of fine-tuned models, LoRAs and control tools, it is unbeatable when you need precise, repeatable control — exact poses, specific art styles, or a consistent brand look.",
          "The cost of that flexibility is a steeper learning curve. You'll spend more time configuring settings and choosing models, but in return you get the deepest control of any tool here, and you can run it privately and free if you have a capable GPU.",
        ],
      },
      {
        heading: "Google Gemini — identity and everyday ease",
        body: [
          "Gemini's image tools have become a popular choice for prompts built around a reference photo, because they are particularly good at preserving a person's facial identity while restyling everything around them. They are also approachable: conversational, forgiving of loosely written prompts, and well integrated into everyday workflows.",
          "If your goal is to take a selfie and turn it into a polished poster while keeping the face recognisable, this is often the smoothest path. For highly stylised art or pixel-level control, the other two tools still lead.",
        ],
      },
      {
        heading: "Which one should you choose?",
        body: [
          "Match the tool to the task rather than hunting for an all-round winner:",
        ],
        list: [
          "Cinematic portraits and posters → Midjourney for look, Gemini if you're working from a reference photo.",
          "Maximum control, custom styles, private/free use → Stable Diffusion.",
          "Quick edits and identity-preserving restyles → Google Gemini.",
          "Consistent characters across a series → Midjourney character reference or a Stable Diffusion LoRA.",
        ],
      },
      {
        heading: "You don't have to pick just one",
        body: [
          "Many creators use several tools in a single project: Midjourney to explore a look, Stable Diffusion to lock in fine control, and an identity-focused tool for the final portrait pass. The prompts in our gallery are written to be portable, so you can copy one and try it across whichever generator suits the moment.",
        ],
      },
    ],
  },
  {
    slug: "understanding-negative-prompts",
    title: "Negative Prompts Explained: How to Remove the Things You Don't Want",
    description:
      "Learn what a negative prompt is, why it matters, and exactly which terms to include to avoid distorted hands, bad anatomy, watermarks and other common AI artefacts.",
    category: "Techniques",
    readingTime: "5 min read",
    updated: "2026-06-18",
    intro: [
      "If your AI images keep coming out with mangled hands, extra limbs or odd watermarks, the fix is usually one you've been ignoring: the negative prompt. It's one of the most powerful and most underused tools in image generation.",
      "This short guide explains what a negative prompt does and gives you a reliable starting set you can paste into almost any generation.",
    ],
    sections: [
      {
        heading: "What a negative prompt actually does",
        body: [
          "A normal prompt tells the model what you want. A negative prompt tells it what to avoid. Behind the scenes, the model steers away from the concepts you list, which is the most direct way to suppress recurring problems.",
          "It is especially useful because some artefacts are statistically common — anatomy errors, blur, low resolution — and naming them explicitly nudges the model toward cleaner output without you having to change your main idea at all.",
        ],
      },
      {
        heading: "A dependable starting set",
        body: [
          "You don't need a giant negative prompt. A focused list covering anatomy, quality and unwanted overlays handles most situations:",
        ],
        list: [
          "Anatomy: extra fingers, bad hands, distorted face, deformed limbs, duplicate limbs, mutated.",
          "Quality: blurry, low quality, low resolution, jpeg artefacts, grainy.",
          "Overlays: watermark, signature, text artefacts, logo.",
          "Style slips: cartoon (if you want realism), oversaturated, washed out.",
        ],
      },
      {
        heading: "Tailor it to the image",
        body: [
          "The best negative prompts are specific to what you're making. Generating a clean studio portrait? Add 'busy background, clutter'. Going for natural skin? Add 'plastic skin, over-smoothed'. Want accurate on-image text? Add 'misspelled text, gibberish letters'.",
          "Think of the negative prompt as a running list of 'things that went wrong last time'. Each time an artefact appears, add a word or two to push it out of future generations.",
        ],
      },
      {
        heading: "Don't overdo it",
        body: [
          "It is possible to over-constrain an image. If you stuff dozens of negatives in, you can accidentally strip away detail or flatten the result. Start small, add terms only when you actually see a problem, and remove ones that aren't earning their place. A tight, intentional negative prompt beats a long, copy-pasted one every time.",
        ],
      },
    ],
  },
  {
    slug: "cinematic-lighting-and-color-grading",
    title: "Cinematic Lighting and Colour Grading in AI Prompts",
    description:
      "The lighting and colour vocabulary that turns a flat AI image into a cinematic one — golden hour, rim light, colour grades and how to combine them.",
    category: "Techniques",
    readingTime: "6 min read",
    updated: "2026-06-24",
    intro: [
      "Ask any photographer what separates a snapshot from a cinematic image and they'll say the same thing: light. The exact same subject can feel ordinary or breathtaking depending on how it's lit and graded. In AI prompting, lighting and colour words are the fastest way to lift an image from 'fine' to 'wow'.",
      "This guide gives you a working vocabulary for both, and shows how to layer them for a polished, film-like result.",
    ],
    sections: [
      {
        heading: "Lighting words and what they do",
        body: [
          "Each lighting phrase evokes a distinct mood. Learning a handful gives you a dial you can turn from soft and romantic to bold and dramatic.",
        ],
        list: [
          "Golden hour — warm, low, flattering sunlight just after sunrise or before sunset; ideal for romantic and lifestyle looks.",
          "Soft window light — gentle, diffused, even; great for natural portraits and a calm mood.",
          "Rim light / backlight — a bright outline behind the subject that separates them from the background and adds drama.",
          "Low-key lighting — mostly shadow with selective highlights; moody, cinematic and intense.",
          "High-key lighting — bright, airy, minimal shadow; clean, optimistic, editorial.",
        ],
      },
      {
        heading: "Colour grading sets the emotion",
        body: [
          "Colour grading is the overall colour treatment of an image, and it carries enormous emotional weight. Warm grades — amber, honey, gold — feel intimate and nostalgic. Cool grades — teal, blue, steel — feel modern, calm or tense. The famous 'teal and orange' look pairs warm skin tones against cool backgrounds for a blockbuster feel.",
          "In a prompt, you can call these out directly: 'warm golden colour grade', 'cool cinematic teal-and-orange grade', or 'muted desaturated film look'. The model will bias the whole palette accordingly.",
        ],
      },
      {
        heading: "Layering light and colour together",
        body: [
          "The magic happens when you combine the two intentionally. Golden-hour light with a warm grade doubles down on romance. Rim light with a cool teal grade feels like a modern thriller. Soft window light with a muted grade reads as quiet and editorial.",
          "A simple way to write it: state the light source first, then the grade, then a quality cue. For example: 'soft golden-hour backlight, warm honey colour grade, gentle film grain, photorealistic'. Each clause stacks toward a coherent cinematic feel.",
        ],
      },
      {
        heading: "Reference the gear when you want realism",
        body: [
          "If your goal is photographic realism, naming camera and lens characteristics reinforces the lighting. Phrases like '85mm portrait lens, f/1.4, shallow depth of field' tell the model to render soft background blur and natural compression, which makes the lighting read as real rather than illustrated. Pair that with your lighting and grade choices and the result starts to look genuinely shot, not generated.",
        ],
      },
    ],
  },
  {
    slug: "ethical-use-of-ai-portraits",
    title: "Using Photos of Real People in AI Art: Consent, Ethics and Good Practice",
    description:
      "A clear, practical guide to using reference photos of real people responsibly — consent, privacy, and how to create identity-based AI portraits the right way.",
    category: "Responsible AI",
    readingTime: "6 min read",
    updated: "2026-06-26",
    intro: [
      "Many of the most popular AI poster and portrait prompts work from a reference photo of a real person. That capability is powerful and genuinely fun — turning a simple selfie into a cinematic poster — but it also comes with responsibilities. Using someone's likeness is not the same as using a stock background.",
      "This guide lays out simple, practical principles for creating identity-based AI portraits in a way that respects the people involved. It is general guidance, not legal advice, but following it will keep your work both ethical and welcome.",
    ],
    sections: [
      {
        heading: "Start with consent",
        body: [
          "The single most important rule is also the simplest: only use photos of people who have agreed to it. A photo of yourself is the easy case. For anyone else — a friend, a partner, a family member — ask first, and be clear about what you intend to make.",
          "Never use a stranger's photo, scrape images from social media, or recreate a public figure in compromising or misleading situations. Consent isn't a formality; it's the line between a thoughtful gift and a violation.",
        ],
      },
      {
        heading: "Respect privacy and context",
        body: [
          "Even with permission, think about context. An image that's flattering and fun in a private message could feel very different if it's posted publicly or used commercially. When in doubt, ask the person how they're comfortable having the image shared.",
          "Be especially careful with images of children. The safest approach is to only ever create such images of your own family, keep them private, and never share them in public galleries.",
        ],
      },
      {
        heading: "Be honest that it's AI",
        body: [
          "AI portraits can be strikingly realistic, which is exactly why honesty matters. If you share a generated image somewhere it might be mistaken for a real photograph, label it as AI-generated. This protects the person depicted, sets clear expectations for viewers, and is increasingly expected by platforms and audiences alike.",
        ],
      },
      {
        heading: "Avoid harmful or deceptive uses",
        body: [
          "Some uses are never acceptable, regardless of consent. Don't create content that defames, sexualises without consent, impersonates someone to deceive, or places a person in a context designed to mislead. A useful test: would the person be comfortable seeing this image and knowing how it was made and shared?",
        ],
      },
      {
        heading: "Good practice in a nutshell",
        body: [
          "If you remember nothing else, remember this short checklist whenever a prompt asks for a reference photo:",
        ],
        list: [
          "Use only photos you own or have explicit permission to use.",
          "Ask the person how they're comfortable having the result shared.",
          "Label realistic results as AI-generated when sharing publicly.",
          "Keep images of children private and limited to your own family.",
          "Never use AI portraits to deceive, harass, or misrepresent anyone.",
        ],
      },
    ],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}
