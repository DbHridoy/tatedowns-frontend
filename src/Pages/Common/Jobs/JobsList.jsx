import { useNavigate } from "react-router-dom";
import { useState } from "react";
import DataTable from "../../../Components/Common/DataTable";
import { useDeleteJobMutation, useGetAllJobsQuery } from "../../../redux/api/jobApi";
import { useGetAllUsersQuery } from "../../../redux/api/userApi";

function JobsList({ showFilters = true } = {}) {
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
  const { data, isLoading } = useGetAllJobsQuery({ ...params, sort: sortValue });
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
  const [deleteJob] = useDeleteJobMutation();

  const jobs = data?.data || [];
  const totalItems = data?.total || 0;
  const salesReps = salesRepsData?.data ?? [];
  const productionManagers = productionManagersData?.data ?? [];

  const formattedJobs = jobs.map((job) => ({
    _id: job._id,
    clientName: job.clientId?.clientName ?? "N/A",
    jobTitle: job.title,
    price: job.price ?? job.estimatedPrice ?? 0,
    jobStatus: job.status,
    startDate: new Date(job.estimatedStartDate ?? job.startDate).toLocaleDateString(),
  }));

  const tableConfig = {
    columns: [
      { label: "No", accessor: "No" },
      { label: "Client Name", accessor: "clientName", sortable: true },
      { label: "Job Title", accessor: "jobTitle", sortable: true },
      { label: "Price", accessor: "price", sortable: true },
      { label: "Status", accessor: "jobStatus", sortable: true },
      { label: "Start Date", accessor: "startDate", sortable: true },
    ],
    actions: [
      {
        label: "View",
        className: "bg-blue-500 text-white p-2 rounded-lg",
        onClick: (item) => {
          navigate(`${item._id}`);
        },
      },
      {
        label: "Delete",
        className: "bg-red-500 text-white p-2 rounded-lg",
        modal: true,
        modalTitle: "Delete Job",
        modalMessage: (item) =>
          `Are you sure you want to delete ${item.jobTitle}?`,
        onConfirm: (item) => deleteJob(item._id),
      },
    ],
    filters: showFilters
      ? [
          {
            label: "Sales Rep",
            accessor: "salesRepId",
            options: salesReps.reduce((acc, rep) => {
              acc[rep.fullName || rep.email || rep._id] = rep._id;
              return acc;
            }, {}),
          },
          {
            label: "Production Manager",
            accessor: "productionManagerId",
            options: productionManagers.reduce((acc, pm) => {
              acc[pm.fullName || pm.email || pm._id] = pm._id;
              return acc;
            }, {}),
          },
          {
            label: "Status",
            accessor: "status",
            options: {
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
