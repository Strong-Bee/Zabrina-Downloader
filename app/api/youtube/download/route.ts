import { NextResponse } from "next/server";
import ytdl from "@distube/ytdl-core";
import { validatePlatformUrl } from "@/lib/platform-url";

export const runtime = "nodejs";
export const maxDuration = 30;

type Quality = "hd" | "sd" | "low" | "audio";

const QUALITIES: readonly Quality[] = ["hd", "sd", "low", "audio"];
const TARGET_HEIGHT = { hd: 720, sd: 480, low: 360 } as const;
const INFO_TIMEOUT_MS = 15_000;

function isQuality(value: unknown): value is Quality {
  return typeof value === "string" && (QUALITIES as readonly string[]).includes(value);
}

function json(error: string, status: number) {
  return NextResponse.json({ success: false, error }, { status });
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error("TIMEOUT")), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

// Pilih format dengan tinggi tertinggi yang tidak melebihi target.
// Jika tidak ada, ambil yang paling mendekati (terendah di atas target).
function pickVideoFormat(formats: ytdl.videoFormat[], targetHeight: number) {
  const withHeight = formats.filter((f) => f.url && typeof f.height === "number");
  if (withHeight.length === 0) return formats.find((f) => f.url);

  const atOrBelow = withHeight
    .filter((f) => (f.height as number) <= targetHeight)
    .sort((a, b) => (b.height as number) - (a.height as number));
  if (atOrBelow.length > 0) return atOrBelow[0];

  return withHeight.sort((a, b) => (a.height as number) - (b.height as number))[0];
}

// Pilih audio dengan bitrate tertinggi.
function pickAudioFormat(formats: ytdl.videoFormat[]) {
  return formats
    .filter((f) => f.url)
    .sort((a, b) => (b.audioBitrate ?? 0) - (a.audioBitrate ?? 0))[0];
}

function mapYtdlError(error: unknown): { message: string; status: number } {
  const text = error instanceof Error ? error.message : "";

  if (text === "TIMEOUT") {
    return { message: "Permintaan ke YouTube melebihi batas waktu. Coba lagi.", status: 504 };
  }
  if (/private|unavailable|not available|removed|deleted/i.test(text)) {
    return { message: "Video tidak tersedia (privat, dihapus, atau dibatasi).", status: 404 };
  }
  if (/age|sign in|confirm your age|login/i.test(text)) {
    return { message: "Video dibatasi (usia/login) dan tidak dapat diproses.", status: 403 };
  }
  if (/429|too many requests/i.test(text)) {
    return { message: "Terlalu banyak permintaan ke YouTube. Coba beberapa saat lagi.", status: 429 };
  }
  return { message: "Gagal menyiapkan unduhan YouTube. Coba lagi.", status: 502 };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json("Body request harus berupa JSON yang valid.", 400);
  }

  if (!body || typeof body !== "object") {
    return json("Body request harus berupa objek JSON.", 400);
  }

  const { url: rawUrl, quality } = body as { url?: unknown; quality?: unknown };

  const url = validatePlatformUrl(rawUrl, "youtube");
  if (!url || !ytdl.validateURL(url)) {
    return json("URL YouTube tidak valid atau host tidak didukung.", 400);
  }

  if (!isQuality(quality)) {
    return json("Pilihan kualitas tidak valid.", 400);
  }

  try {
    const info = await withTimeout(ytdl.getInfo(url), INFO_TIMEOUT_MS);

    const preferred =
      quality === "audio"
        ? pickAudioFormat(ytdl.filterFormats(info.formats, "audioonly"))
        : pickVideoFormat(ytdl.filterFormats(info.formats, "videoandaudio"), TARGET_HEIGHT[quality]);

    if (!preferred?.url) {
      return json("Format unduhan yang diminta tidak tersedia.", 404);
    }

    const label =
      quality === "audio"
        ? preferred.audioBitrate
          ? `Audio ${preferred.audioBitrate}kbps`
          : "Audio"
        : preferred.qualityLabel || (preferred.height ? `${preferred.height}p` : "Video");

    return NextResponse.json({
      success: true,
      downloadUrl: preferred.url,
      title: info.videoDetails.title || "Video YouTube",
      quality: label,
    });
  } catch (error) {
    console.error("YouTube download error:", error);
    const { message, status } = mapYtdlError(error);
    return json(message, status);
  }
}
