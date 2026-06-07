import React, { useMemo, useState } from "react";
import ReportsData from "../../../Components/Dashboard/ReportsData";
import PerRepReporting from "../../../Components/Admin/Reports/PerRepReporting";
import DataTable from "../../../Components/Common/DataTable";
import { useGetAllSalesRepQuery } from "../../../redux/api/userApi";
import { useNavigate } from "react-router-dom";

const Reports = () => {
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    search: "",
    sortKey: "fullName",
    sortOrder: "asc",
    filters: { role: "" },
  });
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();

  const { data: salesRepData, isLoading } = useGetAllSalesRepQuery();
  const salesRep = salesRepData?.data || {};

  const totalItems = salesRepData?.total || 0;

  const tableConfig = {
    columns: [
      { label: "No", accessor: "No" },
      { label: "Name", accessor: "fullName", sortable: true },
      { label: "Email", accessor: "email" },
      { label: "Cluster", accessor: "cluster" },
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

    actions: [
      {
        label: "View",
        className: "bg-blue-500 text-white p-2 rounded-lg",
        onClick: (item) => {
          handleView(item._id);
          // setIsViewModal(true);
        },
      },
      // {
      //   label: "Delete",
      //   className: "bg-red-500 text-white p-2 rounded-lg",
      //   modal: true,
      //   modalTitle: "Delete User",
      //   modalMessage: (item) =>
      //     `Are you sure you want to delete ${item.fullName}?`,
      //   onConfirm: (item) => deleteUser(item._id),
      // },
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
  const handleView = (id) => {
    navigate(`/s/admin/reports-details/${id}`);
  };
  return (
    <div className="page-container space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
          Reports
        </h1>
        <p className="text-sm sm:text-base text-gray-500">
          Sales representative performance overview
        </p>
      </div>
      <DataTable
        title="Sales Reps"
        data={salesRep}
        config={tableConfig}
        loading={isLoading}
      />
    </div>
  );
};

export default Reports;
