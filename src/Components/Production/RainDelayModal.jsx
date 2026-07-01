import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ProductionModal from "./ProductionModal";

const RainDelayModal = ({ isOpen, item, isSubmitting, onClose, onSubmit }) => {
  const [delayDays, setDelayDays] = useState(1);
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setDelayDays(1);
    setReason("");
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!item?._id) return;
    if (!delayDays || Number(delayDays) < 1) {
      toast.error("Enter at least one delay day.");
      return;
    }

    await onSubmit?.({
      scheduleId: item._id,
      delayDays: Number(delayDays),
      affectedFromDate: item?.affectedFromDate,
      reason,
    });
  };

  return (
    <ProductionModal
      isOpen={isOpen}
      onClose={onClose}
      title="Apply Rain Delay"
      description="This can push the remaining schedule and later jobs for the same crew forward."
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
            className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600 disabled:opacity-60"
          >
            {isSubmitting ? "Applying..." : "Confirm Delay"}
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          <p className="font-medium">{item?.title || "Selected schedule item"}</p>
          <p className="mt-1 text-amber-800">{item?.crewName || "Crew pending"}</p>
          {item?.affectedFromDate ? (
            <p className="mt-1 text-amber-800">
              Shift work from {new Date(item.affectedFromDate).toLocaleDateString("en-US")}
            </p>
          ) : null}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Delay Days
          </label>
          <input
            type="number"
            min="1"
            value={delayDays}
            onChange={(event) => setDelayDays(event.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Reason
          </label>
          <textarea
            rows="4"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700"
            placeholder="Optional note for the delay"
          />
        </div>
      </div>
    </ProductionModal>
  );
};

export default RainDelayModal;
