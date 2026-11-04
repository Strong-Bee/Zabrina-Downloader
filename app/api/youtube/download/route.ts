import { NextResponse } from "next/server";
import ytdl from "ytdl-core";
import { validatePlatformUrl } from "@/lib/platform-url";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: { url?: unknown; quality?: unknown };
  try {
    body = await request.json() as { url?: unknown; quality?: unknown };
  } catch {
    return NextResponse.json({ success: false, error: "Body request harus berupa JSON yang valid." }, { status: 400 });
  }

  const url = validatePlatformUrl(body.url, "youtube");
  if (!url || !ytdl.validateURL(url)) {
    return NextResponse.json({ success: false, error: "URL YouTube tidak valid atau host tidak didukung." }, { status: 400 });
  }

  const quality = body.quality;
  if (!["hd", "sd", "low", "audio"].includes(String(quality))) {
    return NextResponse.json({ success: false, error: "Pilihan kualitas tidak valid." }, { status: 400 });
  }

  try {
    const info = await ytdl.getInfo(url);
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
