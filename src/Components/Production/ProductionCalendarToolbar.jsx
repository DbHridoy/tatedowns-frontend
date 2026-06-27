import { CALENDAR_VIEW_OPTIONS } from "../../constants/production";
import {
  formatDateRangeLabel,
  getCalendarRange,
} from "../../utils/productionCalendar";

const ProductionCalendarToolbar = ({
  viewMode,
  referenceDate,
  onViewModeChange,
  onToday,
  title = "Production Calendar",
}) => {
  const range = getCalendarRange(viewMode, referenceDate);

  return (
    <div className="rounded-[28px] border border-slate-200 bg-[linear-gradient(180deg,_#ffffff,_#f8fafc)] p-5 shadow-sm">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">
            {title}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {formatDateRangeLabel(range.startDate, range.endDate)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 xl:justify-end">
          <button
            type="button"
            onClick={onToday}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Today
          </button>
          <div className="inline-flex rounded-2xl border border-slate-200 bg-slate-100 p-1">
            {CALENDAR_VIEW_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onViewModeChange(option.value)}
                className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                  viewMode === option.value
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductionCalendarToolbar;
