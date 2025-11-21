import { NextRequest, NextResponse } from "next/server";
import { getContacts } from "@/lib/data";
import { promises as fs } from "fs";
import path from "path";

const contactFilePath = path.join(process.cwd(), "data", "contacts.json");

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const contacts = await getContacts();
    const filteredContacts = contacts.filter((c) => c.id !== params.id);

    if (contacts.length === filteredContacts.length) {
      return NextResponse.json(
        { error: "お問い合わせが見つかりません" },
        { status: 404 }
      );
    }

    await fs.writeFile(
      contactFilePath,
      JSON.stringify(filteredContacts, null, 2),
      "utf8"
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting contact:", error);
    return NextResponse.json(
      { error: "お問い合わせの削除に失敗しました" },
      { status: 500 }
    );
  }
}



