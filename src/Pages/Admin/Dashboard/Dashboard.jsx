import React, { useMemo, useState } from "react";
import PipelineOverview from "../../../Components/Admin/Dashboard/PipelineOverview";
import PendingApprovals from "../../../Components/Dashboard/PendingApprovals";
import DataTable from "../../../Components/Common/DataTable";
import PeriodFilter from "../../../Components/Common/PeriodFilter";
import { useGetLeaderBoardQuery, useGetMyStatsQuery } from "../../../redux/api/common";
import { getDefaultPeriodInput, normalizePeriodDate } from "../../../utils/period";
import CardData from "../../../Components/Admin/Dashboard/CardData";


const Dashboard = () => {
  const [statsPeriodType, setStatsPeriodType] = useState("year");
  const [statsDateInput, setStatsDateInput] = useState(
    getDefaultPeriodInput("year")
  );
  const [leaderboardPeriodType, setLeaderboardPeriodType] = useState("year");
  const [leaderboardDateInput, setLeaderboardDateInput] = useState(
    getDefaultPeriodInput("year")
  );
  const [leaderboardSortKey, setLeaderboardSortKey] = useState("");
  const [leaderboardSortOrder, setLeaderboardSortOrder] = useState("asc");
  const { data, isLoading, isError } = useGetMyStatsQuery({
    periodType: statsPeriodType,
    date: normalizePeriodDate(statsPeriodType, statsDateInput),
  });
  const normalizedLeaderboardPeriod = String(leaderboardPeriodType || "").toLowerCase();
  const leaderboardDate = normalizePeriodDate(
    normalizedLeaderboardPeriod,
    leaderboardDateInput
  );
  const { data: leaderBoardData } = useGetLeaderBoardQuery({
    periodType: normalizedLeaderboardPeriod,
    date: leaderboardDate,
  });
  const stats = data?.data;
  const leaderBoard = leaderBoardData?.data || [];
  const leaderboardRows = leaderBoard.map((rep) => ({
    id: rep._id,
    name: rep.user?.fullName || rep.userId?.fullName || "N/A",
    totalClients: rep.totalClients,
    totalQuotes: rep.totalQuotes,
    totalJobs: rep.totalJobs,
    totalRevenueSold: rep.totalRevenueSold,
    totalRevenueProduced: rep.totalRevenueProduced,
  }));
  const sortedLeaderboardRows = useMemo(() => {
    if (!leaderboardSortKey) return leaderboardRows;

    const sorted = [...leaderboardRows].sort((a, b) => {
      const left = a[leaderboardSortKey];
      const right = b[leaderboardSortKey];

      if (leaderboardSortKey === "name") {
        return String(left || "").localeCompare(String(right || ""));
      }

      const leftNum = Number(left) || 0;
      const rightNum = Number(right) || 0;
      return leftNum - rightNum;
    });

    return leaderboardSortOrder === "desc" ? sorted.reverse() : sorted;
  }, [leaderboardRows, leaderboardSortKey, leaderboardSortOrder]);
  const formatCurrency = (value) => {
    const amount = Number(value) || 0;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };
  const baseColumns = [
    { label: "No", accessor: "No" },
    { label: "Name", accessor: "name", sortable: true },
    {
      label: "Total Revenue Sold",
      accessor: "totalRevenueSold",
      sortable: true,
      format: (value) => formatCurrency(value),
    },
  ];
  const optionalColumns = {
    totalClients: { label: "Total Clients", accessor: "totalClients", sortable: true },
    totalQuotes: { label: "Total Quotes", accessor: "totalQuotes", sortable: true },
    totalJobs: { label: "Total Jobs", accessor: "totalJobs", sortable: true },
    totalRevenueProduced: {
      label: "Total Revenue Produced",
      accessor: "totalRevenueProduced",
      sortable: true,
      format: (value) => formatCurrency(value),
    },
  };
  const leaderboardColumns = [
    ...baseColumns,
    ...(leaderboardSortKey && optionalColumns[leaderboardSortKey]
      ? [optionalColumns[leaderboardSortKey]]
      : []),
  ];
  const leaderboardConfig = {
    columns: leaderboardColumns,
    showMobileSort: false,
    filters: [
      {
        label: "Sort By",
        accessor: "leaderboardSort",
        value: leaderboardSortKey || "",
        options: {
          Name: "name",
          "Total Clients": "totalClients",
          "Total Quotes": "totalQuotes",
          "Total Jobs": "totalJobs",
          "Total Revenue Sold": "totalRevenueSold",
          "Total Revenue Produced": "totalRevenueProduced",
        },
      },
    ],
    totalItems: sortedLeaderboardRows.length,
    currentPage: 1,
    itemsPerPage: Math.max(sortedLeaderboardRows.length, 1),
    sortKey: leaderboardSortKey,
    sortOrder: leaderboardSortOrder,
    onPageChange: () => { },
    onSortChange: (sortKey) => {
      if (sortKey === leaderboardSortKey) {
        setLeaderboardSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
        return;
      }

      setLeaderboardSortKey(sortKey);
      setLeaderboardSortOrder("asc");
    },
    onFilterChange: (key, value) => {
      if (key !== "leaderboardSort") return;
      setLeaderboardSortKey(value);
      setLeaderboardSortOrder("asc");
    },
  };

  return (
    <div className="page-container space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="text-sm ">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-gray-500">Filter stats by period</p>
        </div>
        <PeriodFilter
          periodType={statsPeriodType}
          dateValue={statsDateInput}
          onPeriodTypeChange={(value) => {
            setStatsPeriodType(value);
            setStatsDateInput(getDefaultPeriodInput(value));
          }}
          onDateChange={setStatsDateInput}
        />
      </div>
      <CardData stats={stats} isLoading={isLoading} isError={isError} />
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900">
          Sales Rep Leaderboard
        </h2>
        <PeriodFilter
          label="Leaderboard"
          periodType={leaderboardPeriodType}
          dateValue={leaderboardDateInput}
          onPeriodTypeChange={(value) => {
            setLeaderboardPeriodType(value);
            setLeaderboardDateInput(getDefaultPeriodInput(value));
          }}
          onDateChange={setLeaderboardDateInput}
        />
      </div>
      <DataTable
        title=""
        data={sortedLeaderboardRows}
        config={{ ...leaderboardConfig, showSearch: false, showPagination: false }}
      />
      <PipelineOverview />
      {/* <PendingApprovals/> */}
    </div>
  );
};

export default Dashboard;
