import { NextResponse } from "next/server";
import { validatePlatformUrl } from "@/lib/platform-url";

export const runtime = "nodejs";

type YoutubeOEmbed = {
  title?: string;
  author_name?: string;
  thumbnail_url?: string;
};

function getYoutubeVideoId(input: string): string | null {
  try {
    const url = new URL(input);
    const host = url.hostname.toLowerCase();
    let id: string | null = null;

    if (host === "youtu.be" || host === "www.youtu.be") {
      id = url.pathname.split("/").filter(Boolean)[0] ?? null;
    } else if (host.endsWith("youtube.com")) {
      if (url.pathname === "/watch") id = url.searchParams.get("v");
      else if (/^\/(embed|shorts|live|v)\//.test(url.pathname)) {
        id = url.pathname.split("/").filter(Boolean)[1] ?? null;
      }
    }

    return id && /^[\w-]{11}$/.test(id) ? id : null;
  } catch {
    return null;
  }
}

async function extractYoutubeData(input: unknown) {
  const url = validatePlatformUrl(input, "youtube");
  if (!url) throw new Error("URL YouTube tidak valid atau host tidak didukung.");

  const videoId = getYoutubeVideoId(url);
  if (!videoId) throw new Error("ID video YouTube tidak dapat dibaca.");

  // Use YouTube's public oEmbed endpoint for metadata. This avoids the
  // obsolete ytdl-core player-client flow that can fail with HTTP 410.
  const endpoint = new URL("https://www.youtube.com/oembed");
  endpoint.searchParams.set("url", `https://www.youtube.com/watch?v=${videoId}`);
  endpoint.searchParams.set("format", "json");

  const response = await fetch(endpoint, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(10_000),
    cache: "no-store",
  });

  if (!response.ok) {
    if (response.status === 404 || response.status === 401) {
      throw new Error("Video tidak tersedia untuk metadata publik (mungkin privat, dihapus, atau dibatasi).");
    }
    throw new Error(`YouTube oEmbed merespons HTTP ${response.status}.`);
  }

  const metadata = (await response.json()) as YoutubeOEmbed;
  if (!metadata.title) throw new Error("YouTube tidak mengembalikan metadata video.");

  return {
    title: metadata.title,
    thumbnail: metadata.thumbnail_url || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    duration: null,
    views: null,
    likes: null,
    channelName: metadata.author_name || "Unknown Channel",
    description: "",
    downloadLinks: { hd: null, sd: null, audio: null },
    metadataSource: "YouTube oEmbed",
  };
}

async function handleMetadata(input: unknown) {
  if (!validatePlatformUrl(input, "youtube")) {
    return NextResponse.json(
      { success: false, error: "URL YouTube tidak valid atau host tidak didukung." },
      { status: 400 },
    );
  }

  try {
    const data = await extractYoutubeData(input);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("YouTube metadata error:", error);
    const message = error instanceof Error ? error.message : "Terjadi kesalahan saat mengambil metadata.";
    return NextResponse.json({ success: false, error: message }, { status: 502 });
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Body request harus berupa JSON yang valid." },
      { status: 400 },
    );
  }

  const input = body && typeof body === "object" && "url" in body
    ? (body as { url?: unknown }).url
    : null;

  return handleMetadata(input);
}

export async function GET(request: Request) {
  const input = new URL(request.url).searchParams.get("url");
  return handleMetadata(input);
}
