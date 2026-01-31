
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";
import PeriodFilter from "../../Common/PeriodFilter";
import { useGetSummaryStatsQuery } from "../../../redux/api/common";
import { getDefaultPeriodInput, normalizePeriodDate } from "../../../utils/period";
import { useState } from "react";

export default function PipelineOverview({
  stats,
  showFilter = true,
}) {
  const [periodType, setPeriodType] = useState("year");
  const [dateInput, setDateInput] = useState(getDefaultPeriodInput("year"));
  const shouldUseSummaryStats = !stats;
  const { data: summaryStatsData } = useGetSummaryStatsQuery(
    {
      periodType,
      date: normalizePeriodDate(periodType, dateInput),
    },
    { skip: !shouldUseSummaryStats }
  );
  const summaryStats = summaryStatsData?.data || {};
  const data = shouldUseSummaryStats
    ? [
        {
          name: "Clients",
          value: summaryStats.totalClients ?? 0,
          color: "#0EA5E9",
        },
        {
          name: "Quotes",
          value: summaryStats.totalQuotes ?? 0,
          color: "#7DD3FC",
        },
        { name: "Jobs", value: summaryStats.totalJobs ?? 0, color: "#F59E0B" },
        {
          name: "Scheduled",
          value: summaryStats.scheduledJobs ?? 0,
          color: "#FCD34D",
        },
        {
          name: "Pending Close",
          value: summaryStats.pendingCloseJobs ?? 0,
          color: "#8B5CF6",
        },
        {
          name: "Closed",
          value: summaryStats.closedJobs ?? 0,
          color: "#6B7280",
        },
      ]
    : [
        {
          name: "Ready to Schedule",
          value: stats?.readyToScheduleCount ?? 0,
          color: "#0EA5E9",
        },
        {
          name: "Scheduled & Open",
          value: stats?.scheduledAndOpenCount ?? 0,
          color: "#7DD3FC",
        },
        {
          name: "Pending Close",
          value: stats?.pendingCloseCount ?? 0,
          color: "#F59E0B",
        },
        {
          name: "Closed",
          value: stats?.closedCount ?? 0,
          color: "#10B981",
        },
        {
          name: "Cancelled",
          value: stats?.cancelledCount ?? 0,
          color: "#6B7280",
        },
      ];

  return (
    <div className="w-full section-pad lg:p-8 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="mb-1 text-xl sm:text-2xl font-semibold text-gray-900">
            Pipeline Overview
          </h1>
          <p className="mb-2 text-sm sm:text-base text-gray-600">
            Job status progression
          </p>
        </div>
        {showFilter && (
          <PeriodFilter
            label="Summary"
            periodType={periodType}
            dateValue={dateInput}
            onPeriodTypeChange={(value) => {
              setPeriodType(value);
              setDateInput(getDefaultPeriodInput(value));
            }}
            onDateChange={setDateInput}
          />
        )}
      </div>

      <div className="mt-4">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="0"
              stroke="#E5E7EB"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B7280", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B7280", fontSize: 12 }}
              ticks={[0, 50, 100, 150]}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={80}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
