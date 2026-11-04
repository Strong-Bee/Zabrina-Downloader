import { NextResponse } from "next/server";
import { createRequire } from "node:module";
import { readPlatformUrl } from "@/lib/platform-url";

export const runtime = "nodejs";

const require = createRequire(import.meta.url);
const { tiktokdl } = require("@mrnima/tiktok-downloader") as {
  tiktokdl: (url: string) => Promise<any>;
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
    return NextResponse.json({
      success: true,
      data: {
        title: data.title || "Video TikTok",
        description: data.title || "Video dari TikTok",
        thumbnail: data.cover || "",
        duration: Number(data.duration) || 0,
        views: Number(data.play_count) || 0,
        likes: Number(data.digg_count) || 0,
        comments: Number(data.comment_count) || 0,
        author: {
          username: data.author?.unique_id || "",
          nickname: data.author?.nickname || "TikTok user",
          avatar: data.author?.avatar || "",
        },
        downloadLinks: {
          videoNoWatermark: data.nowm || null,
          video: data.wm || null,
          audio: data.music || null,
        },
      },
    });
  } catch (error) {
    console.error("TikTok metadata error:", error);
    return NextResponse.json({ success: false, error: "Gagal mengambil metadata TikTok. Coba lagi." }, { status: 502 });
  }
}
