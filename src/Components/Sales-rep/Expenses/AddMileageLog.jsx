import { useState } from "react";
import { useCreateMileageLogMutation } from "../../../redux/api/expenseApi";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../redux/slice/authSlice";
import RequiredMark from "../../Common/RequiredMark";

const AddMileageLog = ({ closeModal }) => {
  const currentUser = useSelector(selectCurrentUser);

  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [totalMilesDriven, setTotalMilesDriven] = useState("");
  const [file, setFile] = useState(null);
  const [note, setNote] = useState("");


  const [createMileageLog, { isLoading }] =
    useCreateMileageLogMutation();

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) =>
    String(currentYear - i)
  );

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) setFile(selectedFile);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!e.currentTarget.checkValidity()) {
      e.currentTarget.reportValidity();
      return;
    }
    if (!currentUser?._id) {
      alert("User not authenticated");
      return;
    }

    const formData = new FormData();
    formData.append("salesRepId", currentUser._id);
    formData.append("month", month);
    formData.append("year", year);
    formData.append(
      "totalMilesDriven",
      String(totalMilesDriven)
    );
    if (note) formData.append("note", note);
    if (file) formData.append("file", file);

    // ✅ Correct way to debug FormData
    for (const [key, value] of formData.entries()) {
      //console.log(key, value);
    }

    try {
      await createMileageLog(formData).unwrap();
      closeModal();
    } catch (error) {
      console.error("Failed to create mileage log", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSave}
      className="mx-auto w-full rounded-lg bg-white section-pad shadow-lg"
    >
      <h2 className="mb-4 text-xl sm:text-2xl font-bold text-gray-800">
        Add Mileage Log
      </h2>

      {/* Month */}
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Month <RequiredMark />
        </label>
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="w-full rounded-md border p-2 text-sm sm:text-base"
          required
        >
          <option value="">Select month...</option>
          {months.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      {/* Year */}
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Year <RequiredMark />
        </label>
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="w-full rounded-md border p-2 text-sm sm:text-base"
          required
        >
          <option value="">Select year...</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* Miles */}
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Total Miles Driven <RequiredMark />
        </label>
        <input
          type="number"
          min="0"
          inputMode="numeric"
          value={totalMilesDriven}
          onChange={(e) => setTotalMilesDriven(e.target.value)}
          className="w-full rounded-md border p-2 text-sm sm:text-base"
          required
        />
      </div>

      {/* File */}
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          PDF Receipt Upload
        </label>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="w-full rounded-md border p-2 text-sm sm:text-base"
        />
      </div>

      {/* Notes */}
      <div className="mb-6">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Note / Purpose of Trip
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full rounded-md border p-2 text-sm sm:text-base"
          rows={3}
        />
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <button
          type="button"
          onClick={closeModal}
          disabled={isLoading}
          className="w-full sm:flex-1 rounded-md bg-gray-300 py-2 text-sm sm:text-base"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:flex-1 rounded-md bg-blue-500 py-2 text-white text-sm sm:text-base disabled:opacity-50"
        >
          {isLoading ? "Saving..." : "Save Mileage Log"}
        </button>
      </div>
    </form>
  );
};

export default AddMileageLog;
