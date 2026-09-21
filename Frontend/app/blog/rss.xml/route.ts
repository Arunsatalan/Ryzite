import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function GET() {
  try {
    const res = await fetch(`${API_URL}/api/blog/rss.xml`, { cache: 'no-store' });
    if (!res.ok) {
      return new NextResponse('Error fetching RSS feed', { status: 500 });
    }
    const xml = await res.text();
    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'text/xml'
      }
    });
  } catch (err) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
