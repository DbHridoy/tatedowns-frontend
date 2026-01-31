import Pipeline from "../../../Components/Sales-rep/Home/Pipeline";
import SalesRepHomeCards from "../../../Components/Sales-rep/Home/SalesRepHomeCards";
import DataTable from "../../../Components/Common/DataTable";
import PeriodFilter from "../../../Components/Common/PeriodFilter";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../redux/slice/authSlice";
import {
  FiBriefcase,
  FiDollarSign,
  FiFileText,
  FiUsers,
} from "react-icons/fi";
import { useGetMeQuery } from "../../../redux/api/userApi";
import { useGetLeaderBoardQuery, useGetMyStatsQuery } from "../../../redux/api/common";
import { getDefaultPeriodInput, normalizePeriodDate } from "../../../utils/period";
import { useMemo, useState } from "react";
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
  const { data: myStats } = useGetMyStatsQuery({
    periodType: statsPeriodType,
    date: normalizePeriodDate(statsPeriodType, statsDateInput),
  });
  console.log(myStats);
  const { data: leaderBoardData } = useGetLeaderBoardQuery({
    periodType: leaderboardPeriodType,
    date: normalizePeriodDate(leaderboardPeriodType, leaderboardDateInput),
  });
  const [leaderboardSortKey, setLeaderboardSortKey] = useState("");
  const [leaderboardSortOrder, setLeaderboardSortOrder] = useState("asc");
  const user = userData?.data;
  const cards = [
    {
      title: "Total sold",
      count: myStats?.data?.totalRevenueSold || 0,
      icon: <FiDollarSign className="h-6 w-6 text-blue-700" />,
    },
    {
      title: "Total clients",
      count: myStats?.data?.totalClients || 0,
      icon: <FiUsers className="h-6 w-6 text-blue-700" />,
    },
    {
      title: "Total quotes",
      count: myStats?.data?.totalQuotes || 0,
      icon: <FiFileText className="h-6 w-6 text-blue-700" />,
    },
    {
      title: "Total jobs",
      count: myStats?.data?.totalJobs || 0,
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
    revenueEarned: rep.totalRevenueSold,
    revenueProduced: rep.totalRevenueProduced,
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
  const leaderboardConfig = {
    columns: [
      { label: "No", accessor: "No" },
      { label: "Name", accessor: "name", sortable: true },
      { label: "Total Clients", accessor: "totalClients", sortable: true },
      { label: "Total Quotes", accessor: "totalQuotes", sortable: true },
      { label: "Total Jobs", accessor: "totalJobs", sortable: true },
      { label: "Revenue Earned", accessor: "revenueEarned", sortable: true },
      { label: "Revenue Produced", accessor: "revenueProduced", sortable: true },
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
  };
  return (
    <div className="page-container space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
          Sales Dashboard
        </h1>
        <p className="text-sm sm:text-base text-gray-500">
          Overview of your sales performance
        </p>
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
      <SalesRepHomeCards cards={cards} />
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
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
        data={sortedLeaderboardRows.map((row) => ({
          ...row,
          revenueEarned: formatCurrency(row.revenueEarned),
          revenueProduced: formatCurrency(row.revenueProduced),
        }))}
        config={{ ...leaderboardConfig, showSearch: false, filters: [] }}
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
