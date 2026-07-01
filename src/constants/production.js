export const CALENDAR_VIEW_MODES = {
  DAY: "day",
  WEEK: "week",
  MONTH: "month",
  YEAR: "year",
};

export const CALENDAR_VIEW_OPTIONS = [
  { label: "Day", value: CALENDAR_VIEW_MODES.DAY },
  { label: "Week", value: CALENDAR_VIEW_MODES.WEEK },
  { label: "Month", value: CALENDAR_VIEW_MODES.MONTH },
  { label: "Year", value: CALENDAR_VIEW_MODES.YEAR },
];

export const SCHEDULE_STATUSES = [
  "Scheduled and Open",
  "Pending Close",
];

export const SCHEDULE_STATUS_OPTIONS = SCHEDULE_STATUSES.map((status) => ({
  label: status,
  value: status,
}));

export const CREW_STATUS_OPTIONS = [
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
];

export const PAINTER_STATUS_OPTIONS = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

export const HOURS_PER_PRODUCTION_DAY = 22;

/**
 * @typedef {Object} Painter
 * @property {string} _id
 * @property {string} fullName
 * @property {string} email
 * @property {string} [status]
 * @property {string} [phoneNumber]
 * @property {string|null} [crewId]
 */

/**
 * @typedef {Object} Crew
 * @property {string} _id
 * @property {string} name
 * @property {string} [status]
 * @property {Painter[]} [painters]
 */

/**
 * @typedef {Object} CrewPainterAssignment
 * @property {string} crewId
 * @property {string} painterId
 */

/**
 * @typedef {Object} ProductionScheduleItem
 * @property {string} _id
 * @property {string} jobId
 * @property {string} crewId
 * @property {string} title
 * @property {string} startDate
 * @property {string} endDate
 * @property {string} status
 * @property {string} [clientName]
 * @property {string} [location]
 * @property {boolean} [isRainDelayed]
 * @property {number} [estimatedDurationDays]
 */

/**
 * @typedef {Object} ProductionCalendarResponse
 * @property {Crew[]} crews
 * @property {ProductionScheduleItem[]} items
 */

/**
 * @typedef {"Scheduled and Open"|"Pending Close"} ScheduleStatus
 */

/**
 * @typedef {"day"|"week"|"month"|"year"} CalendarViewMode
 */

/**
 * @typedef {Object} RainDelayRequest
 * @property {number} delayDays
 * @property {string} [reason]
 */

/**
 * @typedef {Object} AvailableJobForScheduling
 * @property {string} _id
 * @property {string} title
 * @property {string} [jobId]
 * @property {string} [clientName]
 * @property {string} [location]
 * @property {number} [defaultDays]
 */
