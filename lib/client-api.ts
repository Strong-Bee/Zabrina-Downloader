export type ApiResponse<T = Record<string, unknown>> = {
  success?: boolean;
  error?: string;
  data?: T;
  downloadUrl?: string;
  code?: string;
};

export async function readApiResponse<T = Record<string, unknown>>(
  response: Response,
): Promise<ApiResponse<T>> {
  const raw = await response.text();
  try {
    return JSON.parse(raw) as ApiResponse<T>;
  } catch {
    const isHtml =
      response.headers.get("content-type")?.includes("text/html") ||
      raw.trimStart().startsWith("<");
    throw new Error(
      isHtml
        ? `Server mengembalikan halaman HTML (HTTP ${response.status}), bukan JSON. Periksa deployment atau endpoint API.`
        : `Respons API tidak valid (HTTP ${response.status}). Silakan coba lagi.`,
    );
  }
}
