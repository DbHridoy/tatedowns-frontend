const padNumber = (value) => String(value).padStart(2, "0");

export const getDefaultPeriodInput = (periodType) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = padNumber(today.getMonth() + 1);
  const day = padNumber(today.getDate());

  if (periodType === "month") {
    return `${year}-${month}`;
  }
  if (periodType === "year") {
    return String(year);
  }
  if (periodType === "week") {
    const date = new Date(Date.UTC(year, today.getMonth(), today.getDate()));
    const dayNum = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil(
      (((date - yearStart) / 86400000) + 1) / 7
    );
    return `${date.getUTCFullYear()}-W${padNumber(weekNo)}`;
  }

  return `${year}-${month}-${day}`;
};

export const normalizePeriodDate = (periodType, value) => {
  if (!value) return "";

  if (periodType === "month") {
    return `${value}-01`;
  }
  if (periodType === "year") {
    return `${value}-01-01`;
  }
  if (periodType === "week") {
    const [yearPart, weekPart] = value.split("-W");
    const year = Number(yearPart);
    const week = Number(weekPart);
    if (!year || !week) return "";
    const jan4 = new Date(Date.UTC(year, 0, 4));
    const dayOfWeek = jan4.getUTCDay() || 7;
    const monday = new Date(jan4);
    monday.setUTCDate(jan4.getUTCDate() - dayOfWeek + 1 + (week - 1) * 7);
    return monday.toISOString().slice(0, 10);
  }

  return value;
};
