import { useParams } from "react-router-dom";
import { useGetMileageLogByIdQuery } from "../../../redux/api/expenseApi";
import formatCurrency from "../../../utils/formatCurrency";
import SimpleLoader from "../../../Components/Common/SimpleLoader";

const MileageDetails = () => {
  const { mileageId } = useParams();
  const { data, isLoading, isError } = useGetMileageLogByIdQuery(mileageId, {
    skip: !mileageId,
  });

  const mileage =
    data?.data?.data || data?.data || null;

  if (isLoading) return <SimpleLoader />;
  if (isError || !mileage) {
    return <div className="p-6 text-red-500">Mileage not found</div>;
  }

  const {
    salesRepId,
    month,
    year,
    totalMilesDriven,
    deduction,
    status,
    file,
    note,
    createdAt,
  } = mileage;

  return (
    <div className="page-container space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
          Mileage Details
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Review mileage log details
        </p>
      </div>

      <div className="bg-white border rounded-lg section-pad space-y-4">
        <div>
          <p className="text-sm text-gray-500">Sales Rep</p>
          <p className="font-semibold">
            {salesRepId?.fullName || salesRepId || "N/A"}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Period</p>
          <p className="font-semibold">
            {month && year ? `${month} ${year}` : "N/A"}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Miles Driven</p>
          <p className="font-semibold">{totalMilesDriven ?? 0}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Deduction</p>
          <p className="font-semibold">{formatCurrency(deduction ?? 0)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Status</p>
          <p className="font-semibold">{status || "N/A"}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Created At</p>
          <p className="font-semibold">
            {createdAt ? new Date(createdAt).toLocaleDateString() : "N/A"}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Note</p>
          <p className="font-semibold">{note || "—"}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Receipt</p>
          {file ? (
            <a
              href={file}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline"
            >
              View receipt
            </a>
          ) : (
            <p className="font-semibold">—</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MileageDetails;
