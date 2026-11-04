import { NextResponse } from "next/server";
import { createRequire } from "node:module";
import { readPlatformUrl } from "@/lib/platform-url";

export const runtime = "nodejs";

const require = createRequire(import.meta.url);
type TikTokResult = { status?: boolean; result?: Record<string, unknown> };
const { tiktokdl } = require("@mrnima/tiktok-downloader") as {
  tiktokdl: (url: string) => Promise<TikTokResult>;
};

export async function POST(request: Request) {
  const input = await readPlatformUrl(request, "tiktok");
  if ("error" in input) {
    return NextResponse.json({ success: false, error: input.error }, { status: 400 });
  }

  try {
    const response = await tiktokdl(input.url);
    if (!response?.status || !response?.result) {
      return NextResponse.json({ success: false, error: "Video TikTok tidak ditemukan atau tidak dapat diakses secara publik." }, { status: 404 });
    }

    const data = response.result;
    const author = data.author && typeof data.author === "object"
      ? data.author as Record<string, unknown>
      : {};
    const asText = (value: unknown, fallback = "") => typeof value === "string" ? value : fallback;
    const asNumber = (value: unknown) => typeof value === "number" ? value : 0;
    return NextResponse.json({
      success: true,
      data: {
        title: asText(data.title, "Video TikTok"),
        description: asText(data.title, "Video dari TikTok"),
        thumbnail: asText(data.cover),
        duration: asNumber(data.duration),
        views: asNumber(data.play_count),
        likes: asNumber(data.digg_count),
        comments: asNumber(data.comment_count),
        author: {
          username: asText(author.unique_id),
          nickname: asText(author.nickname, "TikTok user"),
          avatar: asText(author.avatar),
        },
        downloadLinks: {
          videoNoWatermark: asText(data.nowm) || null,
          video: asText(data.wm) || null,
          audio: asText(data.music) || null,
        },
      },
    });
  } catch (error) {
    console.error("TikTok metadata error:", error);
    return NextResponse.json({ success: false, error: "Gagal mengambil metadata TikTok. Coba lagi." }, { status: 502 });
  }
}
