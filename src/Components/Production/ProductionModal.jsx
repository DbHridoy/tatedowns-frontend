const ProductionModal = ({
  isOpen,
  title,
  description,
  onClose,
  children,
  footer,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4">
      <div className="flex max-h-[calc(100vh-2rem)] w-[96vw] max-w-2xl flex-col rounded-xl bg-white shadow-xl">
        <div className="border-b px-5 py-4 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              {description ? (
                <p className="mt-1 text-sm text-gray-500">{description}</p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-2 py-1 text-gray-500 hover:bg-gray-100"
            >
              x
            </button>
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 sm:px-6">
          {children}
        </div>
        {footer ? (
          <div className="shrink-0 border-t px-5 py-4 sm:px-6">{footer}</div>
        ) : null}
      </div>
    </div>
  );
};

export default ProductionModal;
