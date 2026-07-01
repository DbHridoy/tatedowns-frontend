import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import DataTable from "../../../Components/Common/DataTable";
import { useGetAllJobsQuery } from "../../../redux/api/jobApi";
import { selectCurrentUser } from "../../../redux/slice/authSlice";

const SORT_KEYS = ["clientName", "scheduledDate", "salesRepName"];

function ScheduledJobsList({ role }) {
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);
  const isProductionManager = role === "Production Manager";
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    search: "",
    sortKey: "scheduledDate",
    sortOrder: "asc",
  });

  const { data, isLoading } = useGetAllJobsQuery({
    page: 1,
    limit: 0,
    filters: {
      status: "Scheduled and Open",
      ...(isProductionManager && currentUser?._id
        ? { productionManagerId: currentUser._id }
        : {}),
    },
  });

  const normalizedJobs = useMemo(
    () =>
      (data?.data ?? []).map((job) => ({
        _id: job._id,
        clientName: job.clientId?.clientName ?? "N/A",
        scheduledDate: job.startDate ?? "",
        salesRepName:
          (typeof job.salesRepId === "object" && job.salesRepId?.fullName) ||
          job.salesRepId ||
          "N/A",
      })),
    [data?.data]
  );

  const filteredJobs = useMemo(() => {
    const searchValue = params.search.trim().toLowerCase();
    if (!searchValue) return normalizedJobs;

    return normalizedJobs.filter((job) =>
      [job.clientName, job.salesRepName].some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(searchValue)
      )
    );
  }, [normalizedJobs, params.search]);

  const sortedJobs = useMemo(() => {
    const sortKey = SORT_KEYS.includes(params.sortKey)
      ? params.sortKey
      : "scheduledDate";
    const items = [...filteredJobs];

    items.sort((a, b) => {
      const aValue = a?.[sortKey];
      const bValue = b?.[sortKey];

      if (sortKey === "scheduledDate") {
        return new Date(aValue || 0).getTime() - new Date(bValue || 0).getTime();
      }

      return String(aValue || "").localeCompare(String(bValue || ""));
    });

    return params.sortOrder === "desc" ? items.reverse() : items;
  }, [filteredJobs, params.sortKey, params.sortOrder]);

  const totalItems = sortedJobs.length;
  const pagedJobs = useMemo(() => {
    const start = (params.page - 1) * params.limit;
    return sortedJobs.slice(start, start + params.limit);
  }, [sortedJobs, params.page, params.limit]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(totalItems / params.limit));
    if (params.page > totalPages) {
      setParams((prev) => ({ ...prev, page: totalPages }));
    }
  }, [params.limit, params.page, totalItems]);

  const tableConfig = {
    columns: [
      { label: "No", accessor: "No" },
      { label: "Client Name", accessor: "clientName", sortable: true },
      {
        label: "Scheduled Date",
        accessor: "scheduledDate",
        sortable: true,
        format: (value) => (value ? new Date(value).toLocaleDateString() : "—"),
      },
      { label: "Sales Rep Name", accessor: "salesRepName", sortable: true },
    ],
    actions: [
      {
        label: "View",
        className: "bg-blue-500 text-white p-2 rounded-lg",
        onClick: (item) => {
          if (isProductionManager) {
            navigate(`/production-manager/my-jobs/${item._id}`);
            return;
          }
          navigate(`/admin/jobs/${item._id}`);
        },
      },
    ],
    totalItems,
    currentPage: params.page,
    itemsPerPage: params.limit,
    sortKey: params.sortKey,
    sortOrder: params.sortOrder,
    searchValue: params.search,
    onPageChange: (page) => setParams((prev) => ({ ...prev, page })),
    onSearch: (search) =>
      setParams((prev) => ({ ...prev, search, page: 1 })),
    onSortChange: (sortKey) =>
      setParams((prev) => {
        const isSameKey = prev.sortKey === sortKey;
        const nextOrder = isSameKey && prev.sortOrder === "asc" ? "desc" : "asc";
        return { ...prev, sortKey, sortOrder: nextOrder };
      }),
  };

  return (
    <div className="page-container space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
          Scheduled Jobs
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          {isProductionManager
            ? "View the jobs scheduled and assigned to you"
            : "View all jobs that are currently scheduled"}
        </p>
      </div>

      <DataTable
        title="Scheduled Jobs"
        data={pagedJobs}
        config={tableConfig}
        loading={isLoading}
      />
    </div>
  );
}

export default ScheduledJobsList;
