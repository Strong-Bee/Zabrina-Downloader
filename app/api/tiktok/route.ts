import { NextResponse } from "next/server";
import { readPlatformUrl } from "@/lib/platform-url";
import { callMediaService } from "@/lib/media-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const input = await readPlatformUrl(request, "tiktok");
  if ("error" in input) {
    return NextResponse.json(
      { success: false, error: input.error, code: "INVALID_URL" },
      { status: 400 },
    );
  }

  const result = await callMediaService("metadata", {
    platform: "tiktok",
    url: input.url,
  });
  return NextResponse.json(result.body, { status: result.status });
}
