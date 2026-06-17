import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

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
    const body = await req.json();
    const {
      embedUrl,
      prompt,
      filter,
      Tstatus,
      TrendingPosition,
    } = body;

    // We no longer require title from the frontend, only embedUrl and prompt.
    if (!embedUrl || !prompt) {
      return NextResponse.json(
        { error: "Missing required fields: embedUrl or prompt" },
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

    // 5. Auto-generate Image URL (random from 1 to 10)
    const randomImgId = Math.floor(Math.random() * 10) + 1;
    const generatedImageUrl = `/pins/${randomImgId}.webp`;

    // 6. Auto-generate Author
    const authors = ["CinematicArt", "AestheticVibes", "PremiumGallery", "CreativeStudio", "ArtisticSoul", "LoveArt"];
    const generatedAuthor = authors[Math.floor(Math.random() * authors.length)];

    // 7. Auto-generate Avatar URL
    const gender = Math.random() > 0.5 ? "women" : "men";
    const avatarId = Math.floor(Math.random() * 90) + 1;
    const generatedAvatarUrl = `https://randomuser.me/api/portraits/${gender}/${avatarId}.jpg`;

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
      imageUrl: generatedImageUrl,
      title: generatedTitle,
      author: generatedAuthor,
      avatarUrl: generatedAvatarUrl,
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
      } catch (gitError: any) {
        console.error("GitHub API error:", gitError);
        return NextResponse.json(
          { 
            success: true, 
            message: "Pin saved successfully locally, but failed to push directly to GitHub.",
            gitError: gitError.message
          },
          { status: 200 }
        );
      }
    } else {
      console.warn("GITHUB_TOKEN not found, skipping GitHub push.");
    }

    return NextResponse.json({ success: true, pin: newPin });
  } catch (error: any) {
    console.error("Error saving pin:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
