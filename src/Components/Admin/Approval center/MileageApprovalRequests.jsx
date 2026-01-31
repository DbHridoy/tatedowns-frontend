import React, { useState } from "react";
import DataTable from "../../Common/DataTable";
import {
  useGetAllMileageLogsQuery,
  useUpdateMileageLogStatusMutation,
} from "../../../redux/api/expenseApi";

function MileageApprovalRequests() {
  const [changeMileageLogStatus] = useUpdateMileageLogStatusMutation();

  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    search: "",
    sortKey: "fullName",
    sortOrder: "asc",
    filters: { role: "" },
  });

  const { data: getPendingMileageLogs } = useGetAllMileageLogsQuery({
    ...params,
    filters: { ...params.filters, status: "Pending" },
  });
  //console.log(getPendingMileageLogs);
  const mileageData = getPendingMileageLogs?.data ?? [];

  const formattedMileageData = mileageData.map((m) => ({
    id: m._id,
    salesRep: m.salesRepId?.fullName ?? m.salesRepId ?? "N/A",
    requestedAmount: m.deduction,
    totalMilesDriven: m.totalMilesDriven ?? 0,
    period: m.month && m.year ? `${m.month} ${m.year}` : "N/A",
    note: m.note || "—",
    receipt: m.file ? (
      <a
        href={m.file}
        target="_blank"
        rel="noreferrer"
        className="text-blue-600 underline"
      >
        View
      </a>
    ) : (
      "—"
    ),
    status: m.status,
  }));

  const totalItems = getPendingMileageLogs?.total ?? 0;
  const tableConfig = {
    columns: [
      { label: "No", accessor: "No" },
      { label: "Sales Rep", accessor: "salesRep", sortable: true },
      { label: "Requested Amount", accessor: "requestedAmount" },
      { label: "Total Miles", accessor: "totalMilesDriven" },
      // { label: "Period", accessor: "period" },
      // { label: "Note", accessor: "note" },
      // { label: "Receipt", accessor: "receipt" },
      { label: "Status", accessor: "status" },
    ],
    actions: [
      {
        label: "Approve",
        className: "bg-green-500 text-white p-2 rounded-lg",
        modal: true,
        modalTitle: "Approve Mileage Log",
        modalMessage: (item) =>
          `Are you sure you want to approve ${item.salesRep}?`,
        onConfirm: (item) =>
          changeMileageLogStatus({ id: item.id, status: "Approved" }),
      },
      {
        label: "Reject",
        className: "bg-red-500 text-white p-2 rounded-lg",
        modal: true,
        modalTitle: "Reject Mileage Log",
        modalMessage: (item) =>
          `Are you sure you want to reject ${item.salesRep}?`,
        onConfirm: (item) => {
          //console.log(item); // logs the whole item
          changeMileageLogStatus({ id: item.id, status: "Rejected" });
        },
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
    onSortChange: (sortKey, sortOrder) =>
      setParams((p) => ({ ...p, sortKey, sortOrder })),
  };
  return (
    <DataTable
      title="Mileage Log Approvals"
      data={formattedMileageData}
      config={tableConfig}
    />
  );
}

export default MileageApprovalRequests;
