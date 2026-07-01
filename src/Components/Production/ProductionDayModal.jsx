import ProductionModal from "./ProductionModal";
import ScheduleItemCard from "./ScheduleItemCard";

const ProductionDayModal = ({
  isOpen,
  day,
  items = [],
  delayedItems = [],
  canManage = false,
  canPainterUpdate = false,
  onClose,
  onUpdateStatus,
  onUpdatePainterHours,
  onApplyRainDelay,
}) => {
  const formattedDate = day?.date
    ? day.date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Selected date";

  return (
    <ProductionModal
      isOpen={isOpen}
      onClose={onClose}
      title={formattedDate}
      description="Scheduled jobs for this day, including assigned crews and status."
      footer={
        canManage || canPainterUpdate ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        ) : null
      }
    >
      <div className="space-y-4">
        {delayedItems.length ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-semibold text-amber-900">Rain delay on this day</p>
            <div className="mt-3 space-y-2">
              {delayedItems.map((item) => (
                <div key={`delay-${item._id}`} className="rounded-xl bg-white/80 p-3 text-sm text-amber-900">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-amber-800">{item.crewName}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
        {items.length ? (
          items.map((item) => (
            <div key={item._id} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
              <div className="mb-3">
                <p className="text-sm font-semibold text-slate-900">
                  {item.crewName || "Crew pending"}
                </p>
                <p className="text-xs text-slate-500">
                  {item.clientName || "Client pending"}
                </p>
              </div>

              <ScheduleItemCard
                item={item}
                selectedDateKey={day?.key || ""}
                canManage={canManage}
                canPainterUpdate={canPainterUpdate}
                onUpdateStatus={onUpdateStatus}
                onUpdatePainterHours={onUpdatePainterHours}
                onApplyRainDelay={(scheduleItem) =>
                  onApplyRainDelay?.({
                    ...scheduleItem,
                    affectedFromDate: day?.key || "",
                  })
                }
              />
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
            No jobs are scheduled for this day yet.
          </div>
        )}
      </div>
    </ProductionModal>
  );
};

export default ProductionDayModal;
