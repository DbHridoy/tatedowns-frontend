const formatCurrency = (value, options = {}) => {
  if (value === null || value === undefined || value === "") return "—";
  const amount = Number(value);
  if (!Number.isFinite(amount)) return value;

  const { locale = "en-US", currency = "USD" } = options;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
};

export default formatCurrency;
