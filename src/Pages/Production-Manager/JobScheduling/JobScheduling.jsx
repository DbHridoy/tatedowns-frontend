import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  useUpdateJobMutation,
  useGetAllJobsQuery,
} from "../../../redux/api/jobApi";
import DataTable from "../../../Components/Common/DataTable";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../redux/slice/authSlice";
import formatCurrency from "../../../utils/formatCurrency";

function JobScheduling() {
  const navigate = useNavigate();
  const me = useSelector(selectCurrentUser)
  console.log("line:14-me", me)
  const [updateJob] = useUpdateJobMutation();
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    search: "",
    sortKey: "",
    sortOrder: "asc",
    filters: { status: "Ready to Schedule" },
  });

  const sortValue = params.sortKey
    ? `${params.sortOrder === "desc" ? "-" : ""}${params.sortKey}`
    : "";
  // ✅ Hook at top level
  const { data, isLoading } = useGetAllJobsQuery({
    ...params,
    sort: sortValue,
  });

  const jobs = (data?.data || []).filter((j) => j.status !== "DC Pending");
  const totalItems = data?.total || 0;

  // ✅ Safe formatting
  const formattedJobs = jobs.map((j) => ({
    _id: j._id,
    clientName: j.clientId?.clientName ?? "N/A",
    jobTitle: j.title,
    estimatedPrice: j.price,
    jobStatus: j.status,
    estimatedStartDate: new Date(j.estimatedStartDate).toLocaleDateString(),
  }));

  const openScheduleModal = (item) => {
    setSelectedJob(item);
    setScheduleDate("");
    setIsScheduleModalOpen(true);
  };

  const handleConfirmSchedule = async () => {
    if (!scheduleDate || !selectedJob) return;
console.log("line:52-me", me)
    try {
      await updateJob({
        id: selectedJob._id,
        data: {
          status: "Scheduled and Open",
          productionManagerId: me?._id,
          startDate: new Date(`${scheduleDate}T00:00:00`).toISOString(),
        },
      }).unwrap();

      setIsScheduleModalOpen(false);
      setSelectedJob(null);
      setScheduleDate("");
    } catch (err) {
      console.error(err);
    }
  };

  const tableConfig = {
    columns: [
      { label: "No", accessor: "No" },
      { label: "Client Name", accessor: "clientName", sortable: true },
      // { label: "Job Title", accessor: "jobTitle" },
      { label: "Estimated Price", accessor: "estimatedPrice", format: formatCurrency },
      { label: "Job Status", accessor: "jobStatus" },
      { label: "Estimated Start Date", accessor: "estimatedStartDate" },
    ],
    actions: [
      {
        label: "View",
        className: "bg-blue-500 text-white p-2 rounded-lg",
        onClick: (item) => {
          navigate(`/production-manager/jobs/${item._id}`);
        },
      },
      {
        label: "Mark as scheduled",
        className: "bg-red-500 text-white p-2 rounded-lg",
        onClick: (item) => openScheduleModal(item),
      },
    ],
    totalItems,
    currentPage: params.page,
    itemsPerPage: params.limit,
    sortKey: params.sortKey,
    sortOrder: params.sortOrder,
    onPageChange: (page) => setParams((p) => ({ ...p, page })),
    onSearch: (search) => setParams((p) => ({ ...p, search, page: 1 })),
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
          Job Scheduling
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
      {isScheduleModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-[92vw] sm:w-full sm:max-w-md md:max-w-lg lg:max-w-xl">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-3">
                Mark as scheduled
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4">
                Select a start date for {selectedJob?.jobTitle}.
              </p>
              <input
                type="date"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg mb-6 text-sm sm:text-base"
              />
              <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
                <button
                  onClick={() => {
                    setIsScheduleModalOpen(false);
                    setSelectedJob(null);
                    setScheduleDate("");
                  }}
                  className="w-full sm:w-auto px-4 py-2 bg-gray-100 rounded text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmSchedule}
                  disabled={!scheduleDate}
                  className="w-full sm:w-auto px-4 py-2 bg-red-500 text-white rounded text-sm sm:text-base disabled:opacity-50"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default JobScheduling;
