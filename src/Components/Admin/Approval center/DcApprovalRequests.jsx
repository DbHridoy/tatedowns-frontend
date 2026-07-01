import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "../../Common/DataTable";
import { useGetAllJobsQuery, useUpdateJobMutation } from "../../../redux/api/jobApi";
import formatCurrency from "../../../utils/formatCurrency";

function DcApprovalRequests() {
  const navigate = useNavigate();
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    search: "",
    sortKey: "",
    sortOrder: "asc",
    filters: { status: "DC Awaiting Approval" },
  });

  const [updateJob] = useUpdateJobMutation();
  const sortValue = params.sortKey
    ? `${params.sortOrder === "desc" ? "-" : ""}${params.sortKey}`
    : "";
  const { data: jobsData } = useGetAllJobsQuery({
    ...params,
    sort: sortValue,
  });
  const jobs = jobsData?.data ?? [];
  const totalItems = jobsData?.total;

  const formattedJobs = jobs.map((job) => ({
    id: job._id,
    clientName: job.clientId?.clientName ?? "N/A",
    totalAmount: job.price ?? job.estimatedPrice ?? 0,
    status: job.status,
  }));

  const tableConfig = {
    columns: [
      { label: "No", accessor: "No" },
      { label: "Client Name", accessor: "clientName", sortable: true },
      { label: "Total Amount", accessor: "totalAmount", format: formatCurrency },
      { label: "Status", accessor: "status" },
    ],
    actions: [
      {
        label: "View",
        className: "bg-blue-500 text-white p-2 rounded-lg",
        onClick: (item) => {
          navigate(`/admin/jobs/${item.id}`);
        },
      },
      {
        label: "Approve",
        className: "bg-green-500 text-white p-2 rounded-lg",
        modal: true,
        modalTitle: "Approve DC Request",
        modalMessage: (item) =>
          `Are you sure you want to approve DC for ${item.clientName}?`,
        onConfirm: (item) =>
          updateJob({ id: item.id, data: { status: "Ready to Schedule" } }),
      },
      {
        label: "Reject",
        className: "bg-red-500 text-white p-2 rounded-lg",
        modal: true,
        modalTitle: "Reject DC Request",
        modalMessage: (item) =>
          `Are you sure you want to reject DC for ${item.clientName}?`,
        onConfirm: (item) =>
          updateJob({ id: item.id, data: { dcStatus: "Rejected" } }),
      },
    ],
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
    <DataTable
      title="DC Approvals"
      data={formattedJobs}
      config={tableConfig}
    />
  );
}

export default DcApprovalRequests;
