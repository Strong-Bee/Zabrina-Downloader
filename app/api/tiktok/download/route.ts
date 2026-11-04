import { NextResponse } from "next/server";
import { validatePlatformUrl } from "@/lib/platform-url";
import { callMediaService } from "@/lib/media-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST(request: Request) {
  let body: { url?: unknown; type?: unknown };
  try {
    body = (await request.json()) as { url?: unknown; type?: unknown };
  } catch {
    return NextResponse.json(
      { success: false, code: "INVALID_JSON", error: "Body request harus berupa JSON yang valid." },
      { status: 400 },
    );
  }

  const url = validatePlatformUrl(body.url, "tiktok");
  if (!url) {
    return NextResponse.json(
      { success: false, code: "INVALID_URL", error: "URL tiktok tidak valid atau host tidak didukung." },
      { status: 400 },
    );
  }

  const requested = typeof body.type === "string" ? body.type : "";
  const quality = requested === "audio" ? "audio" : ["videoNoWatermark", "video"].includes(requested) ? "hd" : null;
  if (!quality) {
    return NextResponse.json(
      { success: false, code: "INVALID_QUALITY", error: "Pilihan kualitas unduhan tidak valid." },
      { status: 400 },
    );
  }

  const result = await callMediaService("download", {
    platform: "tiktok",
    url,
    quality,
  });
  return NextResponse.json(result.body, { status: result.status });
}
