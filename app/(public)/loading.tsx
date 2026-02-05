export default function Loading() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[200]">
      <div className="h-1 w-full bg-gray-100 overflow-hidden">
        <div
          className="h-full bg-primary-600 animate-loading-bar"
          style={{ width: "100%" }}
        />
      </div>
    </div>
  );
}
