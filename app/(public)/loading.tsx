export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          {/* 外側のリング */}
          <div className="h-12 w-12 rounded-full border-4 border-gray-200" />
          {/* 回転するリング */}
          <div className="absolute top-0 left-0 h-12 w-12 animate-spin rounded-full border-4 border-transparent border-t-primary-600" />
        </div>
        <p className="text-sm text-gray-500">読み込み中...</p>
      </div>
    </div>
  );
}
