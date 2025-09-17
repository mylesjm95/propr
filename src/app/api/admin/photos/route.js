import { NextResponse } from 'next/server';
import { uploadBuildingPhotos } from '@/lib/actions/adminActions';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const result = await uploadBuildingPhotos(formData);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error uploading photos:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
