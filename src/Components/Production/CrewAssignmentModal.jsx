import { useEffect, useState } from "react";
import ProductionModal from "./ProductionModal";

const CrewAssignmentModal = ({
  isOpen,
  crew,
  painters,
  isSubmitting,
  onClose,
  onSubmit,
}) => {
  const [selectedPainterIds, setSelectedPainterIds] = useState([]);

  useEffect(() => {
    if (!isOpen) return;
    const nextIds = (crew?.painters || []).map((painter) => painter._id || painter.id);
    setSelectedPainterIds(nextIds);
  }, [crew, isOpen]);

  return (
    <ProductionModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Manage ${crew?.name || "Crew"} Painters`}
      description="Assign or remove painters from this crew."
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
            onClick={() => onSubmit?.(selectedPainterIds)}
            disabled={isSubmitting}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {isSubmitting ? "Saving..." : "Save Assignment"}
          </button>
        </div>
      }
    >
      <div className="space-y-3">
        {painters.length ? (
          painters.map((painter) => {
            const checked = selectedPainterIds.includes(painter._id);

            return (
              <label
                key={painter._id}
                className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    {painter.fullName}
                  </p>
                  <p className="text-xs text-slate-500">
                    {painter.email || "No email on file"}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(event) => {
                    const isChecked = event.target.checked;
                    setSelectedPainterIds((current) =>
                      isChecked
                        ? [...current, painter._id]
                        : current.filter((id) => id !== painter._id)
                    );
                  }}
                  className="h-4 w-4"
                />
              </label>
            );
          })
        ) : (
          <p className="text-sm text-gray-500">
            No painters are available to assign yet.
          </p>
        )}
      </div>
    </ProductionModal>
  );
};

export default CrewAssignmentModal;

