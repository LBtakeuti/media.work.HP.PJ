import { NextResponse } from "next/server";
import { readdir } from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    
    try {
      const files = await readdir(uploadsDir);
      
      // .gitkeepファイルを除外
      const imageFiles = files.filter(
        (file) => !file.startsWith(".") && /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
      );

      const images = imageFiles.map((fileName) => ({
        url: `/uploads/${fileName}`,
        fileName: fileName,
      }));

      return NextResponse.json(images);
    } catch (error: any) {
      if (error.code === "ENOENT") {
        // ディレクトリが存在しない場合は空配列を返す
        return NextResponse.json([]);
      }
      throw error;
    }
  } catch (error) {
    console.error("Error listing images:", error);
    return NextResponse.json(
      { error: "画像一覧の取得に失敗しました" },
      { status: 500 }
    );
  }
}



