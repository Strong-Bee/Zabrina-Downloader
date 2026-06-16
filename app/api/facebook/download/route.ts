import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url, quality } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL tidak ditemukan' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      downloadUrl: '#',
      title: 'Facebook Video',
      quality: quality || 'hd',
    });

  } catch (error) {
    console.error('Facebook Download Error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat download' },
      { status: 500 }
    );
  }
}