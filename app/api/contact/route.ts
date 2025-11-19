import { NextRequest, NextResponse } from "next/server";
import { saveContact } from "@/lib/data";
import { randomUUID } from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "すべての項目を入力してください" },
        { status: 400 }
      );
    }

    const contact = {
      id: randomUUID(),
      name,
      email,
      subject,
      message,
      createdAt: new Date().toISOString(),
    };

    await saveContact(contact);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error saving contact:", error);
    return NextResponse.json(
      { error: "送信に失敗しました" },
      { status: 500 }
    );
  }
}

