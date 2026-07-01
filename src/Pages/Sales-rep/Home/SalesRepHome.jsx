import Pipeline from "../../../Components/Sales-rep/Home/Pipeline";
import SalesRepHomeCards from "../../../Components/Sales-rep/Home/SalesRepHomeCards";
import DataTable from "../../../Components/Common/DataTable";
import PeriodFilter from "../../../Components/Common/PeriodFilter";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../redux/slice/authSlice";
import {
  FiBriefcase,
  FiFileText,
  FiUsers,
} from "react-icons/fi";
import { useGetMeQuery } from "../../../redux/api/userApi";
import { useGetLeaderBoardQuery, useGetMyStatsQuery } from "../../../redux/api/common";
import { getDefaultPeriodInput, normalizePeriodDate } from "../../../utils/period";
import { useMemo, useState } from "react";
import SimpleLoader from "../../../Components/Common/SimpleLoader";
const SalesRepHome = () => {
  const { data: userData, isLoading } = useGetMeQuery();
  const [statsPeriodType, setStatsPeriodType] = useState("year");
  const [statsDateInput, setStatsDateInput] = useState(
    getDefaultPeriodInput("year")
  );
  const [leaderboardPeriodType, setLeaderboardPeriodType] = useState("year");
  const [leaderboardDateInput, setLeaderboardDateInput] = useState(
    getDefaultPeriodInput("year")
  );
  const { data: myStats, isLoading: isStatsLoading } = useGetMyStatsQuery({
    periodType: statsPeriodType,
    date: normalizePeriodDate(statsPeriodType, statsDateInput),
  });
  console.log(myStats);
  const { data: leaderBoardData, isLoading: isLeaderboardLoading } = useGetLeaderBoardQuery({
    periodType: leaderboardPeriodType,
    date: normalizePeriodDate(leaderboardPeriodType, leaderboardDateInput),
  });
  const [leaderboardSortKey, setLeaderboardSortKey] = useState("totalRevenueSold");
  const user = userData?.data;
  const cards = [
    {
      title: "Total leads",
      value: myStats?.data?.totalClients || 0,
      icon: <FiUsers className="h-6 w-6 text-blue-700" />,
    },
    {
      title: "Total quotes",
      value: myStats?.data?.totalQuotes || 0,
      icon: <FiFileText className="h-6 w-6 text-blue-700" />,
    },
    {
      title: "Total jobs",
      value: myStats?.data?.totalJobs || 0,
      icon: <FiBriefcase className="h-6 w-6 text-blue-700" />,
    },
    {
      title: "Jobs closed",
      value:
        myStats?.data?.totalJobsClosed ??
        myStats?.data?.closedJobs ??
        myStats?.data?.totalClosedJobs ??
        0,
      icon: <FiBriefcase className="h-6 w-6 text-blue-700" />,
    },
  ];
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
    if (!leaderboardSortKey) return leaderboardRows.slice(0, 5);

    const sorted = [...leaderboardRows].sort((a, b) => {
      const left = a[leaderboardSortKey];
      const right = b[leaderboardSortKey];

      if (leaderboardSortKey === "name") {
        return String(right || "").localeCompare(String(left || ""));
      }

      const leftNum = Number(left) || 0;
      const rightNum = Number(right) || 0;
      return rightNum - leftNum;
    });

    return sorted.slice(0, 5);
  }, [leaderboardRows, leaderboardSortKey]);
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
          // Name: "name",
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
    sortOrder: "desc",
    onPageChange: () => { },
    onSortChange: (sortKey) => {
      setLeaderboardSortKey(sortKey);
    },
    onFilterChange: (key, value) => {
      if (key !== "leaderboardSort") return;
      setLeaderboardSortKey(value);
    },
  };
  return (
    <div className="page-container space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
          Home
        </h1>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <p className="text-sm sm:text-base text-gray-500">
          Filter stats by period
        </p>
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

      {/* Cards overview */}
      {isLoading || isStatsLoading ? (
        <SimpleLoader text="Loading dashboard..." />
      ) : (
        <SalesRepHomeCards cards={cards} />
      )}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
          Top 5 Sales Reps
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
        loading={isLeaderboardLoading}
      />

      <div className="pt-2">
        <div className="flex flex-col lg:flex-row gap-4">
          <Pipeline data={cards} />
        </div>
      </div>
    </div>
  );
};

export default SalesRepHome;
