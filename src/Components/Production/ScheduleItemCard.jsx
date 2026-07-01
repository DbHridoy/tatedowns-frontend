import { useEffect, useMemo, useState } from "react";
import { SCHEDULE_STATUS_OPTIONS } from "../../constants/production";
import {
  formatDateLabel,
  getScheduleStatusClasses,
} from "../../utils/productionCalendar";

const ScheduleItemCard = ({
  item,
  selectedDateKey = "",
  compact = false,
  canManage = false,
  canPainterUpdate = false,
  onUpdateStatus,
  onUpdatePainterHours,
  onApplyRainDelay,
}) => {
  const statusClassName = getScheduleStatusClasses(item.status);
  const canShowStatusSelect = canManage || (canPainterUpdate && item.canPainterUpdateStatus);
  const [hoursByPainter, setHoursByPainter] = useState({});

  const crewPainters = useMemo(
    () => (Array.isArray(item?.crewPainters) ? item.crewPainters : []),
    [item?.crewPainters]
  );
  const selectedDatePainterHours = useMemo(() => {
    if (!selectedDateKey || !Array.isArray(item?.painterDailyHours)) {
      return [];
    }

    return (
      item.painterDailyHours.find((entry) => entry.workDate === selectedDateKey)?.painterHours || []
    );
  }, [item?.painterDailyHours, selectedDateKey]);

  useEffect(() => {
    const nextHours = {};
    crewPainters.forEach((painter) => {
      const currentEntry = selectedDatePainterHours.find(
        (entry) => entry.painterId === painter._id
      );
      nextHours[painter._id] =
        currentEntry?.hours === 0 || currentEntry?.hours
          ? String(currentEntry.hours)
          : "";
    });
    setHoursByPainter(nextHours);
  }, [crewPainters, selectedDatePainterHours]);

  const handleSavePainterHours = () => {
    const payload = crewPainters.map((painter) => ({
      painterId: painter._id,
      hours: Number(hoursByPainter[painter._id] || 0),
    }));

    onUpdatePainterHours?.(item, selectedDateKey, payload);
  };

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
          {crewPainters.length ? (
            <div className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-2">
              <p className="font-medium text-slate-700">
                Crew painters
                {selectedDateKey ? ` • Hours for ${formatDateLabel(selectedDateKey)}` : ""}
              </p>
              <div className="mt-2 space-y-2">
                {crewPainters.map((painter) => (
                  <div
                    key={painter._id}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-slate-700">{painter.fullName}</p>
                    </div>
                    {canManage ? (
                      <input
                        type="number"
                        min="0"
                        step="0.25"
                        value={hoursByPainter[painter._id] ?? ""}
                        onChange={(event) =>
                          setHoursByPainter((current) => ({
                            ...current,
                            [painter._id]: event.target.value,
                          }))
                        }
                        className="w-24 rounded-md border border-gray-200 px-2 py-1 text-right text-xs text-slate-700"
                        placeholder="0"
                      />
                    ) : (
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600">
                        {(() => {
                          const entry = selectedDatePainterHours.find(
                            (hoursEntry) => hoursEntry.painterId === painter._id
                          );
                          return `${Number(entry?.hours || 0)}h`;
                        })()}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
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
          {canManage && crewPainters.length ? (
            <button
              type="button"
              onClick={handleSavePainterHours}
              className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-100"
            >
              Save Painter Hours
            </button>
          ) : null}
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
