import { useEffect, useState } from "react";
import {
  useGetFiscalYearQuery,
  useCreateFiscalYearMutation,
} from "../../../redux/api/common";
import toast from "react-hot-toast";
import SimpleLoader from "../../Common/SimpleLoader";

function FiscalYear() {
  const { data: fiscalYear, isLoading } = useGetFiscalYearQuery();
  const [createFiscalYear, { isLoading: saving }] =
    useCreateFiscalYearMutation();

  const [isEditing, setIsEditing] = useState(false);

  const [fiscalStart, setFiscalStart] = useState("");
  const [fiscalEnd, setFiscalEnd] = useState("");
  const [original, setOriginal] = useState(null);

  // Load from API
  useEffect(() => {
    if (fiscalYear?.data) {
      const start = fiscalYear.data.startDate?.slice(0, 10);
      const end = fiscalYear.data.endDate?.slice(0, 10);

      setFiscalStart(start);
      setFiscalEnd(end);
      setOriginal({ start, end });
    }
  }, [fiscalYear]);

  const validate = () => {
    if (!fiscalStart || !fiscalEnd) return "Both dates are required";
    if (new Date(fiscalStart) >= new Date(fiscalEnd))
      return "End date must be after start date";
    return null;
  };

  const handleSave = async () => {
    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }

    try {
      await createFiscalYear({
        startDate: fiscalStart,
        endDate: fiscalEnd,
        isActive: true,
      }).unwrap();

      toast.success("Fiscal year updated");
      setOriginal({ start: fiscalStart, end: fiscalEnd });
      setIsEditing(false);
    } catch {
      toast.error("Failed to update fiscal year");
    }
  };

  const handleCancel = () => {
    setFiscalStart(original.start);
    setFiscalEnd(original.end);
    setIsEditing(false);
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  if (isLoading) return <SimpleLoader className="min-h-[100px]" />;

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <div className="flex items-center gap-3 flex-wrap">
        <h2 className="font-semibold text-gray-800">Active fiscal year:</h2>

        {!isEditing ? (
          <>
            <div className="relative">
              <div>{formatDate(fiscalYear.data.startDate)}</div>
            </div>

            <span className="mx-1">–</span>

            <div className="relative">
              <div>{formatDate(fiscalYear.data.endDate)}</div>
            </div>

            <button
              onClick={() => setIsEditing(true)}
              className="ml-2 px-3 py-1.5 bg-blue-600 text-white rounded-md"
            >
              Edit
            </button>
          </>
        ) : (
          <>
            <div className="relative">
              <input
                type="date"
                value={fiscalStart}
                onChange={(e) => setFiscalStart(e.target.value)}
                className="px-3 py-2 border rounded-md"
              />
            </div>

            <span className="mx-1">–</span>

            <div className="relative">
              <input
                type="date"
                value={fiscalEnd}
                onChange={(e) => setFiscalEnd(e.target.value)}
                className="px-3 py-2 border rounded-md"
              />
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="ml-2 px-3 py-1.5 bg-green-600 text-white rounded-md"
            >
              Save
            </button>

            <button
              onClick={handleCancel}
              className="ml-2 px-3 py-1.5 border rounded-md"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default FiscalYear;
