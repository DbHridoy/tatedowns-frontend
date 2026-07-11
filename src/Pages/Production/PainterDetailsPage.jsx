import { useMemo, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Link, useParams } from "react-router-dom";
import SimpleLoader from "../../Components/Common/SimpleLoader";
import { CALENDAR_VIEW_MODES } from "../../constants/production";
import { useGetPainterByIdQuery } from "../../redux/api/productionApi";
import {
  addDays,
  formatDateKey,
  normalizePainter,
  parseCalendarDate,
} from "../../utils/productionCalendar";

const DETAIL_VIEW_OPTIONS = [
  { label: "Day", value: CALENDAR_VIEW_MODES.DAY },
  { label: "Week", value: CALENDAR_VIEW_MODES.WEEK },
  { label: "Month", value: CALENDAR_VIEW_MODES.MONTH },
];

const startOfWeek = (value) => {
  const date = parseCalendarDate(value);
  date.setHours(0, 0, 0, 0);
  return addDays(date, -date.getDay());
};

const getRangeForView = (viewMode, referenceDate) => {
  const date = parseCalendarDate(referenceDate);
  date.setHours(0, 0, 0, 0);

  if (viewMode === CALENDAR_VIEW_MODES.DAY) {
    return { startDate: date, endDate: date };
  }

  if (viewMode === CALENDAR_VIEW_MODES.WEEK) {
    const startDate = startOfWeek(date);
    return {
      startDate,
      endDate: addDays(startDate, 6),
    };
  }

  return {
    startDate: new Date(date.getFullYear(), date.getMonth(), 1),
    endDate: new Date(date.getFullYear(), date.getMonth() + 1, 0),
  };
};

const shiftReferenceDate = (referenceDate, viewMode, direction) => {
  if (viewMode === CALENDAR_VIEW_MODES.DAY) {
    return addDays(referenceDate, direction);
  }

  if (viewMode === CALENDAR_VIEW_MODES.WEEK) {
    return addDays(referenceDate, direction * 7);
  }

  return new Date(referenceDate.getFullYear(), referenceDate.getMonth() + direction, 1);
};

const formatRangeLabel = (startDate, endDate, viewMode) => {
  if (viewMode === CALENDAR_VIEW_MODES.DAY) {
    return startDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  if (viewMode === CALENDAR_VIEW_MODES.WEEK) {
    return `${startDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })} - ${endDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`;
  }

  return startDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
};

const buildTimelinePeriods = (viewMode, referenceDate) => {
  const { startDate, endDate } = getRangeForView(viewMode, referenceDate);
  const periods = [];

  for (
    let current = new Date(startDate);
    current <= endDate;
    current = addDays(current, 1)
  ) {
    periods.push({
      key: formatDateKey(current),
      label:
        viewMode === CALENDAR_VIEW_MODES.MONTH
          ? current.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })
          : current.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            }),
    });
  }

  return periods;
};

const PainterDetailsPage = () => {
  const { painterId = "" } = useParams();
  const [viewMode, setViewMode] = useState(CALENDAR_VIEW_MODES.WEEK);
  const [referenceDate, setReferenceDate] = useState(new Date());
  const { data, isLoading, isError } = useGetPainterByIdQuery(painterId, {
    skip: !painterId,
  });

  const painter = useMemo(
    () => (data?.data ? normalizePainter(data.data) : null),
    [data?.data]
  );

  const timelinePeriods = useMemo(
    () => buildTimelinePeriods(viewMode, referenceDate),
    [referenceDate, viewMode]
  );

  const hoursByDate = useMemo(() => {
    const entries = new Map();
    (painter?.dailyWorkedHours || []).forEach((entry) => {
      if (!entry?.workDate) return;
      entries.set(entry.workDate, Number(entry.hours) || 0);
    });
    return entries;
  }, [painter?.dailyWorkedHours]);

  const timelineRows = useMemo(
    () =>
      timelinePeriods.map((period) => ({
        ...period,
        hours: hoursByDate.get(period.key) || 0,
      })),
    [hoursByDate, timelinePeriods]
  );

  const visibleHoursTotal = useMemo(
    () => timelineRows.reduce((sum, row) => sum + Number(row.hours || 0), 0),
    [timelineRows]
  );

  const highestHours = useMemo(
    () => Math.max(...timelineRows.map((row) => Number(row.hours || 0)), 0),
    [timelineRows]
  );

  const visibleRange = useMemo(
    () => getRangeForView(viewMode, referenceDate),
    [referenceDate, viewMode]
  );

  if (isLoading) {
    return <SimpleLoader text="Loading painter details..." className="min-h-[320px]" />;
  }

  if (isError || !painter) {
    return (
      <div className="page-container space-y-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          Unable to load painter details right now.
        </div>
      </div>
    );
  }

  return (
    <div className="page-container space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Link
            to="/production/painters"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Back to Painters
          </Link>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">
            {painter.fullName}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Painter details and worked-hours timeline.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Total Recorded Hours
          </p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {painter.totalWorkedHours.toFixed(2)}h
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Email</p>
          <p className="mt-2 font-medium text-slate-900">{painter.email || "No email"}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Crew</p>
          <p className="mt-2 font-medium text-slate-900">{painter.crewName}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Status</p>
          <p className="mt-2 font-medium text-slate-900">{painter.status}</p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Hours Timeline</h2>
            <p className="mt-1 text-sm text-gray-500">
              Review worked hours by day, week, or month using the same recorded schedule-hour entries.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setReferenceDate((current) =>
                    shiftReferenceDate(current, viewMode, -1)
                  )
                }
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                <FiChevronLeft className="h-4 w-4" />
              </button>
              <div className="min-w-[220px] text-center text-sm font-medium text-slate-700">
                {formatRangeLabel(visibleRange.startDate, visibleRange.endDate, viewMode)}
              </div>
              <button
                type="button"
                onClick={() =>
                  setReferenceDate((current) =>
                    shiftReferenceDate(current, viewMode, 1)
                  )
                }
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                <FiChevronRight className="h-4 w-4" />
              </button>
            </div>

            <select
              value={viewMode}
              onChange={(event) => {
                setViewMode(event.target.value);
                setReferenceDate(new Date());
              }}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-slate-700"
            >
              {DETAIL_VIEW_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Visible Range Hours</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {visibleHoursTotal.toFixed(2)}h
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Worked Days In Range</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {timelineRows.filter((row) => row.hours > 0).length}
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Peak Daily Hours</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {highestHours.toFixed(2)}h
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {timelineRows.length ? (
            timelineRows.map((row) => {
              const width = highestHours > 0 ? Math.max((row.hours / highestHours) * 100, row.hours > 0 ? 8 : 0) : 0;

              return (
                <div
                  key={row.key}
                  className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-center">
                    <div className="w-full md:w-48">
                      <p className="text-sm font-medium text-slate-800">{row.label}</p>
                      <p className="text-xs text-slate-500">{row.key}</p>
                    </div>
                    <div className="flex-1">
                      <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-blue-600 transition-all"
                          style={{ width: `${width}%` }}
                        />
                      </div>
                    </div>
                    <div className="w-full text-left md:w-20 md:text-right">
                      <span className="text-sm font-semibold text-slate-900">
                        {row.hours.toFixed(2)}h
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="rounded-xl border border-dashed border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
              No recorded hours are available for this painter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PainterDetailsPage;
