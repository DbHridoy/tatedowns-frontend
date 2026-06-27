import ProductionModal from "./ProductionModal";
import ScheduleItemCard from "./ScheduleItemCard";

const ProductionDayModal = ({
  isOpen,
  day,
  items = [],
  canManage = false,
  onClose,
  onScheduleJob,
  onUpdateStatus,
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
        canManage ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => onScheduleJob?.(day)}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700"
            >
              Schedule Job
            </button>
          </div>
        ) : null
      }
    >
      <div className="space-y-4">
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
                canManage={canManage}
                onUpdateStatus={onUpdateStatus}
                onApplyRainDelay={onApplyRainDelay}
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
