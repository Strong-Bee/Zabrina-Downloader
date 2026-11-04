import { NextResponse } from "next/server";
import { readPlatformUrl } from "@/lib/platform-url";

export const runtime = "nodejs";

type TikTokOEmbed = {
  title?: string;
  author_name?: string;
  author_url?: string;
  thumbnail_url?: string;
};

export async function POST(request: Request) {
  const input = await readPlatformUrl(request, "tiktok");
  if ("error" in input) {
    return NextResponse.json(
      { success: false, error: input.error },
      { status: 400 },
    );
  }

  try {
    const endpoint = new URL("https://www.tiktok.com/oembed");
    endpoint.searchParams.set("url", input.url);

    const response = await fetch(endpoint, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(12_000),
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error:
            response.status === 404
              ? "Video TikTok tidak ditemukan atau tidak dapat diakses secara publik."
              : "TikTok tidak dapat menyediakan metadata untuk URL ini saat ini.",
        },
        { status: response.status === 404 ? 404 : 502 },
      );
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return NextResponse.json(
        { success: false, error: "TikTok mengembalikan respons yang tidak valid." },
        { status: 502 },
      );
    }

    const metadata = (await response.json()) as TikTokOEmbed;
    if (!metadata.title && !metadata.thumbnail_url && !metadata.author_name) {
      return NextResponse.json(
        { success: false, error: "Metadata video TikTok tidak tersedia." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        title: metadata.title || "Video TikTok",
        description: metadata.title || "Video dari TikTok",
        thumbnail: metadata.thumbnail_url || "",
        author: {
          username: "",
          nickname: metadata.author_name || "TikTok user",
          avatar: "",
        },
        duration: null,
        views: null,
        likes: null,
        comments: null,
        downloadLinks: {
          videoNoWatermark: null,
          video: null,
          audio: null,
        },
      },
      capabilities: {
        metadata: "available",
        mediaDownload: "unavailable",
      },
    });
  } catch (error) {
    console.error("TikTok oEmbed error:", error);
    const isTimeout =
      error instanceof Error &&
      (error.name === "TimeoutError" || error.name === "AbortError");
    return NextResponse.json(
      {
        success: false,
        error: isTimeout
          ? "Permintaan ke TikTok timeout. Silakan coba lagi."
          : "Gagal mengambil metadata TikTok. Pastikan video bersifat publik.",
      },
      { status: 502 },
    );
  }
}
