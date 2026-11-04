import { NextResponse } from "next/server";
import { createRequire } from "node:module";
import { readPlatformUrl } from "@/lib/platform-url";

export const runtime = "nodejs";

const require = createRequire(import.meta.url);
const { tiktokdl } = require("@mrnima/tiktok-downloader") as {
  tiktokdl: (url: string) => Promise<any>;
};

export async function POST(request: Request) {
  let body: { url?: unknown; type?: unknown };
  try {
    body = await request.json() as { url?: unknown; type?: unknown };
  } catch {
    return NextResponse.json({ success: false, error: "Body request harus berupa JSON yang valid." }, { status: 400 });
  }

  const url = (await import("@/lib/platform-url")).validatePlatformUrl(body.url, "tiktok");
  if (!url) {
    return NextResponse.json({ success: false, error: "URL TikTok tidak valid atau host tidak didukung." }, { status: 400 });
  }

  if (!["videoNoWatermark", "video", "audio"].includes(String(body.type))) {
    return NextResponse.json({ success: false, error: "Jenis unduhan tidak valid." }, { status: 400 });
  }

  try {
    const response = await tiktokdl(url);
    if (!response?.status || !response?.result) {
      return NextResponse.json({ success: false, error: "Video TikTok tidak ditemukan atau tidak dapat diakses." }, { status: 404 });
    }

    const data = response.result;
    const downloadUrl = body.type === "videoNoWatermark"
      ? data.nowm
      : body.type === "video"
        ? data.wm
        : data.music;

    if (typeof downloadUrl !== "string" || !downloadUrl.startsWith("https://")) {
      return NextResponse.json({ success: false, error: "Link unduhan tidak tersedia." }, { status: 404 });
    }

    return NextResponse.json({ success: true, downloadUrl, title: data.title || "TikTok Video" });
  } catch (error) {
    console.error("TikTok download error:", error);
    return NextResponse.json({ success: false, error: "Gagal menyiapkan unduhan TikTok. Coba lagi." }, { status: 502 });
  }
}
