const SimpleLoader = ({
  text = "Loading...",
  fullScreen = false,
  className = "",
}) => {
  const containerClass = fullScreen
    ? "min-h-screen"
    : "min-h-[200px] rounded-lg border border-dashed border-gray-200 bg-white";

  return (
    <div
      className={`flex items-center justify-center p-6 ${containerClass} ${className}`}
    >
      <div className="inline-flex items-center gap-3 text-gray-600">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
        <span className="text-sm font-medium">{text}</span>
      </div>
    </div>
  );
};

export default SimpleLoader;
