import { NextRequest, NextResponse } from "next/server";
import { getContacts } from "@/lib/data";

export async function GET() {
  try {
    const contacts = await getContacts();
    // Sort by date, newest first
    contacts.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return NextResponse.json(contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json(
      { error: "お問い合わせの取得に失敗しました" },
      { status: 500 }
    );
  }
}


