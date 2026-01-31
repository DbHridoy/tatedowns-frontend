import { useState } from "react";
import RequiredMark from "../../../Components/Common/RequiredMark";

const CALL_STATUS_OPTIONS = [
  "Not Called",
  "Picked-Up: Appointment Booked",
  "Picked-Up: No Appointment",
  "No Pickup",
];

const AddCallLog = ({ closeModal, clientId, onSubmit }) => {
  const [status, setStatus] = useState("");
  const [note, setNote] = useState("");
  const [reason, setReason] = useState(""); // New state for reason

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!e.currentTarget.checkValidity()) {
      e.currentTarget.reportValidity();
      return;
    }

    const payload = {
      clientId,
      callAt: new Date().toISOString(), // Current local time
      status,
      note,
      reason: status === "Picked-Up: No Appointment" ? reason : undefined,
    };

    //console.log("Payload", payload);
    onSubmit(payload);
    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-xl w-[92vw] sm:w-full sm:max-w-md md:max-w-lg lg:max-w-xl overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            Add Call Log
          </h2>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Call Outcome */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Call Outcome <RequiredMark />
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm sm:text-base"
              required
            >
              <option value="">Select outcome...</option>
              {CALL_STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Reason (conditional) */}
          {status === "Picked-Up: No Appointment" && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Reason <RequiredMark />
              </label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason..."
                className="w-full px-3 py-2 border rounded-lg text-sm sm:text-base"
                required={status === "Picked-Up: No Appointment"}
              />
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium mb-1">Call Notes</label>
            <textarea
              rows="4"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Enter details about the call..."
              className="w-full px-3 py-2 border rounded-lg resize-none text-sm sm:text-base"
            />
          </div>

          {/* Timestamp Preview */}
          <div className="text-xs sm:text-sm text-gray-500">
            Call Time: {new Date().toLocaleString()}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex flex-col sm:flex-row gap-3 bg-gray-50">
          <button
            type="button"
            onClick={closeModal}
            className="w-full sm:flex-1 py-2 border rounded-lg text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-full sm:flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm sm:text-base"
          >
            Save Call Log
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCallLog;
