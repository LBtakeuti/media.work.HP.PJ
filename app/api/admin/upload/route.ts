import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const BUCKET_NAME = "uploads";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "ファイルが選択されていません" },
        { status: 400 }
      );
    }

    // ファイルタイプの検証
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "許可されていないファイル形式です。JPEG、PNG、GIF、WebPのみアップロード可能です。" },
        { status: 400 }
      );
    }

    // ファイルサイズの検証（10MB以下）
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "ファイルサイズが大きすぎます。10MB以下のファイルをアップロードしてください。" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // ファイル名の生成（UUID + 元の拡張子）
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const fileName = `${randomUUID()}.${fileExtension}`;
    const filePath = `content/${fileName}`;

    // ファイルをArrayBufferに変換
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Supabase Storageにアップロード
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error("Supabase Storage error:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      
      // バケットが存在しない場合のエラーメッセージ
      if (error.message?.includes('Bucket not found') || error.message?.includes('not found')) {
        return NextResponse.json(
          { error: `ストレージバケット「${BUCKET_NAME}」が存在しません。Supabaseダッシュボードでバケットを作成してください。` },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { error: `アップロードに失敗しました: ${error.message || 'Unknown error'}` },
        { status: 500 }
      );
    }

    if (!data) {
      console.error("Upload succeeded but no data returned");
      return NextResponse.json(
        { error: "アップロードに失敗しました: データが返されませんでした" },
        { status: 500 }
      );
    }

    // 公開URLを取得
    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return NextResponse.json(
      {
        success: true,
        url: publicUrlData.publicUrl,
        fileName: fileName,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "ファイルのアップロードに失敗しました" },
      { status: 500 }
    );
  }
}



