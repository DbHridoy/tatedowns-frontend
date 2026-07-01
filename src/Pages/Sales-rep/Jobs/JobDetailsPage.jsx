import SharedNotes from "../../../Components/Sales-rep/Jobs/SharedNotes";
import DC from "../../../Components/Sales-rep/Jobs/DC";
import JobDetailsOverview from "../../../Components/Common/JobDetailsOverview";
import { useEffect, useMemo, useState } from "react";
import {
  useGetJobByIdQuery,
  useUpdateJobMutation,
} from "../../../redux/api/jobApi";
import { useParams } from "react-router-dom";
import DesignConsultationCreate from "./DesignConsultation";
import SimpleLoader from "../../../Components/Common/SimpleLoader";

const formatDateInput = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

const statusOptions = [
  "Downpayment Pending",
  "DC Pending",
  "DC Awaiting Approval",
  "Ready to Schedule",
  "Scheduled and Open",
  "Pending Close",
  "Closed",
  "Cancelled",
];

const JobDetailsPage = () => {
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
    budgetSpent: 0,
    totalHours: 0,
    setupCleanup: 0,
    powerwash: 0,
    laborHours: 0,
  });

  const { data, isLoading, isError } = useGetJobByIdQuery(jobId, { skip: !jobId });
  const [updateJob] = useUpdateJobMutation();

  const job = data?.data;
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
      budgetSpent: job.budgetSpent ?? 0,
      totalHours: job.totalHours ?? 0,
      setupCleanup: job.setupCleanup ?? 0,
      powerwash: job.powerwash ?? 0,
      laborHours: job.laborHours ?? 0,
    });
  }, [job]);

  if (isLoading) return <SimpleLoader text="Loading job details..." />;
  if (isError || !job) return <p className="p-6 text-red-500">Job not found</p>;

  const handleCancel = () => {
    setFormJob({
      title: job.title ?? "",
      status: job.status ?? "",
      startDate: formatDateInput(job.startDate),
      estimatedStartDate: formatDateInput(job.estimatedStartDate),
      price: job.price ?? 0,
      downPayment: job.downPayment ?? 0,
      budgetSpent: job.budgetSpent ?? 0,
      totalHours: job.totalHours ?? 0,
      setupCleanup: job.setupCleanup ?? 0,
      powerwash: job.powerwash ?? 0,
      laborHours: job.laborHours ?? 0,
    });
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!jobId) return;
    await updateJob({
      id: jobId,
      data: {
        clientId: job.clientId,
        quoteId: job.quoteId,
        salesRepId: job.salesRepId,
        title: formJob.title,
        status: formJob.status,
        startDate: formJob.startDate ? new Date(formJob.startDate) : undefined,
        estimatedStartDate: formJob.estimatedStartDate ? new Date(formJob.estimatedStartDate) : undefined,
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
      <div className="flex justify-end space-x-2">

      </div>

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
        showProductionManager
        jobIdPosition="afterStatus"
        estimatedStartDatePosition="afterPrice"
        readOnlyFields={[
          { label: "Estimated Gallons", value: job.estimatedGallons },
        ]}
      />

      {/* Top Section: Client Info + Financials */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Client Info */}

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

export default JobDetailsPage;
