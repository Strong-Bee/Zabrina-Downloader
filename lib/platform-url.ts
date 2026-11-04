const PLATFORM_HOSTS = {
  youtube: new Set(["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be", "www.youtu.be"]),
  tiktok: new Set(["tiktok.com", "www.tiktok.com", "m.tiktok.com", "vm.tiktok.com", "vt.tiktok.com"]),
  instagram: new Set(["instagram.com", "www.instagram.com", "instagr.am", "www.instagr.am"]),
  facebook: new Set(["facebook.com", "www.facebook.com", "m.facebook.com", "fb.watch", "www.fb.watch"]),
} as const;

export type SupportedPlatform = keyof typeof PLATFORM_HOSTS;

/**
 * Accept only public HTTP(S) URLs belonging to the selected platform.
 * This prevents arbitrary URL fetching and common SSRF payloads from reaching
 * third-party downloader libraries.
 */
export function validatePlatformUrl(
  value: unknown,
  platform: SupportedPlatform,
): string | null {
  if (typeof value !== "string" || value.length === 0 || value.length > 2048) {
    return null;
  }

  try {
    const parsed = new URL(value.trim());
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return null;
    if (parsed.username || parsed.password || parsed.port) return null;
    if (!PLATFORM_HOSTS[platform].has(parsed.hostname.toLowerCase())) return null;
    if (!parsed.pathname || parsed.pathname === "/") return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

export async function readPlatformUrl(
  request: Request,
  platform: SupportedPlatform,
): Promise<{ url: string } | { error: string }> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return { error: "Body request harus berupa JSON yang valid." };
  }

  if (!body || typeof body !== "object" || !("url" in body)) {
    return { error: "URL wajib diisi." };
  }

  const url = validatePlatformUrl((body as { url?: unknown }).url, platform);
  if (!url) {
    return { error: `URL ${platform} tidak valid atau host tidak didukung.` };
  }

  return { url };
}
