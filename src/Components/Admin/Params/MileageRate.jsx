import React, { useEffect, useState } from "react";
import {
  useGetExpenseSettingsQuery,
  useUpdateExpenseSettingsMutation,
} from "../../../redux/api/expenseApi";
import toast from "react-hot-toast";

function MileageRate() {
  const { data: variable } = useGetExpenseSettingsQuery();
  const [updateExpenseSettings] = useUpdateExpenseSettingsMutation();

  const [mileageRate, setMileageRate] = useState("");
  const [originalRate, setOriginalRate] = useState("");
  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    if (variable?.data?.mileageRate !== undefined) {
      setMileageRate(variable.data.mileageRate);
      setOriginalRate(variable.data.mileageRate);
    }
  }, [variable]);

  const validateMileageRate = (rate) => {
    const numRate = parseFloat(rate);
    if (isNaN(numRate)) return "Please enter a valid number";
    if (numRate < 0) return "Mileage rate cannot be negative";
    if (numRate > 10) return "Mileage rate seems unusually high";
    return null;
  };

  const handleSave = async () => {
    const error = validateMileageRate(mileageRate);
    if (error) {
      toast.error(error);
      return;
    }

    try {
      const payload = { mileageRate: parseFloat(mileageRate) };
      if (variable?.data?.salesRepCommissionRate !== undefined) {
        payload.salesRepCommissionRate = variable.data.salesRepCommissionRate;
      }

      await updateExpenseSettings(payload).unwrap();

      toast.success("Mileage rate updated successfully");
      setOriginalRate(mileageRate);
      setIsEditable(false);
    } catch (err) {
      toast.error("Failed to update mileage rate");
    }
  };

  const handleCancel = () => {
    setMileageRate(originalRate);
    setIsEditable(false);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <h2 className="font-semibold text-gray-900">Mileage Rate per Mile</h2>
        <div className="relative w-full sm:w-40">
          <span className="absolute text-gray-500 -translate-y-1/2 left-3 top-1/2">
            $
          </span>
          <input
            type="number"
            step="0.01"
            value={mileageRate}
            disabled={!isEditable}
            onChange={(e) => setMileageRate(e.target.value)}
            className="w-full py-2 pr-3 border border-gray-300 rounded-md pl-7 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            placeholder="0.50"
          />
        </div>

        {!isEditable ? (
          <button
            onClick={() => setIsEditable(true)}
            className="w-full sm:w-auto sm:ml-2 px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm sm:text-base"
          >
            Edit
          </button>
        ) : (
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleSave}
              className="w-full sm:w-auto sm:ml-2 px-3 py-1.5 bg-green-600 text-white rounded-md text-sm sm:text-base"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="w-full sm:w-auto sm:ml-2 px-3 py-1.5 bg-red-600 text-white rounded-md text-sm sm:text-base"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MileageRate;
