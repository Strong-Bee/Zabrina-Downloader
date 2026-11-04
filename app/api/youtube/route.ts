import { NextResponse } from "next/server";
import ytdl from "ytdl-core";
import { validatePlatformUrl } from "@/lib/platform-url";

export const runtime = "nodejs";

type YoutubeMetadata = {
  title: string;
  thumbnail: string;
  duration: string | null;
  views: number | null;
  likes: number | null;
  channelName: string;
  description: string;
  downloadLinks: { hd: string | null; sd: string | null; audio: string | null };
  metadataSource: "ytdl" | "oembed";
};

async function extractWithYtdl(url: string): Promise<YoutubeMetadata> {
  const info = await ytdl.getInfo(url);
  const details = info.videoDetails;
  const progressive = ytdl.filterFormats(info.formats, "videoandaudio");
  const audio = ytdl.filterFormats(info.formats, "audioonly");
  const seconds = Number(details.lengthSeconds) || 0;

  return {
    title: details.title || "Video YouTube",
    thumbnail: details.thumbnails?.at(-1)?.url || "",
    duration: `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`,
    views: Number(details.viewCount) || 0,
    likes: Number(details.likes) || 0,
    channelName: details.author?.name || "Unknown Channel",
    description: details.description || "",
    downloadLinks: {
      hd: progressive.find((format) => format.qualityLabel === "720p")?.url || progressive[0]?.url || null,
      sd: progressive.find((format) => format.qualityLabel === "480p" || format.qualityLabel === "360p")?.url || null,
      audio: audio[0]?.url || null,
    },
    metadataSource: "ytdl",
  };
}

async function extractWithOembed(url: string): Promise<YoutubeMetadata> {
  const endpoint = new URL("https://www.youtube.com/oembed");
  endpoint.searchParams.set("url", url);
  endpoint.searchParams.set("format", "json");

  const response = await fetch(endpoint, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(10000),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`YouTube oEmbed returned HTTP ${response.status}`);
  }

  const data: unknown = await response.json();
  if (!data || typeof data !== "object" || !("title" in data) || typeof data.title !== "string") {
    throw new Error("YouTube oEmbed returned an invalid response");
  }

  const metadata = data as {
    title: string;
    author_name?: string;
    thumbnail_url?: string;
  };

  return {
    title: metadata.title,
    thumbnail: metadata.thumbnail_url || "",
    duration: null,
    views: null,
    likes: null,
    channelName: metadata.author_name || "Unknown Channel",
    description: "",
    downloadLinks: { hd: null, sd: null, audio: null },
    metadataSource: "oembed",
  };
}

async function extractYoutubeData(input: unknown): Promise<YoutubeMetadata> {
  const url = validatePlatformUrl(input, "youtube");
  if (!url || !ytdl.validateURL(url)) {
    throw new Error("URL YouTube tidak valid atau host tidak didukung.");
  }

  try {
    return await extractWithYtdl(url);
  } catch (primaryError) {
    console.warn("ytdl-core metadata extraction failed; trying YouTube oEmbed:", primaryError);
    return extractWithOembed(url);
  }
}

async function handleRequest(input: unknown) {
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
    return NextResponse.json(
      { success: false, error: "Metadata YouTube tidak dapat diambil. Video mungkin privat, dibatasi usia, tidak tersedia, atau akses server sedang dibatasi YouTube." },
      { status: 502 },
    );
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

  return handleRequest(input);
}

export async function GET(request: Request) {
  const input = new URL(request.url).searchParams.get("url");
  return handleRequest(input);
}
