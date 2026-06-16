import { NextRequest, NextResponse } from 'next/server';
import ytdl from 'ytdl-core';

export async function POST(request: NextRequest) {
  try {
    const { url, quality } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL tidak ditemukan' },
        { status: 400 }
      );
    }

    if (!ytdl.validateURL(url)) {
      return NextResponse.json(
        { error: 'URL YouTube tidak valid' },
        { status: 400 }
      );
    }

    const info = await ytdl.getInfo(url);
    let format = null;

    if (quality === 'audio') {
      // PERBAIKAN: Ubah ke 'highestaudio' agar kualitas MP3 tidak cempreng/buruk
      format = ytdl.chooseFormat(info.formats, { 
        quality: 'highestaudio',
        filter: 'audioonly' 
      });
    } else {
      // Ambil semua format yang memiliki video DAN audio sekaligus (Progressive Stream)
      const progressiveFormats = ytdl.filterFormats(info.formats, 'videoandaudio');

      if (!progressiveFormats || progressiveFormats.length === 0) {
        return NextResponse.json(
          { error: 'Format video yang mendukung unduhan langsung tidak tersedia.' },
          { status: 404 }
        );
      }

      // Pemetaan kualitas yang realistis untuk progressive stream
      // Opsi 'hd' (1080p) otomatis dialihkan ke format progressive tertinggi yang tersedia (biasanya 720p)
      if (quality === 'hd') {
        format = progressiveFormats.find(f => f.qualityLabel === '720p') || progressiveFormats[0];
      } else if (quality === 'sd') {
        format = progressiveFormats.find(f => f.qualityLabel === '480p') || progressiveFormats[0];
      } else if (quality === 'low') {
        format = progressiveFormats.find(f => f.qualityLabel === '360p') || progressiveFormats[progressiveFormats.length - 1];
      } else {
        format = progressiveFormats[0]; // Default ke format pertama yang tersedia
      }
    }

    if (!format || !format.url) {
      return NextResponse.json(
        { error: 'Gagal menentukan format unduhan yang tepat' },
        { status: 404 }
      );
    }

    // Mengembalikan direct URL dari CDN YouTube yang siap didownload
    return NextResponse.json({
      success: true,
      downloadUrl: format.url,
      title: info.videoDetails.title || 'Video YouTube',
      quality: format.qualityLabel || 'Audio MP3',
    });

  } catch (error: any) {
    console.error('YouTube Download Error:', error);
    return NextResponse.json(
      { error: error.message || 'Terjadi kesalahan saat memproses download' },
      { status: 500 }
    );
  }
}