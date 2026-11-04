import hmac
import os
from urllib.parse import urlparse

import yt_dlp
from fastapi import FastAPI, Header, HTTPException
from pydantic import BaseModel, Field

API_KEY = os.environ.get("MEDIA_SERVICE_API_KEY", "")
if len(API_KEY) < 32:
    raise RuntimeError("MEDIA_SERVICE_API_KEY must be at least 32 characters.")

PLATFORM_HOSTS = {
    "tiktok": {"tiktok.com", "www.tiktok.com", "m.tiktok.com", "vm.tiktok.com", "vt.tiktok.com"},
    "instagram": {"instagram.com", "www.instagram.com", "instagr.am", "www.instagr.am"},
    "facebook": {"facebook.com", "www.facebook.com", "m.facebook.com", "fb.watch", "www.fb.watch"},
    "youtube": {"youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be", "www.youtu.be"},
}

app = FastAPI(
    title="Zabrina Media Service",
    docs_url=None,
    redoc_url=None,
    openapi_url=None,
)


class MediaRequest(BaseModel):
    platform: str
    url: str = Field(min_length=8, max_length=2048)
    quality: str | None = None


def authenticate(api_key: str | None) -> None:
    if not api_key or not hmac.compare_digest(api_key, API_KEY):
        raise HTTPException(status_code=401, detail="Unauthorized")


def validate_media_url(platform: str, raw_url: str) -> str:
    if platform not in PLATFORM_HOSTS:
        raise HTTPException(status_code=400, detail="Platform tidak didukung.")

    parsed = urlparse(raw_url.strip())
    if parsed.scheme != "https" or parsed.username or parsed.password or parsed.port:
        raise HTTPException(status_code=400, detail="URL harus menggunakan HTTPS yang valid.")

    host = (parsed.hostname or "").lower()
    if host not in PLATFORM_HOSTS[platform] or not parsed.path or parsed.path == "/":
        raise HTTPException(status_code=400, detail=f"URL {platform} tidak valid.")

    return parsed.geturl()


def extract_info(url: str, quality: str | None = None) -> dict:
    formats = {
        "hd": "best[height<=1080]/best",
        "sd": "best[height<=720]/best",
        "low": "best[height<=480]/best",
        "audio": "bestaudio/best",
    }
    options = {
        "quiet": True,
        "no_warnings": True,
        "noplaylist": True,
        "skip_download": True,
        "socket_timeout": 18,
        "retries": 1,
        "extractor_retries": 1,
        "format": formats.get(quality or "", "best"),
    }
    try:
        with yt_dlp.YoutubeDL(options) as downloader:
            info = downloader.extract_info(url, download=False)
    except yt_dlp.utils.DownloadError as exc:
        message = str(exc).lower()
        if "private" in message or "login" in message or "sign in" in message:
            raise HTTPException(status_code=403, detail="Konten privat atau memerlukan login tidak didukung.")
        if "not available" in message or "unavailable" in message or "deleted" in message:
            raise HTTPException(status_code=404, detail="Konten tidak ditemukan atau tidak tersedia untuk publik.")
        if "429" in message or "too many requests" in message:
            raise HTTPException(status_code=429, detail="Platform membatasi permintaan. Coba lagi nanti.")
        raise HTTPException(status_code=502, detail="Platform gagal menyediakan data media untuk URL ini.")
    except Exception:
        raise HTTPException(status_code=502, detail="Gagal memproses URL media.")

    if not isinstance(info, dict) or info.get("_type") == "playlist":
        raise HTTPException(status_code=400, detail="Masukkan satu URL video atau posting, bukan playlist.")
    return info


def normalized_metadata(platform: str, info: dict) -> dict:
    uploader = info.get("uploader") or info.get("channel") or info.get("creator") or ""
    uploader_id = info.get("uploader_id") or info.get("channel_id") or ""
    thumbnail = info.get("thumbnail") or ""
    duration = info.get("duration")
    return {
        "title": info.get("title") or "Media publik",
        "description": info.get("description") or "",
        "thumbnail": thumbnail,
        "duration": duration,
        "views": info.get("view_count"),
        "likes": info.get("like_count"),
        "comments": info.get("comment_count"),
        "type": "video" if duration is not None else "media",
        "author": {
            "username": uploader_id,
            "nickname": uploader,
            "fullName": uploader,
            "avatar": info.get("channel_thumbnail") or "",
        },
        "channelName": uploader or "Tidak tersedia",
        "platform": platform,
        "webpageUrl": info.get("webpage_url") or "",
        "metadataSource": "yt-dlp",
    }


@app.get("/health")
def health():
    return {"success": True, "service": "zabrina-media-service"}


@app.post("/v1/metadata")
def metadata(payload: MediaRequest, x_api_key: str | None = Header(default=None)):
    authenticate(x_api_key)
    url = validate_media_url(payload.platform, payload.url)
    info = extract_info(url)
    return {"success": True, "data": normalized_metadata(payload.platform, info)}


@app.post("/v1/download")
def download(payload: MediaRequest, x_api_key: str | None = Header(default=None)):
    authenticate(x_api_key)
    if payload.quality not in {"hd", "sd", "low", "audio"}:
        raise HTTPException(status_code=400, detail="Pilihan kualitas tidak valid.")

    url = validate_media_url(payload.platform, payload.url)
    info = extract_info(url, payload.quality)
    media_url = info.get("url")

    if not isinstance(media_url, str) or not media_url.startswith("https://"):
        requested = info.get("requested_formats") or []
        media_url = next(
            (item.get("url") for item in requested if isinstance(item, dict)
             and isinstance(item.get("url"), str) and item["url"].startswith("https://")),
            None,
        )

    if not media_url:
        raise HTTPException(status_code=404, detail="Format media yang diminta tidak tersedia.")

    return {
        "success": True,
        "downloadUrl": media_url,
        "title": info.get("title") or "media",
        "extension": info.get("ext") or "mp4",
        "quality": payload.quality,
        "expiresQuickly": True,
    }
