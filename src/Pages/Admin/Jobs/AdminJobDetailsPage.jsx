import SharedNotes from "../../../Components/Sales-rep/Jobs/SharedNotes";
import JobDetailsOverview from "../../../Components/Common/JobDetailsOverview";
import DC from "../../../Components/Sales-rep/Jobs/DC";
import { useEffect, useMemo, useState } from "react";
import {
  useGetJobByIdQuery,
  useUpdateJobMutation,
} from "../../../redux/api/jobApi";
import { useGetAllUsersQuery } from "../../../redux/api/userApi";
import { useParams } from "react-router-dom";
import DesignConsultationCreate from "../../Sales-rep/Jobs/DesignConsultation";

const formatDateInput = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

const statusOptions = [
  "Ready to Schedule",
  "Scheduled and Open",
  "Scheduled",
  "Pending Close",
  "Closed",
  "Cancelled",
];

const AdminJobDetailsPage = () => {
  const { jobId } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [showDcForm, setShowDcForm] = useState(false);
  const [formJob, setFormJob] = useState({
    title: "",
    status: "",
    startDate: "",
    estimatedStartDate: "",
    price: 0,
    downPayment: 0,
    downPaymentStatus: "",
    budgetSpent: 0,
    totalHours: 0,
    setupCleanup: 0,
    powerwash: 0,
    laborHours: 0,
  });
  const [assignedSalesRepId, setAssignedSalesRepId] = useState("");
  const [assignedProductionManagerId, setAssignedProductionManagerId] =
    useState("");
  const [isEditingAssignment, setIsEditingAssignment] = useState(false);

  const { data, isLoading, isError } = useGetJobByIdQuery(jobId, { skip: !jobId });
  const [updateJob, { isLoading: isSaving }] = useUpdateJobMutation();
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

  const job = data?.data;
  const salesReps = salesRepsData?.data ?? [];
  const productionManagers = productionManagersData?.data ?? [];
  const designConsultation = useMemo(() => {
    if (!job?.designConsultation?.length) return null;
    return job.designConsultation[job.designConsultation.length - 1];
  }, [job?.designConsultation]);

  useEffect(() => {
    if (!job) return;
    setFormJob({
      title: job.title ?? "",
      status: job.status ?? "",
      startDate: formatDateInput(job.startDate),
      estimatedStartDate: formatDateInput(job.estimatedStartDate),
      price: job.price ?? 0,
      downPayment: job.downPayment ?? 0,
      downPaymentStatus: job.downPaymentStatus ?? "",
      budgetSpent: job.budgetSpent ?? 0,
      totalHours: job.totalHours ?? 0,
      setupCleanup: job.setupCleanup ?? 0,
      powerwash: job.powerwash ?? 0,
      laborHours: job.laborHours ?? 0,
    });
    setAssignedSalesRepId(
      typeof job.salesRepId === "string"
        ? job.salesRepId
        : job.salesRepId?._id || ""
    );
    setAssignedProductionManagerId(
      typeof job.productionManagerId === "string"
        ? job.productionManagerId
        : job.productionManagerId?._id || ""
    );
    setIsEditingAssignment(false);
  }, [job]);

  if (isLoading) return <p className="p-6">Loading job details...</p>;
  if (isError || !job) return <p className="p-6 text-red-500">Job not found</p>;

  const handleCancel = () => {
    setFormJob({
      title: job.title ?? "",
      status: job.status ?? "",
      startDate: formatDateInput(job.startDate),
      estimatedStartDate: formatDateInput(job.estimatedStartDate),
      price: job.price ?? 0,
      downPayment: job.downPayment ?? 0,
      downPaymentStatus: job.downPaymentStatus ?? "",
      budgetSpent: job.budgetSpent ?? 0,
      totalHours: job.totalHours ?? 0,
      setupCleanup: job.setupCleanup ?? 0,
      powerwash: job.powerwash ?? 0,
      laborHours: job.laborHours ?? 0,
    });
    setIsEditing(false);
  };

  const handleAssignmentSave = async () => {
    if (!jobId) return;
    const currentSalesRepId =
      typeof job.salesRepId === "string"
        ? job.salesRepId
        : job.salesRepId?._id || "";
    const currentProductionManagerId =
      typeof job.productionManagerId === "string"
        ? job.productionManagerId
        : job.productionManagerId?._id || "";
    const updates = {};

    if (
      assignedSalesRepId &&
      assignedSalesRepId !== currentSalesRepId
    ) {
      updates.salesRepId = assignedSalesRepId;
    }
    if (
      assignedProductionManagerId &&
      assignedProductionManagerId !== currentProductionManagerId
    ) {
      updates.productionManagerId = assignedProductionManagerId;
    }

    if (Object.keys(updates).length === 0) {
      setIsEditingAssignment(false);
      return;
    }

    await updateJob({
      id: jobId,
      data: updates,
    }).unwrap();
    setIsEditingAssignment(false);
  };

  const handleSave = async () => {
    if (!jobId) return;
    await updateJob({
      id: jobId,
      data: {
        clientId: job.clientId,
        quoteId: job.quoteId,
        salesRepId: assignedSalesRepId || job.salesRepId,
        productionManagerId:
          assignedProductionManagerId || job.productionManagerId,
        title: formJob.title,
        status: formJob.status,
        startDate: formJob.startDate ? new Date(formJob.startDate) : undefined,
        estimatedStartDate: formJob.estimatedStartDate
          ? new Date(formJob.estimatedStartDate)
          : undefined,
        price: Number(formJob.price) || 0,
        downPayment: Number(formJob.downPayment) || 0,
        budgetSpent: Number(formJob.budgetSpent) || 0,
        totalHours: Number(formJob.totalHours) || 0,
        setupCleanup: Number(formJob.setupCleanup) || 0,
        powerwash: Number(formJob.powerwash) || 0,
        laborHours: Number(formJob.laborHours) || 0,
      },
    }).unwrap();
    setIsEditing(false);
  };

  return (
    <div className="page-container space-y-6">
      {/* Edit/Save Buttons */}
      <div className="flex flex-col sm:flex-row sm:justify-end gap-2">
        {isEditing ? (
          <>
            <button
              onClick={handleCancel}
              className="bg-red-500 text-white px-4 py-2 rounded-md text-sm sm:text-base disabled:opacity-60"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-4 py-2 rounded-md text-sm sm:text-base disabled:opacity-60"
              disabled={isSaving}
            >
              Save
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm sm:text-base"
          >
            Edit
          </button>
        )}
      </div>
      {/* Job Header */}
      {/* <JobDetailsHeader job={job} isEditing={isEditing} /> */}

      <JobDetailsOverview
        job={job}
        formJob={formJob}
        isEditing={isEditing}
        statusOptions={[...new Set([formJob.status, ...statusOptions])].filter(
          Boolean
        )}
        onFieldChange={(field, value) =>
          setFormJob((prev) => ({ ...prev, [field]: value }))
        }
        showEstimatedStartDate
        showDownPaymentStatus
        showProductionManager
        readOnlyFields={[
          { label: "Estimated Gallons", value: job.estimatedGallons },
        ]}
      />

      <div className="section-pad bg-white shadow-md rounded-md border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            Assignment
          </h2>
          {isEditingAssignment ? (
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => {
                  setAssignedSalesRepId(
                    typeof job.salesRepId === "string"
                      ? job.salesRepId
                      : job.salesRepId?._id || ""
                  );
                  setAssignedProductionManagerId(
                    typeof job.productionManagerId === "string"
                      ? job.productionManagerId
                      : job.productionManagerId?._id || ""
                  );
                  setIsEditingAssignment(false);
                }}
                className="w-full sm:w-auto border px-4 py-2 rounded-md text-sm sm:text-base disabled:opacity-60"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                onClick={handleAssignmentSave}
                className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-md text-sm sm:text-base disabled:opacity-60"
                disabled={isSaving}
              >
                Save Assignment
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditingAssignment(true)}
              className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-md text-sm sm:text-base"
            >
              Edit Assignment
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Sales Rep
            </label>
            <select
              className="w-full rounded-md border px-3 py-2 text-sm sm:text-base"
              value={assignedSalesRepId}
              onChange={(e) => setAssignedSalesRepId(e.target.value)}
              disabled={!isEditingAssignment}
            >
              <option value="">Select Sales Rep</option>
              {salesReps.map((rep) => (
                <option key={rep._id} value={rep._id}>
                  {rep.fullName}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Production Manager
            </label>
            <select
              className="w-full rounded-md border px-3 py-2 text-sm sm:text-base"
              value={assignedProductionManagerId}
              onChange={(e) => setAssignedProductionManagerId(e.target.value)}
              disabled={!isEditingAssignment}
            >
              <option value="">Select Production Manager</option>
              {productionManagers.map((pm) => (
                <option key={pm._id} value={pm._id}>
                  {pm.fullName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <DC
        jobId={jobId}
        actionLabel={designConsultation ? "Edit DC" : "Add DC"}
        onAction={() => setShowDcForm((prev) => !prev)}
      />

      {showDcForm && (
        <DesignConsultationCreate
          jobId={jobId}
          initialData={designConsultation}
          mode={designConsultation ? "edit" : "create"}
          onCancel={() => setShowDcForm(false)}
          onSaved={() => setShowDcForm(false)}
        />
      )}

      {/* Notes Section */}
      <SharedNotes notes={job.notes} />
    </div>
  );
};

export default AdminJobDetailsPage;
