import { useEffect, useState } from "react";
import ProductionModal from "./ProductionModal";

const ACTION_LABELS = {
  changeStartDate: "Change Start Date",
  changeCrew: "Change Assigned Crew",
  addExtraDays: "Add Extra Day(s)",
  returnToReady: "Return to Ready to Schedule",
  cancelJob: "Cancel Job",
  markPendingClose: "Mark as Pending Close",
};

const ScheduleManagementModal = ({
  isOpen,
  action,
  item,
  crews = [],
  selectedDateKey = "",
  isSubmitting = false,
  onClose,
  onSubmit,
}) => {
  const [formState, setFormState] = useState({
    startDate: "",
    crewId: "",
    extraDays: 1,
    reason: "",
    closeGap: true,
    effectiveDate: "",
  });

  useEffect(() => {
    if (!isOpen || !item) {
      return;
    }

    setFormState({
      startDate: item.startDate || "",
      crewId: item.crewId || "",
      extraDays: 1,
      reason: "",
      closeGap: true,
      effectiveDate: selectedDateKey || item.endDate || item.startDate || "",
    });
  }, [isOpen, item, selectedDateKey]);

  if (!isOpen || !action || !item) {
    return null;
  }

  const handleSubmit = async () => {
    const payload = { action };

    if (action === "changeStartDate") {
      payload.startDate = formState.startDate;
    }
    if (action === "changeCrew") {
      payload.crewId = formState.crewId;
    }
    if (action === "addExtraDays") {
      payload.extraDays = Number(formState.extraDays) || 1;
      payload.reason = formState.reason.trim();
    }
    if (action === "returnToReady" || action === "cancelJob" || action === "markPendingClose") {
      payload.closeGap = Boolean(formState.closeGap);
    }
    if (action === "markPendingClose") {
      payload.effectiveDate = formState.effectiveDate;
    }

    await onSubmit?.(payload);
  };

  return (
    <ProductionModal
      isOpen={isOpen}
      onClose={onClose}
      title={ACTION_LABELS[action] || "Manage Schedule"}
      description={item.title}
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
            {isSubmitting ? "Saving..." : ACTION_LABELS[action]}
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        {action === "changeStartDate" ? (
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              New Start Date
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
            <p className="mt-2 text-xs text-slate-500">
              The schedule keeps the same estimated working days and later jobs on the same crew
              move automatically.
            </p>
          </div>
        ) : null}

        {action === "changeCrew" ? (
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Assigned Crew
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
            <p className="mt-2 text-xs text-slate-500">
              If the new crew already has a conflicting production day, the change will be blocked.
            </p>
          </div>
        ) : null}

        {action === "addExtraDays" ? (
          <>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Extra Working Days
              </label>
              <input
                type="number"
                min="1"
                value={formState.extraDays}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    extraDays: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Reason
              </label>
              <textarea
                rows="3"
                value={formState.reason}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    reason: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700"
                placeholder="Optional reason"
              />
            </div>
          </>
        ) : null}

        {action === "markPendingClose" ? (
          <>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Effective Production Date
              </label>
              <input
                type="date"
                value={formState.effectiveDate}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    effectiveDate: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700"
              />
            </div>
            <label className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={formState.closeGap}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    closeGap: event.target.checked,
                  }))
                }
                className="mt-0.5"
              />
              <span>Pull later jobs on this crew forward to fill the freed production days.</span>
            </label>
          </>
        ) : null}

        {action === "returnToReady" || action === "cancelJob" ? (
          <label className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={formState.closeGap}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  closeGap: event.target.checked,
                }))
              }
              className="mt-0.5"
            />
            <span>Pull later jobs on this crew forward to fill the freed production days.</span>
          </label>
        ) : null}
      </div>
    </ProductionModal>
  );
};

export default ScheduleManagementModal;
