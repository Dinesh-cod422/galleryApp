import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

/** Only these hosts may ever reach an <iframe src>. */
const ALLOWED_EMBED_HOSTS = new Set(["instagram.com", "www.instagram.com"]);

/** Reject bodies larger than this before parsing them. */
const MAX_BODY_BYTES = 64 * 1024;

function isAllowedEmbedUrl(value: unknown): value is string {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && ALLOWED_EMBED_HOSTS.has(url.hostname);
  } catch {
    return false;
  }
}

/**
 * A pin must ship with our own render. Random image assignment is what produced
 * 13 distinct images across 111 pins and a 36% `og:image` 404 rate — it is a
 * content defect, not a convenience, so the path is required and validated here.
 */
function isAllowedImageUrl(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^\/pins\/[A-Za-z0-9._-]+\.(webp|png|jpg|jpeg)$/.test(value)
  );
}

// Helper function to auto-generate a generic title from the prompt
function generateTitle(prompt: string): string {
  if (!prompt) return "New Masterpiece";
  
  // Try to find a TITLE: declaration in the prompt
  const titleMatch = prompt.match(/TITLE:\s*([^\n]+)/i);
  if (titleMatch && titleMatch[1]) {
    // Return title capitalized nicely
    return titleMatch[1].trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  }

  // Fallback: take first 4 words of prompt
  const words = prompt.split(/\s+/).filter(Boolean);
  if (words.length === 0) return "Aesthetic Artwork";
  
  const shortTitle = words.slice(0, 5).join(" ");
  return shortTitle.length > 25 ? shortTitle.substring(0, 25) + "..." : shortTitle;
}

// Helper function to format prompt structure without changing core content
function formatPromptStructure(prompt: string): string {
  if (!prompt) return "";

  return prompt
    // Normalize newlines
    .replace(/\r\n/g, "\n")
    // Trim trailing/leading whitespace from each line
    .split("\n")
    .map(line => line.trim())
    .join("\n")
    // Ensure headings enclosed in ━━━━━━━━━━━━━━━━━━━━ have double newlines around them
    .replace(/([^\n])\n+(━+[^━]+━+)/g, "$1\n\n$2")
    .replace(/(━+[^━]+━+)\n+([^\n])/g, "$1\n\n$2")
    // Ensure all-caps labels (e.g., TITLE:, STYLE:, RULE:) have double newlines before them
    .replace(/([^\n])\n+([A-Z\s]+:)/g, "$1\n\n$2")
    // Reduce 3 or more consecutive newlines to just 2 newlines (good spacing)
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function POST(req: Request) {
  try {
    // 0. Authenticate BEFORE touching the body. This endpoint drives a
    // GITHUB_TOKEN-authenticated write to the repo that serves 100% of
    // production content, so it must never be reachable anonymously.
    const secret = process.env.UPLOAD_SECRET;
    if (!secret) {
      console.error("UPLOAD_SECRET is not configured; refusing all uploads.");
      return NextResponse.json({ error: "Uploads are disabled." }, { status: 503 });
    }
    if (req.headers.get("x-upload-secret") !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const declaredLength = Number(req.headers.get("content-length") ?? 0);
    if (declaredLength > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }

    const body = await req.json();
    const {
      embedUrl,
      imageUrl,
      prompt,
      filter,
      Tstatus,
      TrendingPosition,
    } = body;

    if (!embedUrl || !prompt) {
      return NextResponse.json(
        { error: "Missing required fields: embedUrl or prompt" },
        { status: 400 }
      );
    }

    if (!isAllowedEmbedUrl(embedUrl)) {
      return NextResponse.json(
        { error: "embedUrl must be an https://instagram.com URL." },
        { status: 400 }
      );
    }

    if (!isAllowedImageUrl(imageUrl)) {
      return NextResponse.json(
        { error: "imageUrl is required and must be a path like /pins/my-render.webp" },
        { status: 400 }
      );
    }

    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const repoOwner = "Dinesh-cod422";
    const repoName = "jsonFiles";
    const filePathInRepo = "dataofMomentsGalleryApp";
    const githubApiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePathInRepo}`;

    let pins: any[] = [];
    let sha = "";

    // 1. Fetch current data from GitHub to avoid overwriting existing new data
    if (GITHUB_TOKEN) {
      try {
        const getRes = await fetch(githubApiUrl, {
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: "application/vnd.github.v3+json",
          },
          cache: "no-store",
        });

        if (getRes.ok) {
          const fileData = await getRes.json();
          sha = fileData.sha;
          if (fileData.content) {
            const decodedContent = Buffer.from(fileData.content, "base64").toString("utf8");
            pins = JSON.parse(decodedContent);
          }
        } else {
          console.warn(`Failed to fetch file info from GitHub: ${getRes.statusText}`);
        }
      } catch (err) {
        console.error("Error fetching data from GitHub:", err);
      }
    }

    // 2. Fallback to local file if GitHub fetch failed or returned empty
    if (pins.length === 0) {
      try {
        const filePath = path.join(process.cwd(), "public", "pins.json");
        const fileContent = await fs.readFile(filePath, "utf8");
        pins = JSON.parse(fileContent);
      } catch (err) {
        console.error("Error reading local pins.json:", err);
      }
    }

    // Prevent duplicate entries
    const isDuplicate = pins.some((pin: any) => pin.embedUrl === embedUrl);
    if (isDuplicate) {
      return NextResponse.json(
        { error: "This pin has already been uploaded." },
        { status: 409 }
      );
    }

    // 3. Auto-generate ID
    let maxId = 0;
    for (const pin of pins) {
      const pinId = parseInt(pin.id, 10);
      if (!isNaN(pinId) && pinId > maxId) {
        maxId = pinId;
      }
    }
    const newId = (maxId + 1).toString();

    // 4. Auto-generate Title
    const generatedTitle = generateTitle(prompt);

    // NOTE: this route previously invented an `author` name and a randomuser.me
    // avatar for every pin, and assigned a random imageUrl. Attributing content to
    // people who do not exist is a Google Publisher Policies "Misrepresentation"
    // violation, so nothing here fabricates identity or media any more. The caller
    // supplies a real imageUrl; authorship belongs to the site itself.

    // Parse filter if it's sent as an array or comma-separated
    let parsedFilter: string[] = [];
    if (Array.isArray(filter)) {
      parsedFilter = filter;
    } else if (typeof filter === "string" && filter.trim() !== "") {
      parsedFilter = filter.split(",").map((f) => f.trim()).filter(Boolean);
    }

    const newPin = {
      id: newId,
      embedUrl,
      imageUrl,
      title: generatedTitle,
      prompt: formatPromptStructure(prompt),
      filter: parsedFilter,
      Tstatus: Tstatus || "Trending",
      TrendingPosition: TrendingPosition ? parseInt(TrendingPosition, 10) : 1,
    };

    // Prepend the new pin to the array
    pins.unshift(newPin);

    // Write the updated pins back to the local file (this will fail in production like Vercel due to read-only file system)
    try {
      const filePath = path.join(process.cwd(), "public", "pins.json");
      await fs.writeFile(filePath, JSON.stringify(pins, null, 2), "utf8");
    } catch (writeError) {
      console.warn("Could not write locally (expected in production):", writeError);
    }

    // Push directly to GitHub repository using REST API
    if (GITHUB_TOKEN) {
      try {
        const newContent = JSON.stringify(pins, null, 2);
        const encodedContent = Buffer.from(newContent).toString("base64");

        const putRes = await fetch(githubApiUrl, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: `Auto-add new pin: ${generatedTitle}`,
            content: encodedContent,
            sha: sha, // Include the sha we fetched earlier to update the file
          }),
        });

        if (!putRes.ok) {
          const errorData = await putRes.json().catch(() => ({}));
          throw new Error(`Failed to update file on GitHub: ${putRes.statusText} - ${JSON.stringify(errorData)}`);
        }

        console.log("Successfully pushed changes directly to GitHub repository");
      } catch (gitError) {
        console.error("GitHub API error:", gitError);
        // The GitHub file is the source of truth for production. If the push
        // failed the pin is NOT live, so this must not report success — the
        // local write above only ever lands on a dev filesystem.
        return NextResponse.json(
          { error: "Pin could not be published: the upstream write failed." },
          { status: 502 }
        );
      }
    } else {
      console.error("GITHUB_TOKEN not found; pin was not published.");
      return NextResponse.json(
        { error: "Uploads are not configured on this environment." },
        { status: 503 }
      );
    }

    return NextResponse.json({ success: true, pin: newPin });
  } catch (error) {
    // Log server-side only — echoing error.message leaked GitHub API details.
    console.error("Error saving pin:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
