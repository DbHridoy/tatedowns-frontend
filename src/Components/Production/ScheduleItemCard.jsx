import { SCHEDULE_STATUS_OPTIONS } from "../../constants/production";
import {
  formatDateLabel,
  getScheduleStatusClasses,
} from "../../utils/productionCalendar";

const ScheduleItemCard = ({
  item,
  compact = false,
  canManage = false,
  canPainterUpdate = false,
  onUpdateStatus,
  onApplyRainDelay,
}) => {
  const statusClassName = getScheduleStatusClasses(item.status);
  const canShowStatusSelect = canManage || (canPainterUpdate && item.canPainterUpdateStatus);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-slate-900">
            {item.crewName}
          </p>
          <p className="truncate text-sm font-medium text-slate-800">
            {item.title}
          </p>
          <p className="truncate text-xs text-slate-500">
            {item.customJobId || item.jobId}
            {item.location ? ` • ${item.location}` : ""}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-semibold ${statusClassName}`}
        >
          {item.status}
        </span>
      </div>

      {!compact ? (
        <div className="mt-2 space-y-1 text-xs text-slate-500">
          <p>{item.clientName || "Client pending"}</p>
          <p>
            {formatDateLabel(item.startDate)} - {formatDateLabel(item.endDate)}
          </p>
          {item.isRainDelayed ? (
            <>
              <p className="font-medium text-amber-700">
                Rain delayed{item.rainDelayDays ? ` (${item.rainDelayDays}d)` : ""}
              </p>
              {Array.isArray(item.delayedDateKeys) && item.delayedDateKeys.length ? (
                <p className="text-amber-800">
                  Delayed dates:{" "}
                  {item.delayedDateKeys.map((day) => formatDateLabel(day)).join(", ")}
                </p>
              ) : null}
            </>
          ) : null}
        </div>
      ) : item.isRainDelayed ? (
        <p className="mt-1 text-[11px] font-medium text-amber-700">
          Rain delayed
        </p>
      ) : null}

      {canShowStatusSelect || canManage ? (
        <div className="mt-3 flex flex-col gap-2">
          {canShowStatusSelect ? (
            <select
              value={item.status}
              onChange={(event) => onUpdateStatus?.(item, event.target.value)}
              className="rounded-md border border-gray-200 px-2 py-1.5 text-xs text-slate-700"
            >
              {SCHEDULE_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : null}
          {canManage ? (
            <button
              type="button"
              onClick={() => onApplyRainDelay?.(item)}
              className="rounded-md border border-amber-200 bg-amber-50 px-2 py-1.5 text-xs font-medium text-amber-800 hover:bg-amber-100"
            >
              Apply Rain Delay
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default ScheduleItemCard;
