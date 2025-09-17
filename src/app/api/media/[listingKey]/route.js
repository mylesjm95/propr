import { NextResponse } from 'next/server';

export async function GET(req) {
  const listingKey = req.nextUrl.pathname.split('/').pop();

  const filter = `ResourceRecordKey eq '${listingKey}' and ResourceName eq 'Property' and ImageSizeDescription eq 'Large' and Order eq 0`;
  const url = `https://query.ampre.ca/odata/Media?$filter=${encodeURIComponent(filter)}&$select=MediaURL&$top=1`;

  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${process.env.AMPRE_TOKEN}` },
    });
    if (!response.ok) throw new Error(`Media error: ${response.status}`);
    const data = await response.json();
    const media = data.value[0];
    return NextResponse.json({ imageUrl: media ? media.MediaURL : null });
  } catch (error) {
    return NextResponse.json({ imageUrl: null }, { status: 500 });
  }
}