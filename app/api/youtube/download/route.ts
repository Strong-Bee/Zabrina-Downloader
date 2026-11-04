import { NextResponse } from "next/server";
import ytdl from "ytdl-core";
import { validatePlatformUrl } from "@/lib/platform-url";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: { url?: unknown; quality?: unknown };
  try {
    body = await request.json() as { url?: unknown; quality?: unknown };
  } catch {
    return NextResponse.json({ success: false, code: "INVALID_JSON", error: "Body request harus berupa JSON yang valid." }, { status: 400 });
  }

  const url = validatePlatformUrl(body.url, "youtube");
  if (!url || !ytdl.validateURL(url)) {
    return NextResponse.json({ success: false, code: "INVALID_URL", error: "URL YouTube tidak valid atau host tidak didukung." }, { status: 400 });
  }

  const quality = body.quality;
  if (!["hd", "sd", "low", "audio"].includes(String(quality))) {
    return NextResponse.json({ success: false, code: "INVALID_QUALITY", error: "Pilihan kualitas tidak valid." }, { status: 400 });
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
      return NextResponse.json({ success: false, code: "FORMAT_UNAVAILABLE", error: "Format unduhan yang diminta tidak tersedia untuk video ini." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      downloadUrl: preferred.url,
      title: info.videoDetails.title || "Video YouTube",
      quality: preferred.qualityLabel || "Audio",
    });
  } catch (error) {
    const statusCode = typeof error === "object" && error !== null && "statusCode" in error
      ? Number((error as { statusCode?: unknown }).statusCode)
      : 0;

    console.error("YouTube download preparation failed:", {
      statusCode: Number.isFinite(statusCode) ? statusCode : 0,
      message: error instanceof Error ? error.message : "Unknown error",
    });

    if (statusCode === 410) {
      return NextResponse.json({
        success: false,
        code: "YOUTUBE_SOURCE_UNAVAILABLE",
        error: "YouTube menolak permintaan unduhan dari server (HTTP 410). Metadata video mungkin tetap tampil, tetapi tautan unduhan tidak tersedia. Untuk video milik Anda, gunakan file asli atau ekspor melalui YouTube Studio/Google Takeout.",
      }, { status: 503 });
    }

    return NextResponse.json({
      success: false,
      code: "DOWNLOAD_PREPARATION_FAILED",
      error: "Server tidak dapat menyiapkan tautan unduhan untuk video ini. Coba lagi nanti atau gunakan sumber file yang Anda miliki izin untuk unduh.",
    }, { status: 502 });
  }
}
