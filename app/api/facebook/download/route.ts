import { NextResponse } from "next/server";
import { validatePlatformUrl } from "@/lib/platform-url";
import { callMediaService } from "@/lib/media-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST(request: Request) {
  let body: { url?: unknown; quality?: unknown };
  try {
    body = (await request.json()) as { url?: unknown; quality?: unknown };
  } catch {
    return NextResponse.json(
      { success: false, code: "INVALID_JSON", error: "Body request harus berupa JSON yang valid." },
      { status: 400 },
    );
  }

  const url = validatePlatformUrl(body.url, "facebook");
  if (!url) {
    return NextResponse.json(
      { success: false, code: "INVALID_URL", error: "URL facebook tidak valid atau host tidak didukung." },
      { status: 400 },
    );
  }

  const requested = typeof body.quality === "string" ? body.quality : "";
  const quality = ["hd", "sd", "low", "audio"].includes(requested) ? requested : null;
  if (!quality) {
    return NextResponse.json(
      { success: false, code: "INVALID_QUALITY", error: "Pilihan kualitas unduhan tidak valid." },
      { status: 400 },
    );
  }

  const result = await callMediaService("download", {
    platform: "facebook",
    url,
    quality,
  });
  return NextResponse.json(result.body, { status: result.status });
}
