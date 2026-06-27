import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import SimpleLoader from "../../Components/Common/SimpleLoader";
import ProductionCalendarGrid from "../../Components/Production/ProductionCalendarGrid";
import ProductionCalendarToolbar from "../../Components/Production/ProductionCalendarToolbar";
import ProductionDayModal from "../../Components/Production/ProductionDayModal";
import {
  useGetPainterOwnScheduleQuery,
  useUpdateScheduleStatusMutation,
} from "../../redux/api/productionApi";
import { CALENDAR_VIEW_MODES } from "../../constants/production";
import {
  addDays,
  buildCalendarSections,
  formatDateKey,
  groupScheduleItemsByDay,
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

const PainterSchedulePage = () => {
  const [viewMode, setViewMode] = useState(CALENDAR_VIEW_MODES.WEEK);
  const [referenceDate, setReferenceDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);

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

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useGetPainterOwnScheduleQuery({
    viewMode,
    startDate: formatDateKey(visibleRange.startDate),
    endDate: formatDateKey(visibleRange.endDate),
  });
  const [updateScheduleStatus] = useUpdateScheduleStatusMutation();

  const scheduleItems = useMemo(
    () => normalizeProductionCalendarResponse(data).items,
    [data]
  );
  const itemsByDay = useMemo(
    () => groupScheduleItemsByDay(scheduleItems, calendarDays),
    [calendarDays, scheduleItems]
  );
  const selectedDayItems = selectedDay?.key ? itemsByDay[selectedDay.key] || [] : [];

  const handleUpdateStatus = async (item, status) => {
    if (!item.canPainterUpdateStatus || item.status === status) return;

    try {
      await updateScheduleStatus({ scheduleId: item._id, status }).unwrap();
      await refetch();
      toast.success("Status updated.");
    } catch (error) {
      toast.error(error?.data?.message || "Unable to update status.");
    }
  };

  if (isLoading) {
    return <SimpleLoader text="Loading schedule..." className="min-h-[320px]" />;
  }

  return (
    <div className="page-container space-y-6">
      <ProductionCalendarToolbar
        title="My Schedule"
        viewMode={viewMode}
        referenceDate={referenceDate}
        onViewModeChange={setViewMode}
        onToday={() => setReferenceDate(new Date())}
      />

      {isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          Unable to load your schedule right now.
        </div>
      ) : (
        <ProductionCalendarGrid
          sections={calendarSections}
          itemsByDay={itemsByDay}
          canManage={false}
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
        canManage={false}
        canPainterUpdate
        onClose={() => setSelectedDay(null)}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
};

export default PainterSchedulePage;
