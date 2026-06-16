import { NextRequest, NextResponse } from 'next/server';
import { createRequire } from 'module';

// Trik bypass Turbopack: Memuat library menggunakan createRequire Node.js
const require = createRequire(import.meta.url);
const { tiktokdl } = require('@mrnima/tiktok-downloader');

export async function POST(request: NextRequest) {
  try {
    const { url, type } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL tidak ditemukan' },
        { status: 400 }
      );
    }

    // Panggil ulang library untuk mengambil direct link CDN terbaru
    const result = await tiktokdl(url);

    if (!result || !result.status || !result.result) {
      return NextResponse.json(
        { error: 'Gagal memproses unduhan video.' },
        { status: 400 }
      );
    }

    const tiktokData = result.result;
    let downloadUrl = '#';

    // Memilah link unduhan berdasarkan tipe yang diklik user di frontend
    if (type === 'videoNoWatermark') {
      downloadUrl = tiktokData.nowm; // Link video tanpa watermark
    } else if (type === 'video') {
      downloadUrl = tiktokData.wm;   // Link video dengan watermark
    } else if (type === 'audio') {
      downloadUrl = tiktokData.music; // Link audio MP3
    }

    return NextResponse.json({
      success: true,
      downloadUrl: downloadUrl,
      title: tiktokData.title || 'TikTok Video',
    });

  } catch (error: any) {
    console.error('TikTok Download Library Error:', error);
    return NextResponse.json(
      { error: error.message || 'Terjadi kesalahan saat download' },
      { status: 500 }
    );
  }
}