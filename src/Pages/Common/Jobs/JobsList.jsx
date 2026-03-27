import { useNavigate } from "react-router-dom";
import { useState } from "react";
import DataTable from "../../../Components/Common/DataTable";
import { useDeleteJobMutation, useGetAllJobsQuery } from "../../../redux/api/jobApi";
import { useGetAllUsersQuery } from "../../../redux/api/userApi";
import formatCurrency from "../../../utils/formatCurrency";
import toast from "react-hot-toast";

function JobsList({ showFilters = true, salesRepId, canDelete = false } = {}) {
  const navigate = useNavigate();
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    search: "",
    sortKey: "",
    sortOrder: "asc",
    filters: {
      salesRepId: "",
      productionManagerId: "",
      status: "",
    },
  });

  const sortValue = params.sortKey
    ? `${params.sortOrder === "desc" ? "-" : ""}${params.sortKey}`
    : "";
  const { data, isLoading } = useGetAllJobsQuery({
    ...params,
    sort: sortValue,
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

  const jobs = data?.data || [];
  const totalItems = data?.total || 0;
  const salesReps = salesRepsData?.data ?? [];
  const productionManagers = productionManagersData?.data ?? [];

  const formattedJobs = jobs.map((job) => ({
    _id: job._id,
    clientName: job.clientId?.clientName ?? "N/A",
    price: job.price ?? job.estimatedPrice ?? 0,
    status: job.status,
    createdAt: job.createdAt,
    // Keep display order consistent with backend sort fallback:
    // backend sorts by startDate, then falls back to estimatedStartDate.
    startDate: job.startDate ?? job.estimatedStartDate,
  }));

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
