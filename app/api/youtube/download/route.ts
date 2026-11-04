import { NextResponse } from "next/server";
import { validatePlatformUrl } from "@/lib/platform-url";

export const runtime = "nodejs";

/**
 * Direct media extraction is intentionally unavailable. The public oEmbed
 * endpoint provides metadata only; it does not provide downloadable media.
 * Keep this endpoint explicit so clients never mistake metadata for a file.
 */
export async function POST(request: Request) {
  let body: { url?: unknown };
  try {
    body = await request.json() as { url?: unknown };
  } catch {
    return NextResponse.json(
      { success: false, error: "Body request harus berupa JSON yang valid." },
      { status: 400 },
    );
  }

  if (!validatePlatformUrl(body.url, "youtube")) {
    return NextResponse.json(
      { success: false, error: "URL YouTube tidak valid atau host tidak didukung." },
      { status: 400 },
    );
  }

  return NextResponse.json(
    {
      success: false,
      code: "YOUTUBE_DOWNLOAD_UNAVAILABLE",
      error: "Metadata video tersedia, tetapi sumber metadata tidak menyediakan tautan media. Untuk video milik Anda, gunakan YouTube Studio atau Google Takeout.",
      officialExport: {
        youtubeStudio: "https://studio.youtube.com/",
        googleTakeout: "https://takeout.google.com/",
      },
    },
    { status: 501 },
  );
}
