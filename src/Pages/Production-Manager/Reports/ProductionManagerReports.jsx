import React, { useState } from "react";
import { useGetMyStatsQuery } from "../../../redux/api/common";
import PeriodFilter from "../../../Components/Common/PeriodFilter";
import { getDefaultPeriodInput, normalizePeriodDate } from "../../../utils/period";
import SimpleLoader from "../../../Components/Common/SimpleLoader";

/**
 * Single component that can render any set of stats.
 * Usage example at the bottom (just replace the demo data with your API data).
 */
export default function ProductionManagerReports() {
  // ✅ Replace these with real values from your API (or props if you want)

  const [periodType, setPeriodType] = useState("year");
  const [dateInput, setDateInput] = useState(getDefaultPeriodInput("year"));
  const { data: myStats, isLoading } = useGetMyStatsQuery({
    periodType,
    date: normalizePeriodDate(periodType, dateInput),
  });
  console.log("Line:12-ProductionManagerReports",myStats)
  const stats = [

    { key: "totalSold", label: "Total Sold", value: myStats?.data?.totalSold ?? 0, prefix: "$" },
    { key: "income", label: "Income", value: myStats?.data?.income ?? 0, prefix: "$" },
    { key: "commissionEarned", label: "Commission Earned", value: myStats?.data?.commissionEarned ?? 0, prefix: "$" },
    { key: "commissionPending", label: "Commission Pending", value: myStats?.data?.commissionPending ?? 0, prefix: "$" },
    { key: "totalRevenue", label: "Total Revenue", value: myStats?.data?.totalRevenue ?? 0, prefix: "$" },
    { key: "totalProducedRevenue", label: "Total Produced Revenue", value: myStats?.data?.totalProducedRevenue ?? 0, prefix: "$" },
    { key: "totalClients", label: "Total Clients", value: myStats?.data?.totalClients ?? 0 },
    { key: "totalQuotes", label: "Total Quotes", value: myStats?.data?.totalQuotes ?? 0 },
    { key: "totalJobs", label: "Total Jobs", value: myStats?.data?.totalJobs ?? 0 },
    { key: "totalDc", label: "Total DC", value: myStats?.data?.totalDc ?? 0 },
  ];

  const formatValue = (item) => {
    const raw = item.value ?? 0;

    // If it's a number, format with commas
    const formatted =
      typeof raw === "number" ? raw.toLocaleString() : String(raw);

    return `${item.prefix ?? ""}${formatted}${item.suffix ?? ""}`;
  };

  if (isLoading) {
    return <SimpleLoader text="Loading reports..." />;
  }

  return (
    <div className="page-container space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
            Reports
          </h1>
          <p className="text-sm sm:text-base text-gray-500">
            Overall business stats
          </p>
        </div>
        <PeriodFilter
          periodType={periodType}
          dateValue={dateInput}
          onPeriodTypeChange={(value) => {
            setPeriodType(value);
            setDateInput(getDefaultPeriodInput(value));
          }}
          onDateChange={setDateInput}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item) => (
          <div
            key={item.key}
            className="rounded-xl border bg-white section-pad shadow-sm"
          >
            <div className="text-sm text-gray-500">{item.label}</div>
            <div className="mt-1 text-xl sm:text-2xl font-semibold text-gray-900">
              {formatValue(item)}
            </div>

            {item.subLabel ? (
              <div className="mt-1 text-xs text-gray-400">{item.subLabel}</div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
