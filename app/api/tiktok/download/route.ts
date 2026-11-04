import { NextResponse } from "next/server";
import { validatePlatformUrl } from "@/lib/platform-url";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: { url?: unknown; type?: unknown };
  try {
    body = (await request.json()) as { url?: unknown; type?: unknown };
  } catch {
    return NextResponse.json(
      { success: false, error: "Body request harus berupa JSON yang valid." },
      { status: 400 },
    );
  }

  const url = validatePlatformUrl(body.url, "tiktok");
  if (!url) {
    return NextResponse.json(
      { success: false, error: "URL TikTok tidak valid atau host tidak didukung." },
      { status: 400 },
    );
  }

  if (!["videoNoWatermark", "video", "audio"].includes(String(body.type))) {
    return NextResponse.json(
      { success: false, error: "Jenis unduhan tidak valid." },
      { status: 400 },
    );
  }

  return NextResponse.json(
    {
      success: false,
      code: "TIKTOK_DOWNLOAD_UNAVAILABLE",
      error:
        "Unduhan media TikTok belum tersedia. Metadata video dapat ditampilkan, tetapi server tidak akan membuat tautan unduhan palsu.",
    },
    { status: 501 },
  );
}
