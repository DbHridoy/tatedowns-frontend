import { useEffect, useRef } from "react";

const formatDateTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString();
};

const NotificationsDropdown = ({
  notifications = [],
  onClose,
  onItemClick,
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target)) {
        onClose?.();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [onClose]);

  return (
    <div
      ref={containerRef}
      className="fixed left-4 right-4 top-16 z-20 rounded-lg border border-gray-200 bg-white shadow-lg sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-3 sm:w-[min(28rem,calc(100vw-2rem))]"
    >
      <div className="border-b px-4 py-3">
        <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
      </div>
      <div className="max-h-[70vh] overflow-y-auto sm:max-h-80">
        {notifications.length === 0 ? (
          <div className="px-4 py-6 text-center text-sm text-gray-500">
            No notifications yet.
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item._id}
              className={`border-b px-4 py-3 last:border-b-0 ${
                item.isRead ? "bg-white" : "bg-blue-50"
              }`}
            >
              <button
                type="button"
                onClick={() => onItemClick?.(item)}
                className="flex w-full items-start gap-3 text-left"
              >
                <span
                  className={`mt-1 inline-flex h-2 w-2 rounded-full ${
                    item.isRead ? "bg-gray-300" : "bg-blue-500"
                  }`}
                />
                <div className="flex-1">
                  <p className="text-sm text-gray-800">{item.message}</p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                    <span>{formatDateTime(item.createdAt)}</span>
                    {!item.isRead && (
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                        Unread
                      </span>
                    )}
                  </div>
                </div>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsDropdown;
