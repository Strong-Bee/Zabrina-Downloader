import { NextResponse } from "next/server";
import { validatePlatformUrl } from "@/lib/platform-url";

export const runtime = "nodejs";
export const maxDuration = 30;

type DownloadRequest = {
  url?: unknown;
  quality?: unknown;
};

const ALLOWED_QUALITIES = ["hd", "sd", "low", "audio"] as const;

function json(error: string, status: number, code?: string) {
  return NextResponse.json(
    { success: false, ...(code ? { code } : {}), error },
    { status },
  );
}

/**
 * YouTube oEmbed provides metadata only, not downloadable media URLs.
 * Direct extraction is intentionally disabled until a supported, authorized
 * media source is available. Never return a fabricated download URL.
 */
export async function POST(request: Request) {
  let body: DownloadRequest;
  try {
    body = (await request.json()) as DownloadRequest;
  } catch {
    return json("Body request harus berupa JSON yang valid.", 400);
  }

  if (!body || typeof body !== "object") {
    return json("Body request harus berupa objek JSON.", 400);
  }

  const url = validatePlatformUrl(body.url, "youtube");
  if (!url) {
    return json("URL YouTube tidak valid atau host tidak didukung.", 400);
  }

  if (
    typeof body.quality !== "string" ||
    !(ALLOWED_QUALITIES as readonly string[]).includes(body.quality)
  ) {
    return json("Pilihan kualitas tidak valid.", 400);
  }

  return NextResponse.json(
    {
      success: false,
      code: "YOUTUBE_DOWNLOAD_UNAVAILABLE",
      error:
        "Metadata video tersedia, tetapi sumber metadata tidak menyediakan tautan media. Untuk video milik Anda, gunakan YouTube Studio atau Google Takeout.",
      officialExport: {
        youtubeStudio: "https://studio.youtube.com/",
        googleTakeout: "https://takeout.google.com/",
      },
    },
    { status: 501 },
  );
}
