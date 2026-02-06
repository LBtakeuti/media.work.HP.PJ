import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const BUCKET_NAME = "uploads";

// Base64をBufferに変換
function base64ToBuffer(base64String: string): { buffer: Buffer; mimeType: string } {
  const matches = base64String.match(/^data:([^;]+);base64,(.+)$/);
  if (!matches) {
    throw new Error("Invalid base64 format");
  }

  const mimeType = matches[1];
  const base64Data = matches[2];
  const buffer = Buffer.from(base64Data, "base64");

  return { buffer, mimeType };
}

// MIMEタイプから拡張子を取得
function getExtensionFromMimeType(mimeType: string): string {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/webp": "webp",
    "image/avif": "avif",
  };
  return map[mimeType] || "jpg";
}

// 単一のBase64画像をアップロードしてURLを返す
async function uploadBase64Image(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  base64String: string,
  folder: string
): Promise<string> {
  const { buffer, mimeType } = base64ToBuffer(base64String);
  const extension = getExtensionFromMimeType(mimeType);
  const fileName = `${randomUUID()}.${extension}`;
  const filePath = `${folder}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, buffer, {
      contentType: mimeType,
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data: publicUrlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}

export async function POST(request: NextRequest) {
  try {
    const { table } = await request.json();

    if (!["news", "services", "portfolio"].includes(table)) {
      return NextResponse.json(
        { error: "Invalid table name" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const result = {
      table,
      total: 0,
      migrated: 0,
      failed: 0,
      errors: [] as string[],
    };

    if (table === "portfolio") {
      // ポートフォリオは images 配列を持つ
      const { data: items, error: fetchError } = await supabase
        .from(table)
        .select("id, images");

      if (fetchError) {
        return NextResponse.json(
          { error: `データ取得エラー: ${fetchError.message}` },
          { status: 500 }
        );
      }

      // Base64を含むレコードをフィルタ
      const itemsWithBase64 = (items || []).filter(
        (item) => item.images?.some((img: string) => img?.startsWith("data:"))
      );

      result.total = itemsWithBase64.length;

      for (const item of itemsWithBase64) {
        try {
          const newImages: string[] = [];

          for (const img of item.images || []) {
            if (img?.startsWith("data:")) {
              const url = await uploadBase64Image(supabase, img, table);
              newImages.push(url);
            } else {
              newImages.push(img);
            }
          }

          const { error: updateError } = await supabase
            .from(table)
            .update({ images: newImages })
            .eq("id", item.id);

          if (updateError) {
            throw new Error(updateError.message);
          }

          result.migrated++;
        } catch (error) {
          result.failed++;
          result.errors.push(
            `ID ${item.id}: ${error instanceof Error ? error.message : "Unknown error"}`
          );
        }
      }
    } else {
      // news, services は単一の image フィールド
      const { data: items, error: fetchError } = await supabase
        .from(table)
        .select("id, image")
        .like("image", "data:%");

      if (fetchError) {
        return NextResponse.json(
          { error: `データ取得エラー: ${fetchError.message}` },
          { status: 500 }
        );
      }

      result.total = items?.length || 0;

      for (const item of items || []) {
        if (!item.image?.startsWith("data:")) {
          continue;
        }

        try {
          const url = await uploadBase64Image(supabase, item.image, table);

          const { error: updateError } = await supabase
            .from(table)
            .update({ image: url })
            .eq("id", item.id);

          if (updateError) {
            throw new Error(updateError.message);
          }

          result.migrated++;
        } catch (error) {
          result.failed++;
          result.errors.push(
            `ID ${item.id}: ${error instanceof Error ? error.message : "Unknown error"}`
          );
        }
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Migration API error:", error);
    return NextResponse.json(
      { error: "移行処理に失敗しました" },
      { status: 500 }
    );
  }
}
