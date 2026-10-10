import { NextResponse } from 'next/server';
import { db } from '@/db/index';
import { simulations } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    let result;
    if (userId) {
      result = await db
        .select()
        .from(simulations)
        .where(eq(simulations.userId, userId))
        .orderBy(desc(simulations.createdAt));
    } else {
      result = await db
        .select()
        .from(simulations)
        .orderBy(desc(simulations.createdAt))
        .limit(50);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching simulations:', error);
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userId = body.userId || body.patientId || null;
    const userName = body.userName || body.patientName || null;
    const phone = body.phone || null;
    const gender = body.gender || body.morphData?.gender || 'female';
    const bmi = String(body.bmi ?? body.morphData?.bmi ?? '25');
    const weight = String(body.weight ?? body.morphData?.weight ?? '70');
    const height = String(body.height ?? body.morphData?.height ?? '165');
    const avatarProps = body.avatarProps || body.morphData || {};
    const summary = body.summary || body.notes || null;

    const [created] = await db
      .insert(simulations)
      .values({
        id: body.id || `sim_${Date.now()}`,
        userId,
        userName,
        phone,
        gender,
        bmi,
        weight,
        height,
        avatarProps,
        summary,
      })
      .returning();

    return NextResponse.json(created);
  } catch (error) {
    console.error('Error saving simulation:', error);
    return NextResponse.json({ error: 'Failed to save simulation' }, { status: 500 });
  }
}
