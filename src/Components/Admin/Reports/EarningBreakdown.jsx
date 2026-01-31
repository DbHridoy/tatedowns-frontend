import React, { useState } from "react";
import DataTable from "../../Common/DataTable";
import { useGetAllJobsQuery } from "../../../redux/api/jobApi";

function EarningBreakdown({ id }) {
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    search: "",
    sortKey: "",
    sortOrder: "asc",
    filters: {},
  });
  const { data: jobsData = [] } = useGetAllJobsQuery({id, ...params}); // Use the rep ID from params
  const jobs = jobsData.data || [];
  const totalItems = jobsData.total || 0;
  const totalEarnings = jobsData.totalEarning || 0;

  const tableConfig = {
    columns: [
      { label: "No", accessor: "No" },
      { label: "Title", accessor: "title", sortable: true },
      { label: "Status", accessor: "status" },
    ],
    // filters: [
    //   {
    //     label: "Role",
    //     accessor: "role",
    //     options: {
    //       "Sales rep": "sales-rep",
    //       "Production manager": "production-manager",
    //     },
    //   },
    // ],
    // actions: [
    //   {
    //     label: "View",
    //     className: "bg-blue-500 text-white p-2 rounded-lg",
    //     onClick: (item) => {
    //       setSelectedUserId(item._id);
    //       setIsViewModal(true);
    //     },
    //   },
    //   {
    //     label: "Delete",
    //     className: "bg-red-500 text-white p-2 rounded-lg",
    //     modal: true,
    //     modalTitle: "Delete User",
    //     modalMessage: (item) =>
    //       `Are you sure you want to delete ${item.fullName}?`,
    //     onConfirm: (item) => deleteUser(item._id),
    //   },
    // ],
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
    <DataTable title="Earning Breakdown" data={jobs} config={tableConfig} />
  );
}

export default EarningBreakdown;
