import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import ProductionModal from "./ProductionModal";
import { getAvailableJobOption } from "../../utils/productionCalendar";

const ScheduleJobModal = ({
  isOpen,
  selectedDate,
  selectedCrewId,
  selectedJobId,
  presetJob,
  lockJobSelection = false,
  crews,
  jobs = [],
  isLoadingJobs,
  isSubmitting,
  onClose,
  onSubmit,
}) => {
  const normalizedJobs = useMemo(() => {
    const mappedJobs = jobs.map(getAvailableJobOption).filter((job) => job._id);
    const presetJobOption = presetJob ? getAvailableJobOption(presetJob) : null;

    if (!presetJobOption?._id) {
      return mappedJobs;
    }

    const hasPresetJob = mappedJobs.some((job) => job._id === presetJobOption._id);
    return hasPresetJob ? mappedJobs : [presetJobOption, ...mappedJobs];
  }, [jobs, presetJob]);
  const [formState, setFormState] = useState({
    jobId: "",
    crewId: "",
    startDate: "",
    durationDays: 1,
    notes: "",
  });

  useEffect(() => {
    if (!isOpen) return;

    const presetJob =
      normalizedJobs.find((job) => job._id === selectedJobId) || normalizedJobs[0];
    setFormState({
      jobId: presetJob?._id || "",
      crewId: selectedCrewId || crews[0]?._id || "",
      startDate: selectedDate || new Date().toISOString().slice(0, 10),
      durationDays: presetJob?.defaultDays || 1,
      notes: "",
    });
  }, [crews, isOpen, normalizedJobs, selectedCrewId, selectedDate, selectedJobId]);

  useEffect(() => {
    if (!formState.jobId) return;
    const selectedJob = normalizedJobs.find((job) => job._id === formState.jobId);
    if (!selectedJob) return;

    setFormState((current) => ({
      ...current,
      durationDays: current.durationDays || selectedJob.defaultDays || 1,
    }));
  }, [formState.jobId, normalizedJobs]);

  const selectedJob = normalizedJobs.find((job) => job._id === formState.jobId);

  const handleSubmit = async () => {
    if (!formState.jobId || !formState.crewId || !formState.startDate) {
      toast.error("Job, crew, and start date are required.");
      return;
    }

    await onSubmit?.({
      jobId: formState.jobId,
      crewId: formState.crewId,
      startDate: formState.startDate,
      durationDays: Number(formState.durationDays) || 1,
      notes: formState.notes,
    });
  };

  return (
    <ProductionModal
      isOpen={isOpen}
      onClose={onClose}
      title="Schedule Job"
      description="Assign an available job to a crew and block out the expected production window."
      footer={
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Scheduling..." : "Schedule Job"}
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Available Job
          </label>
          <select
            value={formState.jobId}
            onChange={(event) => {
              const nextJob = normalizedJobs.find(
                (job) => job._id === event.target.value
              );
              setFormState((current) => ({
                ...current,
                jobId: event.target.value,
                durationDays: nextJob?.defaultDays || current.durationDays,
              }));
            }}
            disabled={isLoadingJobs || lockJobSelection}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700"
          >
            <option value="">Select a job</option>
            {normalizedJobs.map((job) => (
              <option key={job._id} value={job._id}>
                {job.title} {job.clientName ? `• ${job.clientName}` : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Crew
            </label>
            <select
              value={formState.crewId}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  crewId: event.target.value,
                }))
              }
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700"
            >
              <option value="">Select a crew</option>
              {crews.map((crew) => (
                <option key={crew._id} value={crew._id}>
                  {crew.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              value={formState.startDate}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  startDate: event.target.value,
                }))
              }
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Estimated Duration (Days)
            </label>
            <input
              type="number"
              min="1"
              value={formState.durationDays}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  durationDays: event.target.value,
                }))
              }
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700"
            />
            <p className="mt-1 text-xs text-gray-500">
              Defaulted from labor hours when available and can be overridden manually.
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-slate-50 p-3 text-sm text-slate-600">
            <p className="font-medium text-slate-800">Selected job details</p>
            <p className="mt-2 font-medium text-slate-800">
              {selectedJob?.title || "No job selected"}
            </p>
            <p className="mt-1">
              {selectedJob?.location || "Address unavailable"}
            </p>
            <p className="mt-1">{selectedJob?.clientName || "Client/site details unavailable"}</p>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Notes
          </label>
          <textarea
            value={formState.notes}
            onChange={(event) =>
              setFormState((current) => ({
                ...current,
                notes: event.target.value,
              }))
            }
            rows="4"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700"
            placeholder="Optional scheduling notes"
          />
        </div>
      </div>
    </ProductionModal>
  );
};

export default ScheduleJobModal;
