import JobDetailsHeader from "../../../Components/Sales-rep/Jobs/JobDetailsHeader";
import SharedNotes from "../../../Components/Sales-rep/Jobs/SharedNotes";
import FinancialDetails from "../../../Components/Sales-rep/Jobs/FinancialDetails";
import DC from "../../../Components/Sales-rep/Jobs/DC";
import { useState } from "react";
import { useGetJobByIdQuery } from "../../../redux/api/jobApi";
import { useParams, useNavigate } from "react-router-dom";

const PmJobDetails = () => {
  const { jobId } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const { data, isLoading, isError } = useGetJobByIdQuery(jobId, {
    skip: !jobId,
  });

  const job = data?.data;

  if (isLoading) return <p className="p-6">Loading job details...</p>;
  if (isError || !job) return <p className="p-6 text-red-500">Job not found</p>;

  const client = job.clientId;
  const quote = job.quoteId;

  return (
    <div className="p-6 space-y-6">
      {/* Edit/Save Buttons */}
      <div className="flex justify-end space-x-2">
        {isEditing ? (
          <>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-red-500 text-white px-4 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-green-500 text-white px-4 py-2 rounded-md"
            >
              Save
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Edit
          </button>
        )}
      </div>
      {/* Job Header */}
      <JobDetailsHeader job={job} isEditing={isEditing} />

      {/* Top Section: Client Info + Financials */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Client Info */}
        <div className="p-6 bg-white shadow-md rounded-md border">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Client Information
          </h2>
          <div className="space-y-2 text-gray-700">
            <p>
              <span className="font-semibold">Name:</span>{" "}
              {client?.clientName || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Partner:</span>{" "}
              {client?.partnerName || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Email:</span>{" "}
              {client?.email || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Phone:</span>{" "}
              {client?.phoneNumber || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Address:</span>{" "}
              {client?.address || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Lead Source:</span>{" "}
              {client?.leadSource || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Lead Status:</span>{" "}
              {client?.leadStatus || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Rating:</span>{" "}
              {client?.rating || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Custom Client ID:</span>{" "}
              {client?.customClientId || "N/A"}
            </p>
          </div>
        </div>

        {/* Financial Details */}
        <FinancialDetails
          job={{
            estimatedPrice: quote?.estimatedPrice || job.estimatedPrice,
            downPayment: job.downPayment,
            budgetSpent: job.budgetSpent,
            downPaymentStatus: job.downPaymentStatus,
            totalHours: job.totalHours,
            setupCleanup: job.setupCleanup,
            powerwash: job.powerwash,
            labourHours: job.labourHours,
          }}
          isEditing={isEditing}
        />
      </div>

      {/* DC Section */}
      <DC jobId={jobId} />

      {/* Notes Section */}
      <SharedNotes notes={job.notes} />
    </div>
  );
};

export default PmJobDetails;
