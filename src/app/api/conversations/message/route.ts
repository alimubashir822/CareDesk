import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { conversationId, content, sender, status } = await req.json();

    if (!conversationId || !content || !sender) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // 1. Create message
    const msg = await db.message.create({
      data: {
        conversationId,
        sender,
        content,
      },
    });

    // 2. Update conversation status if supplied
    const updateData: any = { updatedAt: new Date() };
    if (status) {
      updateData.status = status;
    }

    await db.conversation.update({
      where: { id: conversationId },
      data: updateData,
    });

    return NextResponse.json({ success: true, message: msg });
  } catch (error: any) {
    console.error('Intervention error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
