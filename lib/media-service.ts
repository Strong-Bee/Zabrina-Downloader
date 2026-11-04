import "server-only";

type ServiceResult = {
  success?: boolean;
  data?: Record<string, unknown>;
  downloadUrl?: string;
  error?: string;
  code?: string;
  detail?: unknown;
};

type ServiceCall = {
  ok: boolean;
  status: number;
  body: ServiceResult;
};

export async function callMediaService(
  endpoint: "metadata" | "download",
  payload: Record<string, unknown>,
): Promise<ServiceCall> {
  const baseUrl = process.env.MEDIA_SERVICE_URL?.trim();
  const apiKey = process.env.MEDIA_SERVICE_API_KEY?.trim();

  if (!baseUrl || !apiKey) {
    return {
      ok: false,
      status: 503,
      body: {
        success: false,
        code: "MEDIA_SERVICE_NOT_CONFIGURED",
        error:
          "Layanan pemrosesan media belum dikonfigurasi. Admin perlu mengatur MEDIA_SERVICE_URL dan MEDIA_SERVICE_API_KEY di environment Vercel.",
      },
    };
  }

  let target: URL;
  try {
    target = new URL(baseUrl);
    if (
      target.protocol !== "https:" &&
      !(target.protocol === "http:" && ["localhost", "127.0.0.1"].includes(target.hostname))
    ) {
      throw new Error("MEDIA_SERVICE_URL must use HTTPS.");
    }
  } catch {
    return {
      ok: false,
      status: 503,
      body: {
        success: false,
        code: "MEDIA_SERVICE_URL_INVALID",
        error: "Konfigurasi alamat layanan media tidak valid.",
      },
    };
  }

  target.pathname = `${target.pathname.replace(/\/$/, "")}/v1/${endpoint}`;

  try {
    const response = await fetch(target, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-API-Key": apiKey,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
      signal: AbortSignal.timeout(25_000),
    });

    const raw = await response.text();
    let body: ServiceResult;
    try {
      body = JSON.parse(raw) as ServiceResult;
    } catch {
      console.error("Media service returned non-JSON response", {
        status: response.status,
        contentType: response.headers.get("content-type"),
      });
      return {
        ok: false,
        status: 502,
        body: {
          success: false,
          code: "MEDIA_SERVICE_INVALID_RESPONSE",
          error: "Layanan media mengembalikan respons yang tidak valid. Silakan coba lagi.",
        },
      };
    }

    if (!response.ok || body.success === false) {
      return {
        ok: false,
        status: response.status >= 400 && response.status <= 599 ? response.status : 502,
        body: {
          ...body,
          success: false,
          error:
            body.error ||
            (typeof body.detail === "string" ? body.detail : null) ||
            "Layanan media gagal memproses URL ini.",
        },
      };
    }

    if (endpoint === "download") {
      if (typeof body.downloadUrl !== "string") {
        return {
          ok: false,
          status: 502,
          body: {
            success: false,
            code: "MEDIA_URL_MISSING",
            error: "Sumber media tidak menyediakan tautan unduhan.",
          },
        };
      }
      try {
        if (new URL(body.downloadUrl).protocol !== "https:") throw new Error("Unsafe URL");
      } catch {
        return {
          ok: false,
          status: 502,
          body: {
            success: false,
            code: "MEDIA_URL_INVALID",
            error: "Layanan media mengembalikan tautan yang tidak aman.",
          },
        };
      }
    }

    return { ok: true, status: response.status, body };
  } catch (error) {
    const timedOut =
      error instanceof Error &&
      (error.name === "TimeoutError" || error.name === "AbortError");
    return {
      ok: false,
      status: timedOut ? 504 : 502,
      body: {
        success: false,
        code: timedOut ? "MEDIA_SERVICE_TIMEOUT" : "MEDIA_SERVICE_UNREACHABLE",
        error: timedOut
          ? "Layanan media melebihi batas waktu. Coba lagi."
          : "Tidak dapat menghubungi layanan media. Periksa koneksi server.",
      },
    };
  }
}
