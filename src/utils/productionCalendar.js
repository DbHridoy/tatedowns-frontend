import {
  CALENDAR_VIEW_MODES,
  HOURS_PER_PRODUCTION_DAY,
} from "../constants/production";

export const startOfDay = (value) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

export const endOfDay = (value) => {
  const date = new Date(value);
  date.setHours(23, 59, 59, 999);
  return date;
};

export const addDays = (value, amount) => {
  const date = new Date(value);
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
  new Date(value).toLocaleDateString("en-US", {
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

export const getCalendarRange = (viewMode, referenceDate = new Date()) => {
  const anchor = startOfDay(referenceDate);

  if (viewMode === CALENDAR_VIEW_MODES.TWO_WEEKS) {
    return {
      startDate: anchor,
      endDate: addDays(anchor, 13),
    };
  }

  const monthStart = new Date(anchor.getFullYear(), anchor.getMonth(), 1);

  if (viewMode === CALENDAR_VIEW_MODES.ONE_MONTH) {
    return {
      startDate: monthStart,
      endDate: new Date(anchor.getFullYear(), anchor.getMonth() + 1, 0),
    };
  }

  return {
    startDate: monthStart,
    endDate: new Date(anchor.getFullYear(), anchor.getMonth() + 3, 0),
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
      weekday: new Date(current).toLocaleDateString("en-US", {
        weekday: "short",
      }),
      isToday: formatDateKey(current) === formatDateKey(new Date()),
    });
  }

  return days;
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
  const client = item?.clientId || item?.job?.clientId;
  const rainDelayHistory = Array.isArray(item?.rainDelayHistory)
    ? item.rainDelayHistory
    : [];
  const painterNames = Array.isArray(item?.crew?.painters)
    ? item.crew.painters.map((painter) => painter?.fullName).filter(Boolean)
    : [];

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
    startDate: rawStart ? new Date(rawStart).toISOString() : "",
    endDate: rawEnd ? new Date(rawEnd).toISOString() : "",
    status: item?.status || "Not Started",
    notes: item?.notes || item?.note || "",
    estimatedDurationDays: durationDays,
    durationDays,
    estimatedLaborHours:
      Number(item?.estimatedLaborHours) || Number(item?.job?.totalHours) || 0,
    rainDelayHistory,
    isRainDelayed: Boolean(item?.isRainDelayed || item?.rainDelayDays || rainDelayHistory.length),
    rainDelayDays:
      Number(item?.rainDelayDays) ||
      rainDelayHistory.reduce(
        (total, entry) => total + Number(entry?.delayDays || 0),
        0
      ),
    painterNames,
    canPainterUpdateStatus: Boolean(
      item?.canPainterUpdateStatus ??
        item?.permissions?.canPainterUpdateStatus
    ),
  };
};

export const normalizeProductionCalendarResponse = (response) => {
  const data = response?.data || response || {};
  const crews = Array.isArray(data?.crews)
    ? data.crews.map(normalizeCrew)
    : [];
  const items = Array.isArray(data?.items)
    ? data.items.map(normalizeScheduleItem)
    : Array.isArray(data?.schedule)
      ? data.schedule.map(normalizeScheduleItem)
      : [];

  return { crews, items };
};

export const isScheduleItemOnDay = (item, dayKey) => {
  if (!item?.startDate || !item?.endDate) return false;
  const day = startOfDay(dayKey);
  const start = startOfDay(item.startDate);
  const end = endOfDay(item.endDate);
  return day >= start && day <= end;
};

export const getAvailableJobOption = (job) => ({
  _id: job?._id || job?.id || "",
  title: job?.title || `Job ${job?.customJobId || job?._id || ""}`.trim(),
  jobId: job?.customJobId || job?._id || "",
  clientName: job?.clientId?.clientName || job?.clientName || "",
  location:
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
    case "Completed":
      return "bg-green-100 text-green-800";
    case "In Progress":
      return "bg-blue-100 text-blue-800";
    case "Delayed":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-slate-100 text-slate-700";
  }
};
