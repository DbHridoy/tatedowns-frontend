import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllJobsQuery } from "../../../redux/api/jobApi";
import DataTable from "../../../Components/Common/DataTable";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../redux/slice/authSlice";
import formatCurrency from "../../../utils/formatCurrency";

function PmJobs() {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);

  const me = useSelector(selectCurrentUser);

  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    search: "",
    sortKey: "",
    sortOrder: "asc",
    filters: { productionManagerId: "", status: "" },
  });

  useEffect(() => {
    if (!me?._id) return;
    setParams((p) => ({
      ...p,
      filters: { ...p.filters, productionManagerId: me._id },
    }));
  }, [me?._id]);

  const sortValue = params.sortKey
    ? `${params.sortOrder === "desc" ? "-" : ""}${params.sortKey}`
    : "";
  // ✅ Hook at top level
  const { data, isLoading } = useGetAllJobsQuery({
    ...params,
    sort: sortValue,
  });

  const jobs = data?.data || [];
  const totalItems = data?.total || 0;

  // ✅ Safe formatting
  const formattedJobs = jobs.map((j) => ({
    _id: j._id,
    clientName: j.clientId?.clientName ?? "N/A",
    jobTitle: j.title,
    estimatedPrice: j.price,
    jobStatus: j.status,
    startDate: new Date(j.startDate).toLocaleDateString(),
  }));

  const tableConfig = {
    columns: [
      { label: "No", accessor: "No" },
      { label: "Client Name", accessor: "clientName", sortable: true },
      { label: "Job Title", accessor: "jobTitle" },
      { label: "Estimated Price", accessor: "estimatedPrice", format: formatCurrency },
      { label: "Job Status", accessor: "jobStatus" },
      { label: "Start Date", accessor: "startDate" },
    ],
    filters: [
      {
        label: "Status",
        accessor: "status",
        value: params.filters.status || "",
        options: {
          "Downpayment Pending": "Downpayment Pending",
          "DC Pending": "DC Pending",
          "DC Awaiting Approval": "DC Awaiting Approval",
          "Ready to Schedule": "Ready to Schedule",
          "Scheduled and Open": "Scheduled and Open",
          "Pending Close": "Pending Close",
          Closed: "Closed",
          Cancelled: "Cancelled",
        },
      },
    ],
    actions: [
      {
        label: "View",
        className: "bg-blue-500 text-white p-2 rounded-lg",
        onClick: (item) => {
          //console.log(item);
          navigate(`/production-manager/my-jobs/${item._id}`);
        },
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
    <div className="page-container space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
          Jobs
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Manage your jobs and track progress
        </p>
      {/* <button
          className="bg-primarycolor text-white flex items-center gap-2 px-4 py-2 rounded"
          onClick={() => setShowAddModal(true)}
        >
          <FiUserPlus />
          Add Job
        </button> */}
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

export default PmJobs;
