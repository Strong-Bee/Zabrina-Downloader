import { NextResponse } from "next/server";
import { validatePlatformUrl } from "@/lib/platform-url";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type YoutubeOEmbed = {
  title?: string;
  author_name?: string;
  thumbnail_url?: string;
};

class HttpError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}

const INVALID_URL_MESSAGE = "URL YouTube tidak valid atau host tidak didukung.";

function getYoutubeVideoId(input: string): string | null {
  try {
    const url = new URL(input);
    const host = url.hostname.toLowerCase();
    let id: string | null = null;

    if (host === "youtu.be" || host === "www.youtu.be") {
      id = url.pathname.split("/").filter(Boolean)[0] ?? null;
    } else if (host === "youtube.com" || host.endsWith(".youtube.com")) {
      if (url.pathname === "/watch") {
        id = url.searchParams.get("v");
      } else if (/^\/(embed|shorts|live|v)\//.test(url.pathname)) {
        id = url.pathname.split("/").filter(Boolean)[1] ?? null;
      }
    }

    return id && /^[\w-]{11}$/.test(id) ? id : null;
  } catch {
    return null;
  }
}

async function extractYoutubeData(url: string) {
  const videoId = getYoutubeVideoId(url);
  if (!videoId) throw new HttpError("ID video YouTube tidak dapat dibaca.", 400);

  // oEmbed publik dipakai untuk metadata (menghindari alur ytdl-core yang bisa gagal HTTP 410).
  const endpoint = new URL("https://www.youtube.com/oembed");
  endpoint.searchParams.set("url", `https://www.youtube.com/watch?v=${videoId}`);
  endpoint.searchParams.set("format", "json");

  let response: Response;
  try {
    response = await fetch(endpoint, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(10_000),
      cache: "no-store",
    });
  } catch (error) {
    if (error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError")) {
      throw new HttpError("Permintaan ke YouTube melebihi batas waktu.", 504);
    }
    throw new HttpError("Gagal menghubungi YouTube.", 502);
  }

  if (!response.ok) {
    if (response.status === 404 || response.status === 401) {
      throw new HttpError(
        "Video tidak tersedia untuk metadata publik (mungkin privat, dihapus, atau dibatasi).",
        404,
      );
    }
    if (response.status === 403) {
      throw new HttpError("Pemilik video tidak mengizinkan metadata/embed publik.", 403);
    }
    throw new HttpError(`YouTube oEmbed merespons HTTP ${response.status}.`, 502);
  }

  let metadata: YoutubeOEmbed;
  try {
    metadata = (await response.json()) as YoutubeOEmbed;
  } catch {
    throw new HttpError("Respons YouTube bukan JSON yang valid.", 502);
  }

  if (!metadata.title) {
    throw new HttpError("YouTube tidak mengembalikan metadata video.", 502);
  }

  return {
    title: metadata.title,
    thumbnail: metadata.thumbnail_url || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    duration: null,
    views: null,
    likes: null,
    channelName: metadata.author_name || "Unknown Channel",
    description: "",
    downloadLinks: { hd: null, sd: null, audio: null },
    metadataSource: "YouTube oEmbed",
  };
}

async function handleMetadata(input: unknown) {
  // Validasi sekali saja di sini.
  const url = validatePlatformUrl(input, "youtube");
  if (!url) {
    return NextResponse.json({ success: false, error: INVALID_URL_MESSAGE }, { status: 400 });
  }

  try {
    const data = await extractYoutubeData(url);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("YouTube metadata error:", error);
    if (error instanceof HttpError) {
      return NextResponse.json({ success: false, error: error.message }, { status: error.status });
    }
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan saat mengambil metadata." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Body request harus berupa JSON yang valid." },
      { status: 400 },
    );
  }

  const input =
    body && typeof body === "object" && "url" in body ? (body as { url?: unknown }).url : null;

  return handleMetadata(input);
}

export async function GET(request: Request) {
  const input = new URL(request.url).searchParams.get("url");
  return handleMetadata(input);
}
