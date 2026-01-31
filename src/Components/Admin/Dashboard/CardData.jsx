import {
  FiAlertCircle,
  FiBriefcase,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiFileText,
  FiUsers,
  FiXCircle,
  FiCalendar,
} from "react-icons/fi";

const formatCurrency = (value) => {
  const amount = Number(value) || 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
};

const CardData = ({ stats, isLoading, isError }) => {
  const data = [
    {
      title: "Revenue Produced",
      value: formatCurrency(stats?.totalRevenueProduced),
      icon: FiDollarSign,
    },
    {
      title: "Total Revenue",
      value: formatCurrency(stats?.totalRevenue),
      icon: FiDollarSign,
    },
    { title: "Total Clients", value: stats?.totalClients ?? 0, icon: FiUsers },
    { title: "Total Quotes", value: stats?.totalQuotes ?? 0, icon: FiFileText },
    { title: "Total Jobs", value: stats?.totalJobs ?? 0, icon: FiBriefcase },
    {
      title: "Ready to Schedule",
      value: stats?.readyToScheduleCount ?? 0,
      icon: FiClock,
    },
    {
      title: "Scheduled & Open",
      value: stats?.scheduledAndOpenCount ?? 0,
      icon: FiCalendar,
    },
    {
      title: "Pending Close",
      value: stats?.pendingCloseCount ?? 0,
      icon: FiAlertCircle,
    },
    {
      title: "Closed Jobs",
      value: stats?.closedCount ?? 0,
      icon: FiCheckCircle,
    },
    {
      title: "Cancelled Jobs",
      value: stats?.cancelledCount ?? 0,
      icon: FiXCircle,
    },
    // {
    //   title: "Revenue Earned",
    //   value: formatCurrency(stats?.totalRevenueSold),
    // },
    // {
    //   title: "Revenue Pending",
    //   value: formatCurrency(stats?.totalRevenuePending),
    // },

  ];

  return (
    <div className="p-0">
      {/* Filter Bar */}
      {/* <div className="flex items-center gap-4 mb-6">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-lg font-medium border transition-colors ${
              activeFilter === filter
                ? ' text-black border-blue-500'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-100'
            }`}
          >
            {filter}
          </button>
        ))}
      </div> */}

      {/* Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isError && (
          <div className="col-span-full rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            Failed to load stats.
          </div>
        )}
        {data.map((item, index) => (
          <div
            key={index}
            className={`flex justify-between rounded-lg section-pad shadow-md ${index === 0 ? "bg-[#B0D6F0]" : "bg-white"
              }`}
          >
            <div>
              <div className="w-12 h-12 sm:w-[52px] sm:h-[52px] flex items-center justify-center bg-blue-100 rounded-lg mb-4">
                {item.icon ? (
                  <item.icon className="w-6 h-6 text-blue-600" />
                ) : null}
              </div>
              <div className="text-sm text-gray-500">{item.title}</div>
              <div className="mt-2 text-lg sm:text-xl font-bold">
                {isLoading ? "..." : item.value}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardData;
