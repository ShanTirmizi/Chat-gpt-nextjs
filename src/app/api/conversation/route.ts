import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const conversations = await prisma.conversation.findMany({
    include: {
      messages: true,
    },
  });
  return NextResponse.json(conversations);
}
