import { NextRequest, NextResponse } from "next/server";
import { getContacts, updateContactStatus } from "@/lib/supabase-data";

export async function GET() {
  try {
    const contacts = await getContacts();
    return NextResponse.json(contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json(
      { error: "お問い合わせの取得に失敗しました" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "IDとステータスが必要です" },
        { status: 400 }
      );
    }

    const updatedContact = await updateContactStatus(id, status);
    return NextResponse.json(updatedContact);
  } catch (error) {
    console.error("Error updating contact status:", error);
    return NextResponse.json(
      { error: "ステータスの更新に失敗しました" },
      { status: 500 }
    );
  }
}



