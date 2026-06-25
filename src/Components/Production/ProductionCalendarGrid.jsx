import ScheduleItemCard from "./ScheduleItemCard";

const ProductionCalendarGrid = ({
  crews,
  days,
  itemsByCrewAndDay,
  onCellClick,
  onUpdateStatus,
  onApplyRainDelay,
  canManage = false,
}) => {
  if (!crews.length) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
        No crews are available yet. Create a crew to start scheduling work.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <div
        className="grid min-w-[1100px]"
        style={{
          gridTemplateColumns: `220px repeat(${days.length}, minmax(160px, 1fr))`,
        }}
      >
        <div className="sticky left-0 z-20 border-b border-r bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
          Crew
        </div>
        {days.map((day) => (
          <button
            key={day.key}
            type="button"
            onClick={() => onCellClick?.({ date: day.key })}
            className={`border-b border-r px-3 py-3 text-left ${
              day.isToday ? "bg-sky-50" : "bg-slate-50"
            }`}
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {day.weekday}
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-800">{day.label}</p>
          </button>
        ))}

        {crews.map((crew) => (
          <div key={crew._id} className="contents">
            <div className="sticky left-0 z-10 border-b border-r bg-white px-4 py-4">
              <p className="font-semibold text-slate-900">{crew.name}</p>
              <p className="mt-1 text-xs text-slate-500">
                {crew.painters?.length || 0} painter
                {(crew.painters?.length || 0) === 1 ? "" : "s"}
              </p>
              <button
                type="button"
                onClick={() => onCellClick?.({ crewId: crew._id })}
                className="mt-3 rounded-md border border-dashed border-gray-300 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                Schedule Job
              </button>
            </div>

            {days.map((day) => {
              const key = `${crew._id}-${day.key}`;
              const dayItems = itemsByCrewAndDay[key] || [];

              return (
                <div
                  key={key}
                  onClick={() => onCellClick?.({ crewId: crew._id, date: day.key })}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onCellClick?.({ crewId: crew._id, date: day.key });
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  className={`min-h-[150px] border-b border-r px-2 py-2 text-left align-top ${
                    day.isToday ? "bg-sky-50/40" : "bg-white"
                  } hover:bg-slate-50`}
                >
                  <div className="space-y-2">
                    {dayItems.length ? (
                      dayItems.map((item) => (
                        <div key={item._id} onClick={(event) => event.stopPropagation()}>
                          <ScheduleItemCard
                            item={item}
                            compact
                            canManage={canManage}
                            onUpdateStatus={onUpdateStatus}
                            onApplyRainDelay={onApplyRainDelay}
                          />
                        </div>
                      ))
                    ) : (
                      <div className="rounded-lg border border-dashed border-gray-200 px-2 py-4 text-center text-xs text-gray-400">
                        Open slot
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductionCalendarGrid;
