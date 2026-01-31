const PeriodFilter = ({
  label = "Period",
  periodType,
  dateValue,
  showDate = true,
  onPeriodTypeChange,
  onDateChange,
}) => {
  const inputType =
    periodType === "month"
      ? "month"
      : periodType === "week"
        ? "week"
        : periodType === "year"
          ? "number"
          : "date";

  return (
    <div className="flex flex-col sm:flex-row sm:items-end gap-3">
      <div className="space-y-1">
        <label className="text-xs font-semibold text-gray-500 uppercase">
          {label}
        </label>
        <select
          value={periodType}
          onChange={(e) => onPeriodTypeChange(e.target.value)}
          className="w-full sm:w-40 rounded-md border px-3 py-2 text-sm sm:text-base"
        >
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
        </select>
      </div>
      {showDate && (
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-500 uppercase">
            Date
          </label>
          <input
            type={inputType}
            value={dateValue}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-full sm:w-44 rounded-md border px-3 py-2 text-sm sm:text-base"
          />
        </div>
      )}
    </div>
  );
};

export default PeriodFilter;
