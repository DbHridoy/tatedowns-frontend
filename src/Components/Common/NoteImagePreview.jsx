import { useEffect, useState } from "react";

const NoteImagePreview = ({
  src,
  alt = "Note attachment",
  thumbClassName = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return undefined;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (!src) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="block overflow-hidden rounded border border-gray-200 bg-white"
        aria-label="Open image preview"
      >
        <img src={src} alt={alt} className={thumbClassName} />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/85 p-4 sm:p-6"
          onClick={() => setIsOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
        >
          <button
            type="button"
            className="absolute right-3 top-3 rounded-full bg-white/15 px-3 py-2 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/25 sm:right-5 sm:top-5"
            onClick={() => setIsOpen(false)}
            aria-label="Close image preview"
          >
            Close
          </button>

          <img
            src={src}
            alt={alt}
            className="max-h-[88vh] w-full max-w-6xl object-contain"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};

export default NoteImagePreview;
