import { NextRequest, NextResponse } from "next/server";
import { unlink } from "fs/promises";
import path from "path";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { fileName: string } }
) {
  try {
    const fileName = params.fileName;
    
    // セキュリティチェック：ファイル名に危険な文字が含まれていないか確認
    if (fileName.includes("..") || fileName.includes("/") || fileName.includes("\\")) {
      return NextResponse.json(
        { error: "無効なファイル名です" },
        { status: 400 }
      );
    }

    const filePath = path.join(process.cwd(), "public", "uploads", fileName);

    try {
      await unlink(filePath);
      return NextResponse.json({ success: true }, { status: 200 });
    } catch (error: any) {
      if (error.code === "ENOENT") {
        return NextResponse.json(
          { error: "ファイルが見つかりません" },
          { status: 404 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json(
      { error: "ファイルの削除に失敗しました" },
      { status: 500 }
    );
  }
}


