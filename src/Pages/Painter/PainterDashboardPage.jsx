import { useMemo } from "react";
import SimpleLoader from "../../Components/Common/SimpleLoader";
import ScheduleItemCard from "../../Components/Production/ScheduleItemCard";
import {
  useGetPainterOwnCrewQuery,
  useGetPainterOwnScheduleQuery,
} from "../../redux/api/productionApi";
import {
  CALENDAR_VIEW_MODES,
} from "../../constants/production";
import {
  formatDateKey,
  getCalendarRange,
  normalizeCrew,
  normalizeProductionCalendarResponse,
} from "../../utils/productionCalendar";

const PainterDashboardPage = () => {
  const range = getCalendarRange(CALENDAR_VIEW_MODES.WEEK, new Date());
  const { data: crewData, isLoading: isCrewLoading } = useGetPainterOwnCrewQuery();
  const { data: scheduleData, isLoading: isScheduleLoading } =
    useGetPainterOwnScheduleQuery({
      viewMode: CALENDAR_VIEW_MODES.WEEK,
      startDate: formatDateKey(range.startDate),
      endDate: formatDateKey(range.endDate),
    });

  const crew = crewData?.data ? normalizeCrew(crewData.data) : null;
  const schedule = useMemo(
    () => normalizeProductionCalendarResponse(scheduleData).items,
    [scheduleData]
  );
  const upcomingItems = schedule.slice(0, 3);

  if (isCrewLoading || isScheduleLoading) {
    return <SimpleLoader text="Loading painter dashboard..." className="min-h-[300px]" />;
  }

  return (
    <div className="page-container space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Painter Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Review your crew assignment, next jobs, and current project status.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Assigned Crew</p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">
            {crew?.name || "Unassigned"}
          </h2>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Upcoming Jobs</p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">
            {schedule.length}
          </h2>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Crew Painters</p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">
            {crew?.painters?.length || 0}
          </h2>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Next Assignments</h2>
        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          {upcomingItems.length ? (
            upcomingItems.map((item) => (
              <ScheduleItemCard
                key={item._id}
                item={item}
              />
            ))
          ) : (
            <p className="text-sm text-gray-500">No upcoming jobs assigned yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PainterDashboardPage;
