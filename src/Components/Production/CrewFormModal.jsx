import { useEffect, useState } from "react";
import ProductionModal from "./ProductionModal";
import { CREW_STATUS_OPTIONS } from "../../constants/production";

const CrewFormModal = ({ isOpen, crew, isSubmitting, onClose, onSubmit }) => {
  const [formState, setFormState] = useState({
    name: "",
    status: "Active",
  });

  useEffect(() => {
    if (!isOpen) return;
    setFormState({
      name: crew?.name || "",
      status: crew?.status || "Active",
    });
  }, [crew, isOpen]);

  return (
    <ProductionModal
      isOpen={isOpen}
      onClose={onClose}
      title={crew ? "Edit Crew" : "Create Crew"}
      description="Manage crew naming and active status without affecting the rest of the production workflow."
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
            onClick={() => onSubmit?.(formState)}
            disabled={isSubmitting}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {isSubmitting ? "Saving..." : "Save Crew"}
          </button>
        </div>
      }
    >
      <div className="grid gap-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Crew Name
          </label>
          <input
            type="text"
            value={formState.name}
            onChange={(event) =>
              setFormState((current) => ({
                ...current,
                name: event.target.value,
              }))
            }
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700"
            placeholder="Enter crew name"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            value={formState.status}
            onChange={(event) =>
              setFormState((current) => ({
                ...current,
                status: event.target.value,
              }))
            }
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700"
          >
            {CREW_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </ProductionModal>
  );
};

export default CrewFormModal;

