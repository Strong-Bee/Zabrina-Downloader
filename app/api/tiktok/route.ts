import { NextRequest, NextResponse } from 'next/server';
import { createRequire } from 'module';

// Trik bypass Turbopack: Memuat library menggunakan createRequire Node.js
const require = createRequire(import.meta.url);
const { tiktokdl } = require('@mrnima/tiktok-downloader');

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL tidak ditemukan' },
        { status: 400 }
      );
    }

    // Mengambil data menggunakan library @mrnima/tiktok-downloader
    const result = await tiktokdl(url);

    // Validasi jika library gagal mengambil data
    if (!result || !result.status || !result.result) {
      return NextResponse.json(
        { error: 'Gagal mengambil data video. Pastikan URL TikTok valid dan publik.' },
        { status: 400 }
      );
    }

    const tiktokData = result.result;

    // Memetakan (mapping) hasil dari library ke format yang dibutuhkan frontend kamu
    const formattedData = {
      title: tiktokData.title || 'Video TikTok',
      description: tiktokData.title || 'Video dari TikTok',
      thumbnail: tiktokData.cover || 'https://picsum.photos/400/600',
      duration: tiktokData.duration || 0,
      views: tiktokData.play_count || 0,
      likes: tiktokData.digg_count || 0,
      comments: tiktokData.comment_count || 0,
      author: {
        username: tiktokData.author?.unique_id || 'username_tiktok',
        nickname: tiktokData.author?.nickname || 'User TikTok',
        avatar: tiktokData.author?.avatar || 'https://picsum.photos/40',
      },
      downloadLinks: {
        videoNoWatermark: tiktokData.nowm || '#', // Video tanpa watermark
        video: tiktokData.wm || '#',             // Video dengan watermark
        audio: tiktokData.music || '#',          // Audio MP3
      },
    };

    return NextResponse.json({
      success: true,
      data: formattedData,
    });

  } catch (error: any) {
    console.error('TikTok Library Error:', error);
    return NextResponse.json(
      { error: error.message || 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}