import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import DataTable from "../../../Components/Common/DataTable";
import { useDeleteJobMutation, useGetAllJobsQuery } from "../../../redux/api/jobApi";
import { useGetAllUsersQuery } from "../../../redux/api/userApi";
import formatCurrency from "../../../utils/formatCurrency";
import toast from "react-hot-toast";

const SUPPORTED_SORT_KEYS = ["clientName", "price", "status", "createdAt", "startDate"];

function JobsList({ showFilters = true, salesRepId, canDelete = false } = {}) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [params, setParams] = useState(() => {
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);
    const search = searchParams.get("search") || "";
    const rawSortKey = searchParams.get("sortKey");
    const sortOrder = searchParams.get("sortOrder") || "asc";
    const selectedSalesRepId = searchParams.get("salesRepId") || "";
    const productionManagerId = searchParams.get("productionManagerId") || "";
    const status = searchParams.get("status") || "";
    const sortKey = SUPPORTED_SORT_KEYS.includes(rawSortKey)
      ? rawSortKey
      : "createdAt";

    return {
      page: Number.isFinite(page) && page > 0 ? page : 1,
      limit: Number.isFinite(limit) && limit > 0 ? limit : 10,
      search,
      sortKey,
      sortOrder,
      filters: {
        salesRepId: selectedSalesRepId,
        productionManagerId,
        status,
      },
    };
  });

  useEffect(() => {
    const nextParams = new URLSearchParams();
    nextParams.set("page", String(params.page));
    nextParams.set("limit", String(params.limit));
    if (params.search) nextParams.set("search", params.search);
    if (params.sortKey) nextParams.set("sortKey", params.sortKey);
    if (params.sortOrder) nextParams.set("sortOrder", params.sortOrder);
    if (params.filters?.salesRepId) {
      nextParams.set("salesRepId", params.filters.salesRepId);
    }
    if (params.filters?.productionManagerId) {
      nextParams.set("productionManagerId", params.filters.productionManagerId);
    }
    if (params.filters?.status) {
      nextParams.set("status", params.filters.status);
    }
    setSearchParams(nextParams, { replace: true });
  }, [params, setSearchParams]);

  const { data, isLoading } = useGetAllJobsQuery({
    page: 1,
    limit: 0,
    filters: {
      ...params.filters,
      ...(salesRepId ? { salesRepId } : {}),
    },
  });
  const [deleteJob] = useDeleteJobMutation();
  const { data: salesRepsData } = useGetAllUsersQuery({
    page: 1,
    limit: 0,
    filters: { role: "Sales Rep" },
  });
  const { data: productionManagersData } = useGetAllUsersQuery({
    page: 1,
    limit: 0,
    filters: { role: "Production Manager" },
  });

  const salesReps = salesRepsData?.data ?? [];
  const productionManagers = productionManagersData?.data ?? [];
  const normalizedJobs = useMemo(
    () =>
      (data?.data ?? []).map((job) => ({
        _id: job._id,
        clientName: job.clientId?.clientName ?? "N/A",
        price: Number(job.price ?? job.estimatedPrice ?? 0),
        status: job.status ?? "",
        createdAt: job.createdAt,
        startDate: job.startDate ?? job.estimatedStartDate,
      })),
    [data?.data]
  );

  const filteredJobs = useMemo(() => {
    const searchValue = params.search.trim().toLowerCase();

    return normalizedJobs.filter((job) => {
      if (!searchValue) return true;

      return [job.clientName, job.status, String(job.price)].some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(searchValue)
      );
    });
  }, [normalizedJobs, params.search]);

  const sortedJobs = useMemo(() => {
    const sortKey = SUPPORTED_SORT_KEYS.includes(params.sortKey)
      ? params.sortKey
      : "createdAt";
    const items = [...filteredJobs];

    items.sort((a, b) => {
      const aValue = a?.[sortKey];
      const bValue = b?.[sortKey];

      if (sortKey === "createdAt" || sortKey === "startDate") {
        return new Date(aValue || 0).getTime() - new Date(bValue || 0).getTime();
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return aValue - bValue;
      }

      return String(aValue || "").localeCompare(String(bValue || ""));
    });

    return params.sortOrder === "desc" ? items.reverse() : items;
  }, [filteredJobs, params.sortKey, params.sortOrder]);

  const totalItems = sortedJobs.length;
  const formattedJobs = useMemo(() => {
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
      { label: "Price", accessor: "price", sortable: true, format: formatCurrency },
      { label: "Status", accessor: "status", sortable: true },
      {
        label: "Creation Date",
        accessor: "createdAt",
        sortable: true,
        format: (value) => (value ? new Date(value).toLocaleDateString() : "—"),
      },
      {
        label: "Start Date",
        accessor: "startDate",
        sortable: true,
        format: (value) => (value ? new Date(value).toLocaleDateString() : "—"),
      },
    ],
    actions: [
      {
        label: "View",
        className: "bg-blue-500 text-white p-2 rounded-lg",
        onClick: (item) => {
          navigate(`${item._id}`);
        },
      },
      ...(canDelete
        ? [
            {
              label: "Delete",
              className: "bg-red-500 text-white p-2 rounded-lg",
              modal: true,
              modalTitle: "Delete Job",
              modalMessage: (item) =>
                `Are you sure you want to delete the job for ${item.clientName}?`,
              onConfirm: async (item) => {
                await deleteJob(item._id).unwrap();
                toast.success("Job deleted successfully");
              },
            },
          ]
        : []),
    ],
    filters: showFilters
      ? [
          ...(!salesRepId
            ? [
                {
                  label: "Sales Rep",
                  accessor: "salesRepId",
                  value: params.filters.salesRepId || "",
                  options: salesReps.reduce((acc, rep) => {
                    acc[rep.fullName || rep.email || rep._id] = rep._id;
                    return acc;
                  }, {}),
                },
              ]
            : []),
          {
            label: "Production Manager",
            accessor: "productionManagerId",
            value: params.filters.productionManagerId || "",
            options: productionManagers.reduce((acc, pm) => {
              acc[pm.fullName || pm.email || pm._id] = pm._id;
              return acc;
            }, {}),
          },
          {
            label: "Status",
            accessor: "status",
            value: params.filters.status || "",
            options: {
              "Downpayment Pending": "Downpayment Pending",
              "DC Pending": "DC Pending",
              // "DC Awaiting Approval": "DC Awaiting Approval",
              "Ready to Schedule": "Ready to Schedule",
              "Scheduled and Open": "Scheduled and Open",
              "Pending Close": "Pending Close",
              "Closed": "Closed",
              "Cancelled": "Cancelled",
            },
          },
        ]
      : [],
    totalItems,
    currentPage: params.page,
    itemsPerPage: params.limit,
    sortKey: params.sortKey,
    sortOrder: params.sortOrder,
    searchValue: params.search,
    onPageChange: (page) => setParams((p) => ({ ...p, page })),
    onSearch: (search) => setParams((p) => ({ ...p, search, page: 1 })),
    onFilterChange: (key, value) =>
      setParams((p) => ({
        ...p,
        page: 1,
        filters: { ...p.filters, [key]: value },
      })),
    onSortChange: (sortKey) =>
      setParams((p) => {
        const isSameKey = p.sortKey === sortKey;
        const nextOrder = isSameKey && p.sortOrder === "asc" ? "desc" : "asc";
        return { ...p, sortKey, sortOrder: nextOrder };
      }),
  };

  return (
    <div className="page-container space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
          Jobs
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Manage your jobs and track progress
        </p>
      </div>

      <DataTable
        title="Jobs"
        data={formattedJobs}
        config={tableConfig}
        loading={isLoading}
      />
    </div>
  );
}

export default JobsList;
