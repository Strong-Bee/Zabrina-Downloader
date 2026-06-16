import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL tidak ditemukan' },
        { status: 400 }
      );
    }

    // Simulasi response untuk Facebook
    const mockData = {
      title: 'Facebook Video',
      description: 'Video dari Facebook',
      thumbnail: 'https://picsum.photos/640/360',
      duration: '2:15',
      views: 350000,
      likes: 12000,
      comments: 800,
      downloadLinks: {
        hd: '#',
        sd: '#',
      },
    };

    return NextResponse.json({
      success: true,
      data: mockData,
    });

  } catch (error) {
    console.error('Facebook API Error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}