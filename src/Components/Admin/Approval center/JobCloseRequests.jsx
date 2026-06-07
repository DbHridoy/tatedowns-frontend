import React from "react";
import DataTable from "../../Common/DataTable";
import { useGetAllJobsQuery, useUpdateJobMutation } from "../../../redux/api/jobApi";
import { useState } from "react";
import formatCurrency from "../../../utils/formatCurrency";

function JobCloseRequests() {
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    search: "",
    sortKey: "",
    sortOrder: "asc",
    filters: { status: "Pending Close" },
  });
  const sortValue = params.sortKey
    ? `${params.sortOrder === "desc" ? "-" : ""}${params.sortKey}`
    : "";

  const [changeJobStatus] = useUpdateJobMutation();

  const { data: getPendingMileageLogs, isLoading: isGetLoading } =
    useGetAllJobsQuery({
      ...params,
      sort: sortValue,
    });
  //console.log(getPendingMileageLogs);
  const mileageData = getPendingMileageLogs?.data ?? [];

  const formattedJobCloseData = mileageData.map((m) => ({
    id: m._id,
    clientName: m.clientId?.clientName ?? "N/A",
    totalAmount: m.price ?? m.estimatedPrice ?? 0,
    status: m.status,
  }));

  const totalItems = getPendingMileageLogs?.total;
  const tableConfig = {
    columns: [
      { label: "No", accessor: "No" },
      { label: "Client Name", accessor: "clientName", sortable: true },
      { label: "Total Amount", accessor: "totalAmount", format: formatCurrency },
      { label: "Status", accessor: "status" },
    ],
    actions: [
      {
        label: "Approve",
        className: "bg-green-500 text-white p-2 rounded-lg",
        modal: true,
        modalTitle: "Approve Job Close Request",
        modalMessage: (item) =>
          `Are you sure you want to approve ${item.clientName}?`,
        onConfirm: (item) =>
          changeJobStatus({ id: item.id, data: { status: "Closed" } }),
      },
      {
        label: "Reject",
        className: "bg-red-500 text-white p-2 rounded-lg",
        modal: true,
        modalTitle: "Reject Job Close Request",
        modalMessage: (item) =>
          `Are you sure you want to reject ${item.clientName}?`,
        onConfirm: (item) =>
          changeJobStatus({ id: item.id, data: { status: "Rejected" } }),
      },
    ],
    totalItems: totalItems,
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
      title="Job Close Approvals"
      data={formattedJobCloseData}
      config={tableConfig}
    />
  );
}

export default JobCloseRequests;
