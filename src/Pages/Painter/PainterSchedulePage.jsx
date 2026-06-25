import { useMemo } from "react";
import toast from "react-hot-toast";
import SimpleLoader from "../../Components/Common/SimpleLoader";
import ScheduleItemCard from "../../Components/Production/ScheduleItemCard";
import {
  useGetPainterOwnScheduleQuery,
  useUpdateScheduleStatusMutation,
} from "../../redux/api/productionApi";
import { CALENDAR_VIEW_MODES } from "../../constants/production";
import {
  formatDateKey,
  getCalendarRange,
  normalizeProductionCalendarResponse,
} from "../../utils/productionCalendar";

const PainterSchedulePage = () => {
  const range = getCalendarRange(CALENDAR_VIEW_MODES.ONE_MONTH, new Date());
  const { data, isLoading } = useGetPainterOwnScheduleQuery({
    viewMode: CALENDAR_VIEW_MODES.ONE_MONTH,
    startDate: formatDateKey(range.startDate),
    endDate: formatDateKey(range.endDate),
  });
  const [updateScheduleStatus] = useUpdateScheduleStatusMutation();

  const scheduleItems = useMemo(
    () => normalizeProductionCalendarResponse(data).items,
    [data]
  );

  const groupedItems = scheduleItems.reduce((groups, item) => {
    const key = item.startDate?.slice(0, 10) || "unscheduled";
    groups[key] = groups[key] || [];
    groups[key].push(item);
    return groups;
  }, {});

  const handleUpdateStatus = async (item, status) => {
    if (!item.canPainterUpdateStatus || item.status === status) return;

    try {
      await updateScheduleStatus({ scheduleId: item._id, status }).unwrap();
      toast.success("Status updated.");
    } catch (error) {
      toast.error(error?.data?.message || "Unable to update status.");
    }
  };

  if (isLoading) {
    return <SimpleLoader text="Loading schedule..." className="min-h-[300px]" />;
  }

  return (
    <div className="page-container space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">My Schedule</h1>
        <p className="mt-1 text-sm text-gray-500">
          Upcoming work assignments, job site locations, and production status only.
        </p>
      </div>

      {Object.keys(groupedItems).length ? (
        <div className="space-y-5">
          {Object.entries(groupedItems).map(([date, items]) => (
            <section
              key={date}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-slate-900">
                {date === "unscheduled"
                  ? "Date Pending"
                  : new Date(date).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
              </h2>
              <div className="mt-4 grid gap-3 lg:grid-cols-2">
                {items.map((item) => (
                  <ScheduleItemCard
                    key={item._id}
                    item={item}
                    canPainterUpdate
                    onUpdateStatus={handleUpdateStatus}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
          No schedule has been assigned yet.
        </div>
      )}
    </div>
  );
};

export default PainterSchedulePage;
