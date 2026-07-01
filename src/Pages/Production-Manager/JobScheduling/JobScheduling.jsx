import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import DataTable from "../../../Components/Common/DataTable";
import ScheduleJobModal from "../../../Components/Production/ScheduleJobModal";
import {
  useGetAllJobsQuery,
} from "../../../redux/api/jobApi";
import { selectCurrentUser } from "../../../redux/slice/authSlice";
import formatCurrency from "../../../utils/formatCurrency";
import {
  useCreateScheduleItemMutation,
  useGetAvailableJobsForSchedulingQuery,
  useGetCrewsQuery,
} from "../../../redux/api/productionApi";
import { normalizeCrew } from "../../../utils/productionCalendar";
import toast from "react-hot-toast";

const STATUS_OPTIONS = {
  "Ready to Schedule": "Ready to Schedule",
  "Scheduled and Open": "Scheduled and Open",
  "Pending Close": "Pending Close",
  Closed: "Closed",
  Cancelled: "Cancelled",
};

const MY_JOBS_STATUS_OPTIONS = {
  "Scheduled and Open": "Scheduled and Open",
  "Pending Close": "Pending Close",
  Closed: "Closed",
  Cancelled: "Cancelled",
};

const formatOptionalDate = (value) => {
  if (!value) return "—";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? "—" : parsed.toLocaleDateString();
};

const formatJobAddress = (job) =>
  job?.jobSiteLocation ||
  [
    job?.clientId?.address,
    job?.clientId?.city,
    job?.clientId?.state,
    job?.clientId?.zipCode,
  ]
    .filter(Boolean)
    .join(", ");

function JobScheduling() {
  const navigate = useNavigate();
  const me = useSelector(selectCurrentUser);
  const [viewMode, setViewMode] = useState("available");
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

  const activeFilters = useMemo(() => {
    const baseFilters = { ...params.filters };

    if (viewMode === "myJobs") {
      return {
        ...baseFilters,
        productionManagerId: me?._id || "",
      };
    }

    return {
      ...baseFilters,
      productionManagerId: "",
    };
  }, [me?._id, params.filters, viewMode]);

  const { data, isLoading } = useGetAllJobsQuery({
    ...params,
    filters: activeFilters,
    sort: sortValue,
  });
  const { data: crewsData, isLoading: isCrewsLoading } = useGetCrewsQuery();
  const { data: availableJobsData, isLoading: isAvailableJobsLoading } =
    useGetAvailableJobsForSchedulingQuery();
  const [createScheduleItem, { isLoading: isCreatingSchedule }] =
    useCreateScheduleItemMutation();

  const jobs = useMemo(() => {
    const rawJobs = data?.data || [];

    if (viewMode === "available") {
      return rawJobs.filter((job) => job.status !== "DC Pending");
    }

    return rawJobs;
  }, [data?.data, viewMode]);

  const totalItems = data?.total || 0;
  const crews = useMemo(
    () => (crewsData?.data || []).map(normalizeCrew),
    [crewsData?.data]
  );
  const availableJobs = availableJobsData?.data || [];

  const formattedJobs = jobs.map((job) => ({
    _id: job._id,
    clientName: job.clientId?.clientName ?? "N/A",
    title: job.title || job.jobTitle || "Untitled Job",
    jobTitle: job.title || "Untitled Job",
    estimatedPrice: job.price,
    jobStatus: job.status,
    estimatedStartDate: formatOptionalDate(job.estimatedStartDate),
    startDate: formatOptionalDate(job.startDate),
    location: formatJobAddress(job),
  }));

  const openScheduleModal = (item) => {
    setSelectedJob(item);
  };

  const closeScheduleModal = () => {
    setSelectedJob(null);
  };

  const handleConfirmSchedule = async (payload) => {
    try {
      await createScheduleItem(payload).unwrap();

      closeScheduleModal();
      setViewMode("myJobs");
      setParams((current) => ({
        ...current,
        page: 1,
        filters: {
          ...current.filters,
          status: "Scheduled and Open",
        },
      }));
      toast.success("Job scheduled successfully.");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to schedule job.");
    }
  };

  const tableConfig = {
    columns: [
      { label: "No", accessor: "No" },
      { label: "Client Name", accessor: "clientName", sortable: true },
      { label: "Job Title", accessor: "jobTitle", sortable: true },
      {
        label: "Estimated Price",
        accessor: "estimatedPrice",
        format: formatCurrency,
      },
      { label: "Job Status", accessor: "jobStatus" },
      {
        label: viewMode === "myJobs" ? "Start Date" : "Estimated Start Date",
        accessor: viewMode === "myJobs" ? "startDate" : "estimatedStartDate",
      },
    ],
    filters: [
      {
        label: "Status",
        accessor: "status",
        value: params.filters.status || "",
        options:
          viewMode === "myJobs" ? MY_JOBS_STATUS_OPTIONS : STATUS_OPTIONS,
      },
    ],
    actions: [
      {
        label: "View",
        className: "bg-blue-500 text-white p-2 rounded-lg",
        onClick: (item) => {
          navigate(`/production-manager/jobs/${item._id}`, {
            state: { jobsViewMode: viewMode },
          });
        },
      },
      ...(viewMode === "available"
        ? [
            {
              label: "Mark as scheduled",
              className: "bg-red-500 text-white p-2 rounded-lg",
              hidden: (item) => item.jobStatus !== "Ready to Schedule",
              onClick: (item) => openScheduleModal(item),
            },
          ]
        : []),
    ],
    totalItems,
    currentPage: params.page,
    itemsPerPage: params.limit,
    sortKey: params.sortKey,
    sortOrder: params.sortOrder,
    searchValue: params.search,
    onPageChange: (page) => setParams((current) => ({ ...current, page })),
    onSearch: (search) =>
      setParams((current) => ({ ...current, search, page: 1 })),
    onFilterChange: (key, value) =>
      setParams((current) => ({
        ...current,
        page: 1,
        filters: { ...current.filters, [key]: value },
      })),
    onSortChange: (sortKey) =>
      setParams((current) => {
        const isSameKey = current.sortKey === sortKey;
        const nextOrder =
          isSameKey && current.sortOrder === "asc" ? "desc" : "asc";
        return { ...current, sortKey, sortOrder: nextOrder };
      }),
  };

  return (
    <div className="page-container space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
            Jobs
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            {viewMode === "myJobs"
              ? "View all jobs currently assigned to you"
              : "Manage scheduling-ready jobs and assign production start dates"}
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          {viewMode === "myJobs" ? (
            <button
              type="button"
              onClick={() => {
                setViewMode("available");
                setParams((current) => ({
                  ...current,
                  page: 1,
                  filters: {
                    ...current.filters,
                    status: "Ready to Schedule",
                  },
                }));
              }}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Back to Scheduling
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => {
              setViewMode("myJobs");
              setParams((current) => ({
                ...current,
                page: 1,
                filters: {
                  ...current.filters,
                  status: "Scheduled and Open",
                },
              }));
            }}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            My Jobs
          </button>
        </div>
      </div>

      <DataTable
        title={viewMode === "myJobs" ? "My Jobs" : "Jobs"}
        data={formattedJobs}
        config={tableConfig}
        loading={isLoading || isCrewsLoading}
      />

      <ScheduleJobModal
        isOpen={Boolean(selectedJob)}
        selectedDate={new Date().toISOString().slice(0, 10)}
        selectedCrewId=""
        selectedJobId={selectedJob?._id || ""}
        presetJob={selectedJob}
        lockJobSelection
        crews={crews}
        jobs={availableJobs}
        isLoadingJobs={isAvailableJobsLoading}
        isSubmitting={isCreatingSchedule}
        onClose={closeScheduleModal}
        onSubmit={handleConfirmSchedule}
      />
    </div>
  );
}

export default JobScheduling;
