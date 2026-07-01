import { getCalendarNavigationLabel } from "../../utils/productionCalendar";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const getSectionColumns = (sections) => {
  if (sections.length >= 12) {
    return "xl:grid-cols-3";
  }

  if (sections.length >= 2) {
    return "lg:grid-cols-2";
  }

  return "";
};

const ProductionCalendarGrid = ({
  sections,
  itemsByDay,
  delayedItemsByDay = {},
  onDateClick,
  viewMode,
  referenceDate,
  onPrevious,
  onNext,
}) => {
  const shouldShowSectionTitle = sections.length > 1;
  const navigationLabel = getCalendarNavigationLabel(viewMode, referenceDate);

  if (!sections.length) {
    return (
      <div className="rounded-[28px] border border-dashed border-slate-300 bg-white/80 p-10 text-center text-sm text-slate-500 shadow-sm">
        No calendar days are available for this view yet.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className={`grid gap-5 ${getSectionColumns(sections)}`}>
        {sections.map((section) => (
          <section
            key={section.key}
            className="overflow-hidden rounded-[28px] border border-slate-200 bg-[linear-gradient(180deg,_#ffffff,_#f8fafc)] shadow-sm"
          >
            <div className="border-b border-slate-200/80 px-5 py-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onPrevious}
                    className="rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    aria-label="Previous period"
                  >
                    ←
                  </button>
                  <div className="min-w-[180px] text-center text-lg font-semibold text-slate-900">
                    {shouldShowSectionTitle ? section.title : navigationLabel}
                  </div>
                  <button
                    type="button"
                    onClick={onNext}
                    className="rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    aria-label="Next period"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>

            {section.layout !== "day" ? (
              <div className={`grid ${section.layout === "week" || section.layout === "month" ? "grid-cols-7" : ""} border-b border-slate-200 bg-slate-50/80`}>
                {WEEKDAY_LABELS.slice(0, section.layout === "day" ? 1 : 7).map((label) => (
                  <div
                    key={`${section.key}-${label}`}
                    className="px-2 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500"
                  >
                    {label}
                  </div>
                ))}
              </div>
            ) : null}

            <div className={`grid ${section.layout === "day" ? "grid-cols-1" : "grid-cols-7"}`}>
              {section.days.map((day) => {
                const dayItems = itemsByDay[day.key] || [];
                const delayedItems = delayedItemsByDay[day.key] || [];

                return (
                  <button
                    key={`${section.key}-${day.key}`}
                    type="button"
                    onClick={() => onDateClick?.(day)}
                    className={`min-h-[150px] border-b border-r border-slate-200 p-2 text-left align-top transition hover:bg-cyan-50/60 ${
                      day.isToday ? "bg-cyan-50/70" : "bg-white"
                    } ${day.isCurrentMonth === false ? "bg-slate-50/70 text-slate-400" : ""}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                          day.isToday
                            ? "bg-slate-900 text-white"
                            : day.isCurrentMonth === false
                              ? "text-slate-400"
                              : "text-slate-900"
                        }`}
                      >
                        {day.date.getDate()}
                      </span>
                      {dayItems.length ? (
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600">
                          {dayItems.length}
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-2 space-y-1.5">
                      {delayedItems.length ? (
                        <div className="rounded-xl border border-amber-200 bg-amber-50 px-2.5 py-2 text-[11px] text-amber-900">
                          <p className="truncate font-semibold">
                            Rain delay
                          </p>
                          <p className="truncate opacity-80">
                            {delayedItems[0]?.title}
                            {delayedItems.length > 1 ? ` +${delayedItems.length - 1} more` : ""}
                          </p>
                        </div>
                      ) : null}
                      {dayItems.slice(0, 3).map((item) => (
                        <div
                          key={item._id}
                          className={`rounded-xl px-2.5 py-2 text-[11px] shadow-sm ${
                            item.status === "Pending Close"
                              ? "bg-emerald-100 text-emerald-900"
                              : item.isRainDelayed
                                ? "bg-amber-100 text-amber-900"
                                : item.status === "Scheduled and Open"
                                  ? "bg-sky-100 text-sky-900"
                                  : "bg-slate-100 text-slate-800"
                          }`}
                        >
                          <p className="truncate font-semibold">{item.title}</p>
                          <p className="truncate opacity-80">{item.crewName}</p>
                        </div>
                      ))}
                      {dayItems.length > 3 ? (
                        <p className="px-1 text-[11px] font-medium text-slate-500">
                          +{dayItems.length - 3} more
                        </p>
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default ProductionCalendarGrid;
