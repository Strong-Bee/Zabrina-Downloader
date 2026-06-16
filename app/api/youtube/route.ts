import { NextRequest, NextResponse } from 'next/server';
import ytdl from 'ytdl-core';

// Helper function untuk menghindari duplikasi kode (DRY) dan mengekstrak link stream asli
async function extractYoutubeData(url: string) {
  if (!ytdl.validateURL(url)) {
    throw new Error('URL YouTube tidak valid. Pastikan URL benar.');
  }

  // Ambil informasi lengkap video beserta daftar formatnya
  const info = await ytdl.getInfo(url);
  const videoDetails = info.videoDetails;

  // Filter format video yang menyatu dengan audio (progressive streams, biasanya maks 720p)
  const progressiveFormats = ytdl.filterFormats(info.formats, 'videoandaudio');
  // Filter format audio saja (untuk MP3)
  const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');

  // Ambil URL stream langsung (Direct CDN Link) dari YouTube
  const hdUrl = progressiveFormats.find(f => f.qualityLabel === '720p' || f.qualityLabel === '1080p')?.url 
    || progressiveFormats[0]?.url 
    || videoDetails.video_url;

  const sdUrl = progressiveFormats.find(f => f.qualityLabel === '360p' || f.qualityLabel === '480p')?.url 
    || progressiveFormats[progressiveFormats.length - 1]?.url 
    || videoDetails.video_url;

  const audioUrl = audioFormats[0]?.url || videoDetails.video_url;

  // Format durasi (detik ke format MM:SS)
  const seconds = Number(videoDetails.lengthSeconds) || 0;
  const durationFormatted = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

  return {
    title: videoDetails.title || 'Video YouTube',
    thumbnail: videoDetails.thumbnails?.[videoDetails.thumbnails.length - 1]?.url || '',
    duration: durationFormatted,
    views: Number(videoDetails.viewCount) || 0,
    likes: Number(videoDetails.likes) || 0,
    channelName: videoDetails.author?.name || 'Unknown Channel',
    description: videoDetails.description || '',
    downloadLinks: {
      hd: hdUrl,      // Sekarang berisi link video HD langsung
      sd: sdUrl,      // Sekarang berisi link video SD langsung
      audio: audioUrl,  // Sekarang berisi link audio langsung
    },
  };
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL tidak ditemukan' }, { status: 400 });
    }

    const videoData = await extractYoutubeData(url);
    return NextResponse.json({ success: true, data: videoData });

  } catch (error: any) {
    console.error('YouTube API POST Error:', error);
    return NextResponse.json(
      { error: error.message || 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl.searchParams.get('url');

    if (!url) {
      return NextResponse.json({ error: 'Parameter URL diperlukan' }, { status: 400 });
    }

    const videoData = await extractYoutubeData(url);
    return NextResponse.json({ success: true, data: videoData });

  } catch (error: any) {
    console.error('YouTube API GET Error:', error);
    return NextResponse.json(
      { error: error.message || 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}