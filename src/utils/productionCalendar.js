import {
  CALENDAR_VIEW_MODES,
  HOURS_PER_PRODUCTION_DAY,
} from "../constants/production";

export const parseCalendarDate = (value) => {
  if (value instanceof Date) {
    return new Date(value);
  }

  if (typeof value === "string") {
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      const [, year, month, day] = match;
      return new Date(Number(year), Number(month) - 1, Number(day));
    }
  }

  return new Date(value);
};

export const startOfDay = (value) => {
  const date = parseCalendarDate(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

export const endOfDay = (value) => {
  const date = parseCalendarDate(value);
  date.setHours(23, 59, 59, 999);
  return date;
};

export const addDays = (value, amount) => {
  const date = parseCalendarDate(value);
  date.setDate(date.getDate() + amount);
  return date;
};

export const formatDateKey = (value) => {
  const date = startOfDay(value);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const formatDateLabel = (value, options = {}) =>
  parseCalendarDate(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    ...options,
  });

export const formatDateRangeLabel = (startDate, endDate) => {
  if (!startDate || !endDate) return "Date not set";
  const start = formatDateLabel(startDate);
  const end = formatDateLabel(endDate, { year: "numeric" });
  return `${start} - ${end}`;
};

const getWeekOfYear = (value) => {
  const date = startOfDay(value);
  const yearStart = new Date(date.getFullYear(), 0, 1);
  const diffDays = Math.floor((date.getTime() - yearStart.getTime()) / 86400000);
  return Math.floor((diffDays + yearStart.getDay()) / 7) + 1;
};

const getOrdinal = (value) => {
  const remainderTen = value % 10;
  const remainderHundred = value % 100;

  if (remainderTen === 1 && remainderHundred !== 11) return `${value}st`;
  if (remainderTen === 2 && remainderHundred !== 12) return `${value}nd`;
  if (remainderTen === 3 && remainderHundred !== 13) return `${value}rd`;
  return `${value}th`;
};

export const getCalendarNavigationLabel = (viewMode, referenceDate = new Date()) => {
  const anchor = startOfDay(referenceDate);

  if (viewMode === CALENDAR_VIEW_MODES.DAY) {
    if (formatDateKey(anchor) === formatDateKey(new Date())) {
      return "Today";
    }

    return anchor.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  if (viewMode === CALENDAR_VIEW_MODES.WEEK) {
    return `${getOrdinal(getWeekOfYear(anchor))} Week`;
  }

  if (viewMode === CALENDAR_VIEW_MODES.MONTH) {
    return anchor.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  }

  return anchor.toLocaleDateString("en-US", {
    year: "numeric",
  });
};

export const getCalendarRange = (viewMode, referenceDate = new Date()) => {
  const anchor = startOfDay(referenceDate);

  if (viewMode === CALENDAR_VIEW_MODES.DAY) {
    return {
      startDate: anchor,
      endDate: anchor,
    };
  }

  if (viewMode === CALENDAR_VIEW_MODES.WEEK) {
    return {
      startDate: addDays(anchor, -anchor.getDay()),
      endDate: addDays(addDays(anchor, -anchor.getDay()), 6),
    };
  }

  const monthStart = new Date(anchor.getFullYear(), anchor.getMonth(), 1);

  if (viewMode === CALENDAR_VIEW_MODES.MONTH) {
    return {
      startDate: monthStart,
      endDate: new Date(anchor.getFullYear(), anchor.getMonth() + 1, 0),
    };
  }

  return {
    startDate: new Date(anchor.getFullYear(), 0, 1),
    endDate: new Date(anchor.getFullYear(), 11, 31),
  };
};

export const buildCalendarDays = (viewMode, referenceDate = new Date()) => {
  const { startDate, endDate } = getCalendarRange(viewMode, referenceDate);
  const days = [];

  for (
    let current = startOfDay(startDate);
    current <= endOfDay(endDate);
    current = addDays(current, 1)
  ) {
    days.push({
      key: formatDateKey(current),
      date: new Date(current),
      label: formatDateLabel(current),
      weekday: parseCalendarDate(current).toLocaleDateString("en-US", {
        weekday: "short",
      }),
      isToday: formatDateKey(current) === formatDateKey(new Date()),
    });
  }

  return days;
};

export const buildMonthGrid = (monthDate) => {
  const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
  const firstVisibleDate = addDays(monthStart, -monthStart.getDay());
  const lastVisibleDate = addDays(monthEnd, 6 - monthEnd.getDay());
  const days = [];

  for (
    let current = startOfDay(firstVisibleDate);
    current <= endOfDay(lastVisibleDate);
    current = addDays(current, 1)
  ) {
    days.push({
      key: formatDateKey(current),
      date: new Date(current),
      label: formatDateLabel(current),
      weekday: parseCalendarDate(current).toLocaleDateString("en-US", {
        weekday: "short",
      }),
      isToday: formatDateKey(current) === formatDateKey(new Date()),
      isCurrentMonth: current.getMonth() === monthDate.getMonth(),
    });
  }

  return days;
};

export const buildCalendarSections = (viewMode, referenceDate = new Date()) => {
  const anchor = startOfDay(referenceDate);

  if (viewMode === CALENDAR_VIEW_MODES.DAY) {
    return [
      {
        key: `day-${formatDateKey(anchor)}`,
        title: anchor.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
        layout: "day",
        days: [
          {
            key: formatDateKey(anchor),
            date: new Date(anchor),
            label: formatDateLabel(anchor),
            weekday: anchor.toLocaleDateString("en-US", { weekday: "short" }),
            isToday: formatDateKey(anchor) === formatDateKey(new Date()),
            isCurrentMonth: true,
          },
        ].map((day) => ({
          ...day,
          isCurrentMonth: true,
        })),
      },
    ];
  }

  if (viewMode === CALENDAR_VIEW_MODES.WEEK) {
    const range = getCalendarRange(viewMode, anchor);

    return [
      {
        key: `week-${formatDateKey(range.startDate)}`,
        title: formatDateRangeLabel(range.startDate, range.endDate),
        layout: "week",
        days: buildCalendarDays(viewMode, range.startDate).map((day) => ({
          ...day,
          isCurrentMonth: true,
        })),
      },
    ];
  }

  if (viewMode === CALENDAR_VIEW_MODES.MONTH) {
    const monthDate = new Date(anchor.getFullYear(), anchor.getMonth(), 1);

    return [
      {
        key: `month-${monthDate.getFullYear()}-${monthDate.getMonth()}`,
        title: monthDate.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        }),
        layout: "month",
        days: buildMonthGrid(monthDate),
      },
    ];
  }

  return Array.from({ length: 12 }, (_, index) => {
    const monthDate = new Date(anchor.getFullYear(), index, 1);

    return {
      key: `month-${monthDate.getFullYear()}-${monthDate.getMonth()}`,
      title: monthDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
      monthLabel: monthDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
      layout: "month",
      days: buildMonthGrid(monthDate),
    };
  });
};

export const getDefaultScheduleDays = (job) => {
  const rawHours =
    Number(job?.laborHours) ||
    Number(job?.labourHours) ||
    Number(job?.totalLaborHours) ||
    Number(job?.totalHours) ||
    0;

  if (!rawHours) return 1;
  return Math.max(1, Math.ceil(rawHours / HOURS_PER_PRODUCTION_DAY));
};

export const normalizeCrew = (crew) => ({
  _id: crew?._id || crew?.id || "",
  customCrewId: crew?.customCrewId || "",
  name: crew?.name || crew?.crewName || "Unnamed Crew",
  status: crew?.status || "Active",
  painters: Array.isArray(crew?.painters)
    ? crew.painters
    : Array.isArray(crew?.members)
      ? crew.members
      : [],
});

export const normalizePainter = (painter) => ({
  _id: painter?._id || painter?.id || "",
  fullName: painter?.fullName || painter?.name || "Unnamed Painter",
  email: painter?.email || "",
  status:
    painter?.status ||
    (painter?.isActive === false ? "Inactive" : "Active"),
  isActive: painter?.isActive ?? painter?.status !== "Inactive",
  phoneNumber: painter?.phoneNumber || "",
  crewId:
    painter?.crewId?._id ||
    painter?.crewId ||
    painter?.crew?._id ||
    painter?.crew ||
    null,
  crewName: painter?.crewId?.name || painter?.crew?.name || "Unassigned",
  totalWorkedHours: Number(painter?.totalWorkedHours) || 0,
  dailyWorkedHours: Array.isArray(painter?.dailyWorkedHours)
    ? painter.dailyWorkedHours.map((entry) => ({
        workDate: entry?.workDate || "",
        hours: Number(entry?.hours) || 0,
      }))
    : [],
});

export const normalizeScheduleItem = (item) => {
  const rawStart = item?.startDate || item?.scheduledStartDate || item?.date;
  const durationDays =
    Number(item?.estimatedDurationDays) ||
    Number(item?.durationDays) ||
    Number(item?.days) ||
    1;
  const rawEnd =
    item?.endDate ||
    item?.scheduledEndDate ||
    addDays(rawStart || new Date(), Math.max(durationDays - 1, 0));
  const crewId =
    item?.crewId?._id || item?.crewId || item?.crew?._id || item?.crew || "";
  const jobId = item?.jobId?._id || item?.jobId || item?.job?._id || item?.job || "";
  const client = item?.client || item?.clientId || item?.job?.clientId;
  const rawCrewPainters = Array.isArray(item?.crew?.painters)
    ? item.crew.painters
    : Array.isArray(item?.crewId?.painters)
      ? item.crewId.painters
      : Array.isArray(item?.painters)
        ? item.painters
        : [];
  const rainDelayHistory = Array.isArray(item?.rainDelayHistory)
    ? item.rainDelayHistory
    : [];
  const painterNames = rawCrewPainters.map((painter) => painter?.fullName || painter?.name).filter(Boolean);
  const crewPainters = rawCrewPainters.map((painter) => ({
        _id: painter?._id || painter?.id || "",
        fullName: painter?.fullName || painter?.name || "Unnamed Painter",
        email: painter?.email || "",
        role: painter?.role || "",
      }));
  const painterDailyHours = Array.isArray(item?.painterDailyHours)
    ? item.painterDailyHours
        .map((entry) => ({
          workDate: entry?.workDate ? formatDateKey(entry.workDate) : "",
          painterHours: Array.isArray(entry?.painterHours)
            ? entry.painterHours.map((hoursEntry) => ({
                painterId:
                  hoursEntry?.painter?._id ||
                  hoursEntry?.painter?.id ||
                  hoursEntry?.painterId ||
                  hoursEntry?.painter ||
                  "",
                painterName: hoursEntry?.painter?.fullName || "",
                hours: Number(hoursEntry?.hours) || 0,
              }))
            : [],
        }))
        .filter((entry) => entry.workDate)
    : [];
  const scheduleSegments = Array.isArray(item?.scheduleSegments)
    ? item.scheduleSegments
        .map((segment) => ({
          startDate: segment?.startDate ? formatDateKey(segment.startDate) : "",
          endDate: segment?.endDate ? formatDateKey(segment.endDate) : "",
        }))
        .filter((segment) => segment.startDate && segment.endDate)
    : [];
  const delayedDateKeys = scheduleSegments.reduce((dates, segment, index) => {
    if (index === 0) return dates;

    const previousSegment = scheduleSegments[index - 1];
    let current = addDays(previousSegment.endDate, 1);
    const delayedUntil = addDays(segment.startDate, -1);

    while (startOfDay(current) <= startOfDay(delayedUntil)) {
      dates.push(formatDateKey(current));
      current = addDays(current, 1);
    }

    return dates;
  }, []);
  const visibleRainDelayDays = delayedDateKeys.length;

  return {
    _id: item?._id || item?.id || "",
    jobId,
    crewId,
    crewName: item?.crewId?.name || item?.crew?.name || item?.crewName || "Unassigned",
    title: item?.title || item?.job?.title || item?.jobTitle || `Job ${jobId || ""}`.trim(),
    customJobId:
      item?.customJobId ||
      item?.job?.customJobId ||
      item?.jobId?.customJobId ||
      "",
    clientName: client?.clientName || item?.clientName || "",
    location:
      item?.location ||
      item?.jobSiteLocation ||
      [
        client?.address,
        client?.city,
        client?.state,
        client?.zipCode,
      ]
        .filter(Boolean)
        .join(", ") ||
      client?.jobSiteLocation ||
      item?.address ||
      "",
    startDate: rawStart ? formatDateKey(rawStart) : "",
    endDate: rawEnd ? formatDateKey(rawEnd) : "",
    status: item?.status || "Scheduled and Open",
    notes: item?.notes || item?.note || "",
    estimatedDurationDays: durationDays,
    durationDays,
    displayOrder: Number(item?.displayOrder) || 0,
    estimatedLaborHours:
      Number(item?.estimatedLaborHours) || Number(item?.job?.totalHours) || 0,
    scheduleSegments,
    delayedDateKeys,
    rainDelayHistory,
    isRainDelayed: Boolean(item?.isRainDelayed || item?.rainDelayDays || rainDelayHistory.length),
    rainDelayDays: visibleRainDelayDays,
    totalRainDelayDays:
      Number(item?.rainDelayDays) ||
      rainDelayHistory.reduce(
        (total, entry) => total + Number(entry?.delayDays || 0),
        0
      ),
    painterNames,
    crewPainters,
    painterDailyHours,
    canPainterUpdateStatus: Boolean(
      item?.canPainterUpdateStatus ??
        item?.permissions?.canPainterUpdateStatus
    ),
  };
};

export const normalizeProductionCalendarResponse = (response) => {
  const data = response?.data || response || {};
  const rawItems = Array.isArray(data)
    ? data
    : Array.isArray(data?.items)
      ? data.items
      : Array.isArray(data?.schedule)
        ? data.schedule
        : [];
  const crews = Array.isArray(data?.crews)
    ? data.crews.map(normalizeCrew)
    : [];
  const items = rawItems.map(normalizeScheduleItem);

  return { crews, items };
};

export const groupScheduleItemsByDay = (items = [], days = []) => {
  const lookup = {};

  items.forEach((item) => {
    days.forEach((day) => {
      if (isScheduleItemOnDay(item, day.key)) {
        lookup[day.key] = lookup[day.key] || [];
        lookup[day.key].push(item);
      }
    });
  });

  Object.keys(lookup).forEach((key) => {
    lookup[key] = sortScheduleItems(lookup[key]);
  });

  return lookup;
};

export const groupDelayedItemsByDay = (items = [], days = []) => {
  const lookup = {};

  items.forEach((item) => {
    const delayedKeys = Array.isArray(item?.delayedDateKeys) ? item.delayedDateKeys : [];

    delayedKeys.forEach((dayKey) => {
      if (!days.some((day) => day.key === dayKey)) return;
      lookup[dayKey] = lookup[dayKey] || [];
      lookup[dayKey].push(item);
    });
  });

  Object.keys(lookup).forEach((key) => {
    lookup[key] = sortScheduleItems(lookup[key]);
  });

  return lookup;
};

export const isScheduleItemOnDay = (item, dayKey) => {
  if (!item?.startDate || !item?.endDate) return false;
  if (Array.isArray(item?.scheduleSegments) && item.scheduleSegments.length) {
    return item.scheduleSegments.some((segment) => {
      const day = startOfDay(dayKey);
      const start = startOfDay(segment.startDate);
      const end = endOfDay(segment.endDate);
      return day >= start && day <= end;
    });
  }
  const day = startOfDay(dayKey);
  const start = startOfDay(item.startDate);
  const end = endOfDay(item.endDate);
  return day >= start && day <= end;
};

export const sortScheduleItems = (items = []) =>
  [...items].sort((left, right) => {
    const orderDiff = Number(left?.displayOrder || 0) - Number(right?.displayOrder || 0);
    if (orderDiff !== 0) return orderDiff;

    const startDiff = startOfDay(left?.startDate).getTime() - startOfDay(right?.startDate).getTime();
    if (startDiff !== 0) return startDiff;

    return String(left?._id || "").localeCompare(String(right?._id || ""));
  });

export const getAvailableJobOption = (job) => ({
  _id: job?._id || job?.id || "",
  title:
    job?.title ||
    job?.jobTitle ||
    (job?.clientId?.clientName
      ? `${job.clientId.clientName} Project`
      : job?.clientName
        ? `${job.clientName} Project`
        : "Untitled Job"),
  jobId: job?.customJobId || job?._id || "",
  clientName: job?.clientId?.clientName || job?.clientName || "",
  location:
    job?.location ||
    job?.jobSiteLocation ||
    [
      job?.clientId?.address,
      job?.clientId?.city,
      job?.clientId?.state,
      job?.clientId?.zipCode,
    ]
      .filter(Boolean)
      .join(", ") ||
    job?.clientId?.jobSiteLocation ||
    job?.address ||
    "",
  defaultDays: getDefaultScheduleDays(job),
});

export const getScheduleStatusClasses = (status) => {
  switch (status) {
    case "Pending Close":
      return "bg-green-100 text-green-800";
    case "Scheduled and Open":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-slate-100 text-slate-700";
  }
};
