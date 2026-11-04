import { NextResponse } from "next/server";
import { validatePlatformUrl } from "@/lib/platform-url";
import { callMediaService } from "@/lib/media-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function handleMetadata(rawUrl: unknown) {
  const url = validatePlatformUrl(rawUrl, "youtube");
  if (!url) {
    return NextResponse.json(
      { success: false, code: "INVALID_URL", error: "URL YouTube tidak valid atau host tidak didukung." },
      { status: 400 },
    );
  }
  const result = await callMediaService("metadata", { platform: "youtube", url });
  return NextResponse.json(result.body, { status: result.status });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, code: "INVALID_JSON", error: "Body request harus berupa JSON yang valid." },
      { status: 400 },
    );
  }
  const url = body && typeof body === "object" && "url" in body
    ? (body as { url?: unknown }).url
    : null;
  return handleMetadata(url);
}

export async function GET(request: Request) {
  return handleMetadata(new URL(request.url).searchParams.get("url"));
}
