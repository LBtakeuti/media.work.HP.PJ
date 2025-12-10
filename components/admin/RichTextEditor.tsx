"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { useCallback, useState } from "react";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function RichTextEditor({
  content,
  onChange,
}: RichTextEditorProps) {
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [fileInput, setFileInput] = useState<HTMLInputElement | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary-600 underline",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg my-4",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4",
      },
    },
  });

  const handleLinkClick = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const fragment = editor.state.selection.content().content;
    const selectedText = (fragment as { textContent?: string }).textContent || "";
    setLinkUrl(previousUrl || "");
    setLinkText(selectedText || "");
    setShowLinkModal(true);
  }, [editor]);

  const handleLinkSubmit = useCallback(() => {
    if (!editor) return;
    
    if (linkUrl === "") {
      // URLが空の場合はリンクを削除
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      const { from, to } = editor.state.selection;
      const hasSelection = from !== to;
      
      if (hasSelection) {
        // テキストが選択されている場合：選択テキストにリンクを適用
        editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run();
      } else {
        // テキストが選択されていない場合：リンクテキストとURLを挿入
        const textToInsert = linkText || linkUrl;
        editor.chain().focus().insertContent(`<a href="${linkUrl}">${textToInsert}</a>`).run();
      }
    }
    setShowLinkModal(false);
    setLinkUrl("");
    setLinkText("");
  }, [editor, linkUrl, linkText]);

  const handleImageClick = useCallback(() => {
    if (!editor || isUploading) return;
    // ファイル入力のクリックイベントをトリガー
    if (fileInput) {
      fileInput.click();
    }
  }, [editor, fileInput, isUploading]);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editor) return;
    
    const file = e.target.files?.[0];
    if (!file) return;

    // ファイルタイプの検証
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      alert("許可されていないファイル形式です。JPEG、PNG、GIF、WebPのみアップロード可能です。");
      return;
    }

    // ファイルサイズの検証（10MB以下）
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert("ファイルサイズが大きすぎます。10MB以下のファイルをアップロードしてください。");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.url) {
        // アップロード成功：画像をエディターに挿入
        editor.chain().focus().setImage({ src: data.url }).run();
      } else {
        alert(data.error || "画像のアップロードに失敗しました");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("画像のアップロード中にエラーが発生しました");
    } finally {
      setIsUploading(false);
      // ファイル入力をリセット（同じファイルを再度選択できるように）
      if (fileInput) {
        fileInput.value = "";
      }
    }
  }, [editor, fileInput]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1">
        {/* Text Formatting */}
        <div className="flex gap-1 border-r border-gray-300 pr-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              editor.isActive("bold")
                ? "bg-primary-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
            title="太字"
          >
            B
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`px-3 py-1 rounded text-sm font-medium italic transition-colors ${
              editor.isActive("italic")
                ? "bg-primary-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
            title="斜体"
          >
            I
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`px-3 py-1 rounded text-sm font-medium underline transition-colors ${
              editor.isActive("underline")
                ? "bg-primary-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
            title="下線"
          >
            U
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`px-3 py-1 rounded text-sm font-medium line-through transition-colors ${
              editor.isActive("strike")
                ? "bg-primary-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
            title="取り消し線"
          >
            S
          </button>
        </div>

        {/* Headings */}
        <div className="flex gap-1 border-r border-gray-300 pr-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              editor.isActive("heading", { level: 2 })
                ? "bg-primary-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
            title="見出し2"
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              editor.isActive("heading", { level: 3 })
                ? "bg-primary-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
            title="見出し3"
          >
            H3
          </button>
        </div>

        {/* Lists */}
        <div className="flex gap-1 border-r border-gray-300 pr-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              editor.isActive("bulletList")
                ? "bg-primary-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
            title="箇条書き"
          >
            <span className={editor.isActive("bulletList") ? "text-white" : "text-gray-700"}>
              ・
            </span>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              editor.isActive("orderedList")
                ? "bg-primary-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
            title="番号付きリスト"
          >
            1.
          </button>
        </div>

        {/* Alignment */}
        <div className="flex gap-1 border-r border-gray-300 pr-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              editor.isActive({ textAlign: "left" })
                ? "bg-primary-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
            title="左揃え"
          >
            ⇤
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              editor.isActive({ textAlign: "center" })
                ? "bg-primary-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
            title="中央揃え"
          >
            ≡
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              editor.isActive({ textAlign: "right" })
                ? "bg-primary-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
            title="右揃え"
          >
            ⇥
          </button>
        </div>

        {/* Text Color */}
        <div className="flex gap-1 border-r border-gray-300 pr-2">
          <input
            type="color"
            onInput={(e) =>
              editor.chain().focus().setColor(e.currentTarget.value).run()
            }
            value={editor.getAttributes("textStyle").color || "#000000"}
            className="w-8 h-8 rounded cursor-pointer"
            title="文字色"
          />
          <button
            type="button"
            onClick={() => editor.chain().focus().unsetColor().run()}
            className="px-3 py-1 rounded text-sm font-medium bg-white text-gray-700 hover:bg-gray-100 transition-colors"
            title="色をリセット"
          >
            ✕
          </button>
        </div>

        {/* Link & Image */}
        <div className="flex gap-1 border-r border-gray-300 pr-2">
          <button
            type="button"
            onClick={handleLinkClick}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              editor.isActive("link")
                ? "bg-primary-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
            title="リンク"
          >
            🔗
          </button>
          <button
            type="button"
            onClick={handleImageClick}
            disabled={isUploading}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              isUploading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
            title={isUploading ? "アップロード中..." : "画像"}
          >
            {isUploading ? "⏳" : "🖼️"}
          </button>
        </div>

        {/* Clear Formatting */}
        <button
          type="button"
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
          className="px-3 py-1 rounded text-sm font-medium bg-white text-gray-700 hover:bg-gray-100 transition-colors"
          title="書式をクリア"
        >
          Clear
        </button>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} className="bg-white" />

      {/* Hidden File Input */}
      <input
        type="file"
        ref={(el) => setFileInput(el)}
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">リンクを設定</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  表示テキスト
                </label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="リンクの表示テキスト"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      document.getElementById("link-url-input")?.focus();
                    }
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL
                </label>
                <input
                  id="link-url-input"
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleLinkSubmit();
                    } else if (e.key === "Escape") {
                      setShowLinkModal(false);
                      setLinkUrl("");
                      setLinkText("");
                    }
                  }}
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-4">
              <button
                type="button"
                onClick={() => {
                  setShowLinkModal(false);
                  setLinkUrl("");
                  setLinkText("");
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                キャンセル
              </button>
              <button
                type="button"
                onClick={handleLinkSubmit}
                disabled={!linkUrl}
                className={`px-4 py-2 rounded-md transition-colors ${
                  linkUrl
                    ? "text-white bg-primary-600 hover:bg-primary-700"
                    : "text-gray-400 bg-gray-200 cursor-not-allowed"
                }`}
              >
                適用
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
