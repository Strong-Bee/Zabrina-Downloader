import { NextResponse } from "next/server";
import ytdl from "ytdl-core";
import { validatePlatformUrl } from "@/lib/platform-url";

export const runtime = "nodejs";

async function extractYoutubeData(input: unknown) {
  const url = validatePlatformUrl(input, "youtube");
  if (!url || !ytdl.validateURL(url)) {
    throw new Error("URL YouTube tidak valid atau host tidak didukung.");
  }

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
  };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Body request harus berupa JSON yang valid." }, { status: 400 });
  }

  const input = body && typeof body === "object" && "url" in body
    ? (body as { url?: unknown }).url
    : null;

  if (!validatePlatformUrl(input, "youtube")) {
    return NextResponse.json({ success: false, error: "URL YouTube tidak valid atau host tidak didukung." }, { status: 400 });
  }

  try {
    return NextResponse.json({ success: true, data: await extractYoutubeData(input) });
  } catch (error) {
    console.error("YouTube metadata error:", error);
    return NextResponse.json({ success: false, error: "Gagal mengambil metadata YouTube. Coba lagi atau periksa URL video." }, { status: 502 });
  }
}

export async function GET(request: Request) {
  const input = new URL(request.url).searchParams.get("url");
  if (!validatePlatformUrl(input, "youtube")) {
    return NextResponse.json({ success: false, error: "Parameter URL YouTube tidak valid." }, { status: 400 });
  }

  try {
    return NextResponse.json({ success: true, data: await extractYoutubeData(input) });
  } catch (error) {
    console.error("YouTube metadata error:", error);
    return NextResponse.json({ success: false, error: "Gagal mengambil metadata YouTube. Coba lagi atau periksa URL video." }, { status: 502 });
  }
}
