import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import ProductionCalendarToolbar from "../../Components/Production/ProductionCalendarToolbar";
import ProductionCalendarGrid from "../../Components/Production/ProductionCalendarGrid";
import ProductionDayModal from "../../Components/Production/ProductionDayModal";
import RainDelayModal from "../../Components/Production/RainDelayModal";
import ScheduleManagementModal from "../../Components/Production/ScheduleManagementModal";
import ScheduleJobModal from "../../Components/Production/ScheduleJobModal";
import SimpleLoader from "../../Components/Common/SimpleLoader";
import {
  useApplyRainDelayMutation,
  useCreateScheduleItemMutation,
  useGetAvailableJobsForSchedulingQuery,
  useGetCrewsQuery,
  useGetProductionCalendarScheduleQuery,
  useUpdateScheduleItemMutation,
  useUpdateScheduleStatusMutation,
} from "../../redux/api/productionApi";
import { selectUserRole } from "../../redux/slice/authSlice";
import { APP_ROLES } from "../../constants/roles";
import { CALENDAR_VIEW_MODES } from "../../constants/production";
import {
  addDays,
  buildCalendarSections,
  formatDateKey,
  groupDelayedItemsByDay,
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
  const [viewMode, setViewMode] = useState(CALENDAR_VIEW_MODES.MONTH);
  const [referenceDate, setReferenceDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [rainDelayItem, setRainDelayItem] = useState(null);
  const [scheduleModalDay, setScheduleModalDay] = useState(null);
  const [managementAction, setManagementAction] = useState(null);

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
  const { data: availableJobsData, isLoading: isAvailableJobsLoading } =
    useGetAvailableJobsForSchedulingQuery(undefined, {
      skip: !canManage,
    });
  const { data: calendarData, isLoading: isCalendarLoading, isError, refetch: refetchCalendar } =
    useGetProductionCalendarScheduleQuery({
      viewMode,
      startDate: formatDateKey(visibleRange.startDate),
      endDate: formatDateKey(visibleRange.endDate),
    });
  const [applyRainDelay, { isLoading: isApplyingRainDelay }] =
    useApplyRainDelayMutation();
  const [updateScheduleItem, { isLoading: isUpdatingSchedule }] = useUpdateScheduleItemMutation();
  const [updateScheduleStatus] = useUpdateScheduleStatusMutation();
  const [createScheduleItem, { isLoading: isCreatingSchedule }] =
    useCreateScheduleItemMutation();

  const normalizedCalendar = useMemo(
    () => normalizeProductionCalendarResponse(calendarData),
    [calendarData]
  );
  const crews = useMemo(
    () => (crewsData?.data || []).map(normalizeCrew),
    [crewsData?.data]
  );
  const availableJobs = availableJobsData?.data || [];
  const itemsByDay = useMemo(() => {
    return groupScheduleItemsByDay(normalizedCalendar.items, calendarDays);
  }, [calendarDays, normalizedCalendar.items]);
  const delayedItemsByDay = useMemo(() => {
    return groupDelayedItemsByDay(normalizedCalendar.items, calendarDays);
  }, [calendarDays, normalizedCalendar.items]);

  const selectedDayItems = selectedDay?.key ? itemsByDay[selectedDay.key] || [] : [];
  const selectedDayDelayedItems = selectedDay?.key
    ? delayedItemsByDay[selectedDay.key] || []
    : [];

  const openScheduleFromDay = () => {
    if (!selectedDay) return;
    setScheduleModalDay(selectedDay);
    setSelectedDay(null);
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

  const handleUpdatePainterHours = async (item, workDate, painterHours) => {
    try {
      await updateScheduleItem({
        scheduleId: item._id,
        workDate,
        painterHours,
      }).unwrap();
      await refetchCalendar();
      toast.success("Painter hours updated.");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update painter hours.");
    }
  };

  const handleUpdateMaterialExpenses = async (item, materialExpenses) => {
    try {
      await updateScheduleItem({
        scheduleId: item._id,
        materialExpenses,
      }).unwrap();
      await refetchCalendar();
      toast.success("Material expenses updated.");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update material expenses.");
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

  const handleScheduleJob = async (payload) => {
    try {
      await createScheduleItem(payload).unwrap();
      await refetchCalendar();
      toast.success("Job scheduled successfully.");
      setScheduleModalDay(null);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to schedule job.");
    }
  };

  const handleOpenManagementAction = (action, item) => {
    setManagementAction({
      action,
      item,
      selectedDateKey: item?.selectedDateKey || selectedDay?.key || "",
    });
  };

  const handleSubmitManagementAction = async (payload) => {
    if (!managementAction?.item?._id) {
      return;
    }

    try {
      const result = await updateScheduleItem({
        scheduleId: managementAction.item._id,
        ...payload,
      }).unwrap();
      await refetchCalendar();
      setManagementAction(null);
      setSelectedDay(null);
      if (result?.data?.removed) {
        toast.success("Schedule updated.");
        return;
      }
      toast.success("Schedule updated.");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update schedule.");
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
          delayedItemsByDay={delayedItemsByDay}
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
        />
      )}

      <ProductionDayModal
        isOpen={Boolean(selectedDay)}
        day={selectedDay}
        items={selectedDayItems}
        delayedItems={selectedDayDelayedItems}
        canManage={canManage}
        canSchedule={canManage}
        isScheduleDisabled={isAvailableJobsLoading || !availableJobs.length}
        onClose={() => setSelectedDay(null)}
        onManageAction={handleOpenManagementAction}
        onScheduleJob={openScheduleFromDay}
        onUpdateStatus={handleUpdateStatus}
        onUpdatePainterHours={handleUpdatePainterHours}
        onUpdateMaterialExpenses={handleUpdateMaterialExpenses}
        onApplyRainDelay={(item) => setRainDelayItem(item)}
      />

      <ScheduleJobModal
        isOpen={Boolean(scheduleModalDay)}
        selectedDate={scheduleModalDay?.key || formatDateKey(new Date())}
        selectedCrewId=""
        selectedJobId=""
        crews={crews}
        jobs={availableJobs}
        isLoadingJobs={isAvailableJobsLoading}
        isSubmitting={isCreatingSchedule}
        onClose={() => setScheduleModalDay(null)}
        onSubmit={handleScheduleJob}
      />

      <RainDelayModal
        isOpen={Boolean(rainDelayItem)}
        item={rainDelayItem}
        isSubmitting={isApplyingRainDelay}
        onClose={() => setRainDelayItem(null)}
        onSubmit={handleApplyRainDelay}
      />

      <ScheduleManagementModal
        isOpen={Boolean(managementAction)}
        action={managementAction?.action || ""}
        item={managementAction?.item || null}
        crews={crews}
        selectedDateKey={managementAction?.selectedDateKey || ""}
        isSubmitting={isUpdatingSchedule}
        onClose={() => setManagementAction(null)}
        onSubmit={handleSubmitManagementAction}
      />
    </div>
  );
};

export default ProductionCalendarPage;
