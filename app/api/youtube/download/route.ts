import { NextResponse } from "next/server";
import ytdl from "ytdl-core";
import { readPlatformUrl } from "@/lib/platform-url";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const input = await readPlatformUrl(request, "youtube");
  if ("error" in input) {
    return NextResponse.json({ success: false, error: input.error }, { status: 400 });
  }

  let quality: unknown;
  try {
    const body = await request.clone().json() as { quality?: unknown };
    quality = body.quality;
  } catch {
    return NextResponse.json({ success: false, error: "Body request harus berupa JSON yang valid." }, { status: 400 });
  }

  if (!["hd", "sd", "low", "audio"].includes(String(quality))) {
    return NextResponse.json({ success: false, error: "Pilihan kualitas tidak valid." }, { status: 400 });
  }

  try {
    const info = await ytdl.getInfo(input.url);
    const formats = quality === "audio"
      ? ytdl.filterFormats(info.formats, "audioonly")
      : ytdl.filterFormats(info.formats, "videoandaudio");

    const preferred = quality === "audio"
      ? formats[0]
      : quality === "hd"
        ? formats.find((format) => format.qualityLabel === "720p") || formats[0]
        : quality === "sd"
          ? formats.find((format) => format.qualityLabel === "480p") || formats[0]
          : formats.find((format) => format.qualityLabel === "360p") || formats.at(-1);

    if (!preferred?.url) {
      return NextResponse.json({ success: false, error: "Format unduhan yang diminta tidak tersedia." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      downloadUrl: preferred.url,
      title: info.videoDetails.title || "Video YouTube",
      quality: preferred.qualityLabel || "Audio",
    });
  } catch (error) {
    console.error("YouTube download error:", error);
    return NextResponse.json({ success: false, error: "Gagal menyiapkan unduhan YouTube. Coba lagi." }, { status: 502 });
  }
}
