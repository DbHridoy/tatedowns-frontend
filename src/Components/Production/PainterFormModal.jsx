import { useEffect, useState } from "react";
import ProductionModal from "./ProductionModal";
import { PAINTER_STATUS_OPTIONS } from "../../constants/production";

const PainterFormModal = ({
  isOpen,
  painter,
  crews,
  isSubmitting,
  onClose,
  onSubmit,
}) => {
  const [formState, setFormState] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    hourlyRate: "",
    status: "Active",
    crewId: "",
  });

  useEffect(() => {
    if (!isOpen) return;
    setFormState({
      fullName: painter?.fullName || "",
      email: painter?.email || "",
      password: "",
      phoneNumber: painter?.phoneNumber || "",
      hourlyRate:
        painter?.hourlyRate === 0 || painter?.hourlyRate
          ? String(painter.hourlyRate)
          : "",
      status: painter?.isActive === false ? "inactive" : "active",
      crewId: painter?.crewId || "",
    });
  }, [isOpen, painter]);

  const isEditing = Boolean(painter?._id);

  return (
    <ProductionModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Painter" : "Create Painter"}
      description="Create and manage painter accounts, including their crew assignment and hourly rate."
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
            {isSubmitting ? "Saving..." : "Save Painter"}
          </button>
        </div>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            value={formState.fullName}
            onChange={(event) =>
              setFormState((current) => ({
                ...current,
                fullName: event.target.value,
              }))
            }
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={formState.email}
            onChange={(event) =>
              setFormState((current) => ({
                ...current,
                email: event.target.value,
              }))
            }
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {isEditing ? "Reset Password" : "Password"}
          </label>
          <input
            type="password"
            value={formState.password}
            onChange={(event) =>
              setFormState((current) => ({
                ...current,
                password: event.target.value,
              }))
            }
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700"
            placeholder={isEditing ? "Leave blank to keep current password" : ""}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="text"
            value={formState.phoneNumber}
            onChange={(event) =>
              setFormState((current) => ({
                ...current,
                phoneNumber: event.target.value,
              }))
            }
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Hourly Rate
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={formState.hourlyRate}
            onChange={(event) =>
              setFormState((current) => ({
                ...current,
                hourlyRate: event.target.value,
              }))
            }
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700"
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
            {PAINTER_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
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
            <option value="">Unassigned</option>
            {crews.map((crew) => (
              <option key={crew._id} value={crew._id}>
                {crew.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </ProductionModal>
  );
};

export default PainterFormModal;
