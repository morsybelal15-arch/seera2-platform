import { NextResponse } from 'next/server';
import { db } from '@/db/index';
import { dietTemplates } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;
    await db.delete(dietTemplates).where(eq(dietTemplates.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting diet template:', error);
    return NextResponse.json({ error: 'Failed to delete diet template' }, { status: 500 });
  }
}
