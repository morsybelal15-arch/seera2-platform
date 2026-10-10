import { NextResponse } from 'next/server';
import { db } from '@/db/index';
import { dietTemplates } from '@/db/schema';
import { desc } from 'drizzle-orm';

const INITIAL_TEMPLATES = [
  {
    id: '1',
    name: 'دايت كيتو (مبتدئين)',
    description: 'نظام منخفض الكربوهيدرات وعالي الدهون للتحفيز السريع للحرق.',
    instructions: '- الإفطار: 3 بيضات مقلية بالزبدة\n- الغداء: شريحة لحم مع سلطة ورقيات\n- العشاء: تونة بزيت الزيتون',
    type: 'loss'
  },
  {
    id: '2',
    name: 'صيام متقطع (16/8)',
    description: 'نظام يعتمد على الصيام لمدة 16 ساعة وتناول الطعام في نافذة 8 ساعات.',
    instructions: '- وجبة 1 (12 ظهراً): بروتين خالي من الدهون مع خضار\n- وجبة 2 (8 مساءً): زبادي يوناني مع مكسرات',
    type: 'loss'
  }
];

export async function GET() {
  try {
    const list = await db.select().from(dietTemplates).orderBy(desc(dietTemplates.createdAt));
    if (list.length === 0) {
      for (const t of INITIAL_TEMPLATES) {
        await db.insert(dietTemplates).values(t).onConflictDoNothing();
      }
      const seeded = await db.select().from(dietTemplates).orderBy(desc(dietTemplates.createdAt));
      return NextResponse.json(seeded);
    }
    return NextResponse.json(list);
  } catch (error) {
    console.error('Error fetching diet templates from PostgreSQL:', error);
    return NextResponse.json(INITIAL_TEMPLATES);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, name, description, instructions, type } = body;

    const [saved] = await db
      .insert(dietTemplates)
      .values({
        id,
        name,
        description,
        instructions,
        type,
      })
      .onConflictDoUpdate({
        target: dietTemplates.id,
        set: {
          name,
          description,
          instructions,
          type,
        },
      })
      .returning();

    return NextResponse.json(saved);
  } catch (error) {
    console.error('Error saving diet template:', error);
    return NextResponse.json({ error: 'Failed to save diet template' }, { status: 500 });
  }
}
