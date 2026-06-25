import { CALENDAR_VIEW_OPTIONS } from "../../constants/production";
import { formatDateRangeLabel, getCalendarRange } from "../../utils/productionCalendar";

const ProductionCalendarToolbar = ({
  viewMode,
  referenceDate,
  onViewModeChange,
  onPrevious,
  onNext,
  onToday,
}) => {
  const range = getCalendarRange(viewMode, referenceDate);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Production Calendar
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {formatDateRangeLabel(range.startDate, range.endDate)}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onPrevious}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={onToday}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Today
            </button>
            <button
              type="button"
              onClick={onNext}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
          <select
            value={viewMode}
            onChange={(event) => onViewModeChange(event.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700"
          >
            {CALENDAR_VIEW_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ProductionCalendarToolbar;

