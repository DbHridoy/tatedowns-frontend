import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import ProductionCalendarToolbar from "../../Components/Production/ProductionCalendarToolbar";
import ProductionCalendarGrid from "../../Components/Production/ProductionCalendarGrid";
import ProductionDayModal from "../../Components/Production/ProductionDayModal";
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
  buildCalendarSections,
  formatDateKey,
  groupScheduleItemsByDay,
  normalizeCrew,
  normalizeProductionCalendarResponse,
} from "../../utils/productionCalendar";

const shiftReferenceDate = (viewMode, referenceDate, direction) => {
  if (viewMode === CALENDAR_VIEW_MODES.DAY) {
    return addDays(referenceDate, direction);
  }

  if (viewMode === CALENDAR_VIEW_MODES.WEEK) {
    return addDays(referenceDate, direction * 7);
  }

  if (viewMode === CALENDAR_VIEW_MODES.MONTH) {
    return new Date(referenceDate.getFullYear(), referenceDate.getMonth() + direction, 1);
  }

  return new Date(referenceDate.getFullYear() + direction, 0, 1);
};

const ProductionCalendarPage = () => {
  const role = useSelector(selectUserRole);
  const canManage = role === APP_ROLES.ADMIN || role === APP_ROLES.PRODUCTION_MANAGER;
  const [viewMode, setViewMode] = useState(CALENDAR_VIEW_MODES.WEEK);
  const [referenceDate, setReferenceDate] = useState(new Date());
  const [scheduleModalState, setScheduleModalState] = useState({
    open: false,
    date: "",
    crewId: "",
  });
  const [selectedDay, setSelectedDay] = useState(null);
  const [rainDelayItem, setRainDelayItem] = useState(null);

  const calendarSections = useMemo(
    () => buildCalendarSections(viewMode, referenceDate),
    [referenceDate, viewMode]
  );
  const calendarDays = useMemo(
    () => calendarSections.flatMap((section) => section.days),
    [calendarSections]
  );
  const visibleRange = useMemo(() => {
    if (!calendarDays.length) {
      return {
        startDate: new Date(),
        endDate: new Date(),
      };
    }

    return {
      startDate: calendarDays[0].date,
      endDate: calendarDays[calendarDays.length - 1].date,
    };
  }, [calendarDays]);

  const { data: crewsData, isLoading: isCrewsLoading } = useGetCrewsQuery();
  const { data: calendarData, isLoading: isCalendarLoading, isError, refetch: refetchCalendar } =
    useGetProductionCalendarScheduleQuery({
      viewMode,
      startDate: formatDateKey(visibleRange.startDate),
      endDate: formatDateKey(visibleRange.endDate),
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
  const itemsByDay = useMemo(() => {
    return groupScheduleItemsByDay(normalizedCalendar.items, calendarDays);
  }, [calendarDays, normalizedCalendar.items]);

  const selectedDayItems = selectedDay?.key ? itemsByDay[selectedDay.key] || [] : [];

  const findCalendarDayByKey = (dateKey) =>
    calendarDays.find((day) => day.key === dateKey) || null;

  const handleScheduleSubmit = async (payload) => {
    try {
      await createScheduleItem(payload).unwrap();
      await refetchCalendar();
      toast.success("Job scheduled successfully.");
      setScheduleModalState({ open: false, date: "", crewId: "" });
      const scheduledDay = findCalendarDayByKey(payload.startDate);
      if (scheduledDay) {
        setSelectedDay(scheduledDay);
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to schedule job.");
    }
  };

  const handleUpdateStatus = async (item, status) => {
    if (status === item.status) return;

    try {
      await updateScheduleStatus({ scheduleId: item._id, status }).unwrap();
      await refetchCalendar();
      toast.success("Schedule status updated.");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update status.");
    }
  };

  const handleApplyRainDelay = async (payload) => {
    try {
      await applyRainDelay(payload).unwrap();
      await refetchCalendar();
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
        onToday={() => setReferenceDate(new Date())}
      />

      {isCrewsLoading || isCalendarLoading ? (
        <SimpleLoader text="Loading production calendar..." className="min-h-[360px]" />
      ) : isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          Unable to load the production calendar right now.
        </div>
      ) : (
        <ProductionCalendarGrid
          sections={calendarSections}
          itemsByDay={itemsByDay}
          canManage={canManage}
          onDateClick={(day) => setSelectedDay(day)}
          viewMode={viewMode}
          referenceDate={referenceDate}
          onPrevious={() =>
            setReferenceDate((current) => shiftReferenceDate(viewMode, current, -1))
          }
          onNext={() =>
            setReferenceDate((current) => shiftReferenceDate(viewMode, current, 1))
          }
          onScheduleJob={(section) => {
            const firstDay = section?.days?.find((day) => day?.isCurrentMonth !== false)
              || section?.days?.[0];
            setSelectedDay(null);
            setScheduleModalState({
              open: true,
              date: firstDay?.key || formatDateKey(new Date()),
              crewId: "",
            });
          }}
        />
      )}

      <ProductionDayModal
        isOpen={Boolean(selectedDay)}
        day={selectedDay}
        items={selectedDayItems}
        canManage={canManage}
        onClose={() => setSelectedDay(null)}
        onScheduleJob={(day) => {
          if (!canManage) return;
          setSelectedDay(null);
          setScheduleModalState({
            open: true,
            date: day?.key || formatDateKey(new Date()),
            crewId: "",
          });
        }}
        onUpdateStatus={handleUpdateStatus}
        onApplyRainDelay={(item) => setRainDelayItem(item)}
      />

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
