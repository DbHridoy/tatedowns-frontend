import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllJobsQuery, useDeleteJobMutation } from "../../../redux/api/jobApi";
import DataTable from "../../../Components/Common/DataTable";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../redux/slice/authSlice";

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
    filters: { productionManagerId: me._id },
  });

  // ✅ Hook at top level
  const { data, isLoading } = useGetAllJobsQuery(params);

  const jobs = data?.data || [];
  const totalItems = data?.total || 0;

  const [deleteJob] = useDeleteJobMutation();

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
      { label: "Estimated Price", accessor: "estimatedPrice" },
      { label: "Job Status", accessor: "jobStatus" },
      { label: "Start Date", accessor: "startDate" },
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
      {
        label: "Delete",
        className: "bg-red-500 text-white p-2 rounded-lg",
        modal: true,
        modalTitle: "Delete User",
        modalMessage: (item) =>
          `Are you sure you want to delete ${item.title}?`,
        onConfirm: (item) => deleteJob(item._id),
      },
    ],
    totalItems,
    currentPage: params.page,
    itemsPerPage: params.limit,
    sortKey: params.sortKey,
    sortOrder: params.sortOrder,
    onPageChange: (page) => setParams((p) => ({ ...p, page })),
    onSearch: (search) => setParams((p) => ({ ...p, search, page: 1 })),
    onSortChange: (sortKey, sortOrder) =>
      setParams((p) => ({ ...p, sortKey, sortOrder })),
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
