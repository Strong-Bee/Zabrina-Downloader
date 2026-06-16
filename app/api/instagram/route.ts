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

    // Simulasi response untuk Instagram
    const mockData = {
      title: 'Instagram Post',
      thumbnail: 'https://picsum.photos/600/600',
      duration: '0:30',
      likes: 25000,
      comments: 1200,
      type: 'video',
      author: {
        username: 'username_instagram',
        fullName: 'User Instagram',
        avatar: 'https://picsum.photos/40',
      },
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
    console.error('Instagram API Error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}