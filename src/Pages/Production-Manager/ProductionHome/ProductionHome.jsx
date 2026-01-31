import DashboardOverview from "../../../Components/Production-Manager/DashboardOverview/DashboardOverview";
import PipelineOverview from "../../../Components/Admin/Dashboard/PipelineOverview";
import PeriodFilter from "../../../Components/Common/PeriodFilter";
import { useGetMyStatsQuery } from "../../../redux/api/common";
import { getDefaultPeriodInput, normalizePeriodDate } from "../../../utils/period";
import { useState } from "react";

const ProductionHome = () => {
  const [periodType, setPeriodType] = useState("year");
  const [dateInput, setDateInput] = useState(getDefaultPeriodInput("year"));
  const { data, isLoading, isError } = useGetMyStatsQuery({
    periodType,
    date: normalizePeriodDate(periodType, dateInput),
  });
  const stats = data?.data;

  return (
    <div className="page-container space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="text-sm text-gray-500">Filter stats by period</div>
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
      <DashboardOverview
        isLoading={isLoading}
        error={isError ? "Failed to load stats" : ""}
        stats={stats}
      />
      <PipelineOverview stats={stats} showFilter={false} />
    </div>
  );
};

export default ProductionHome;
