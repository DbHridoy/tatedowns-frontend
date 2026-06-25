import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import ProductionCalendarToolbar from "../../Components/Production/ProductionCalendarToolbar";
import ProductionCalendarGrid from "../../Components/Production/ProductionCalendarGrid";
import ScheduleJobModal from "../../Components/Production/ScheduleJobModal";
import RainDelayModal from "../../Components/Production/RainDelayModal";
import SimpleLoader from "../../Components/Common/SimpleLoader";
import {
  useApplyRainDelayMutation,
  useCreateScheduleItemMutation,
  useGetAvailableJobsForSchedulingQuery,
  useGetCrewsQuery,
  useGetProductionCalendarScheduleQuery,
  useUpdateScheduleStatusMutation,
} from "../../redux/api/productionApi";
import { selectUserRole } from "../../redux/slice/authSlice";
import { APP_ROLES } from "../../constants/roles";
import { CALENDAR_VIEW_MODES } from "../../constants/production";
import {
  addDays,
  buildCalendarDays,
  formatDateKey,
  getCalendarRange,
  isScheduleItemOnDay,
  normalizeCrew,
  normalizeProductionCalendarResponse,
} from "../../utils/productionCalendar";

const shiftReferenceDate = (viewMode, referenceDate, direction) => {
  if (viewMode === CALENDAR_VIEW_MODES.TWO_WEEKS) {
    return addDays(referenceDate, direction * 14);
  }

  if (viewMode === CALENDAR_VIEW_MODES.ONE_MONTH) {
    return new Date(referenceDate.getFullYear(), referenceDate.getMonth() + direction, 1);
  }

  return new Date(referenceDate.getFullYear(), referenceDate.getMonth() + direction * 3, 1);
};

const ProductionCalendarPage = () => {
  const role = useSelector(selectUserRole);
  const canManage = role === APP_ROLES.ADMIN || role === APP_ROLES.PRODUCTION_MANAGER;
  const [viewMode, setViewMode] = useState(CALENDAR_VIEW_MODES.TWO_WEEKS);
  const [referenceDate, setReferenceDate] = useState(new Date());
  const [scheduleModalState, setScheduleModalState] = useState({
    open: false,
    date: "",
    crewId: "",
  });
  const [rainDelayItem, setRainDelayItem] = useState(null);

  const calendarRange = useMemo(
    () => getCalendarRange(viewMode, referenceDate),
    [referenceDate, viewMode]
  );
  const calendarDays = useMemo(
    () => buildCalendarDays(viewMode, referenceDate),
    [referenceDate, viewMode]
  );

  const { data: crewsData, isLoading: isCrewsLoading } = useGetCrewsQuery();
  const { data: calendarData, isLoading: isCalendarLoading, isError } =
    useGetProductionCalendarScheduleQuery({
      viewMode,
      startDate: formatDateKey(calendarRange.startDate),
      endDate: formatDateKey(calendarRange.endDate),
    });
  const { data: jobsData, isLoading: isJobsLoading } =
    useGetAvailableJobsForSchedulingQuery({
      startDate: scheduleModalState.date,
    });
  const [createScheduleItem, { isLoading: isCreatingSchedule }] =
    useCreateScheduleItemMutation();
  const [applyRainDelay, { isLoading: isApplyingRainDelay }] =
    useApplyRainDelayMutation();
  const [updateScheduleStatus] = useUpdateScheduleStatusMutation();

  const normalizedCalendar = useMemo(
    () => normalizeProductionCalendarResponse(calendarData),
    [calendarData]
  );
  const crews = useMemo(() => {
    const apiCrews = Array.isArray(crewsData?.data)
      ? crewsData.data.map(normalizeCrew)
      : [];

    if (apiCrews.length) return apiCrews;
    return normalizedCalendar.crews;
  }, [crewsData?.data, normalizedCalendar.crews]);
  const itemsByCrewAndDay = useMemo(() => {
    const lookup = {};

    normalizedCalendar.items.forEach((item) => {
      calendarDays.forEach((day) => {
        if (isScheduleItemOnDay(item, day.key)) {
          const key = `${item.crewId}-${day.key}`;
          lookup[key] = lookup[key] || [];
          lookup[key].push(item);
        }
      });
    });

    return lookup;
  }, [calendarDays, normalizedCalendar.items]);

  const handleScheduleSubmit = async (payload) => {
    try {
      await createScheduleItem(payload).unwrap();
      toast.success("Job scheduled successfully.");
      setScheduleModalState({ open: false, date: "", crewId: "" });
    } catch (error) {
      toast.error(error?.data?.message || "Failed to schedule job.");
    }
  };

  const handleUpdateStatus = async (item, status) => {
    if (status === item.status) return;

    try {
      await updateScheduleStatus({ scheduleId: item._id, status }).unwrap();
      toast.success("Schedule status updated.");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update status.");
    }
  };

  const handleApplyRainDelay = async (payload) => {
    try {
      await applyRainDelay(payload).unwrap();
      toast.success("Rain delay applied.");
      setRainDelayItem(null);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to apply rain delay.");
    }
  };

  return (
    <div className="page-container space-y-6">
      <ProductionCalendarToolbar
        viewMode={viewMode}
        referenceDate={referenceDate}
        onViewModeChange={setViewMode}
        onPrevious={() =>
          setReferenceDate((current) => shiftReferenceDate(viewMode, current, -1))
        }
        onNext={() =>
          setReferenceDate((current) => shiftReferenceDate(viewMode, current, 1))
        }
        onToday={() => setReferenceDate(new Date())}
      />

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Crew workload overview
            </h2>
            <p className="text-sm text-gray-500">
              Review crew assignments, schedule overlapping work, and manage rain delays from a single calendar.
            </p>
          </div>
          {canManage ? (
            <button
              type="button"
              onClick={() =>
                setScheduleModalState({
                  open: true,
                  date: formatDateKey(new Date()),
                  crewId: "",
                })
              }
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Schedule Job
            </button>
          ) : null}
        </div>
      </div>

      {isCrewsLoading || isCalendarLoading ? (
        <SimpleLoader text="Loading production calendar..." className="min-h-[360px]" />
      ) : isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          Unable to load the production calendar right now.
        </div>
      ) : (
        <ProductionCalendarGrid
          crews={crews}
          days={calendarDays}
          itemsByCrewAndDay={itemsByCrewAndDay}
          canManage={canManage}
          onCellClick={({ date = "", crewId = "" }) => {
            if (!canManage) return;
            setScheduleModalState({
              open: true,
              date: date || formatDateKey(new Date()),
              crewId,
            });
          }}
          onUpdateStatus={handleUpdateStatus}
          onApplyRainDelay={(item) => setRainDelayItem(item)}
        />
      )}

      <ScheduleJobModal
        isOpen={scheduleModalState.open}
        selectedDate={scheduleModalState.date}
        selectedCrewId={scheduleModalState.crewId}
        crews={crews}
        jobs={jobsData?.data || []}
        isLoadingJobs={isJobsLoading}
        isSubmitting={isCreatingSchedule}
        onClose={() => setScheduleModalState({ open: false, date: "", crewId: "" })}
        onSubmit={handleScheduleSubmit}
      />

      <RainDelayModal
        isOpen={Boolean(rainDelayItem)}
        item={rainDelayItem}
        isSubmitting={isApplyingRainDelay}
        onClose={() => setRainDelayItem(null)}
        onSubmit={handleApplyRainDelay}
      />
    </div>
  );
};

export default ProductionCalendarPage;
