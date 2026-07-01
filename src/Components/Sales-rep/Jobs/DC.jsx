import React from "react";
import { useNavigate } from "react-router-dom";
import { useGetJobByIdQuery } from "../../../redux/api/jobApi";

const getFileName = (url = "") => decodeURIComponent(url.split("/").pop() || "");

const InfoLine = ({ label, value }) => (
  <p className="text-sm sm:text-base">
    <span className="font-semibold">{label}:</span>{" "}
    {value !== undefined && value !== null && value !== "" ? value : "N/A"}
  </p>
);

const DC = ({
  jobId,
  actionLabel = "Add Document",
  onAction,
  hideAction = false,
  actionUrl,
}) => {
  const navigate = useNavigate();
  const { data: jobDetails } = useGetJobByIdQuery(jobId, { skip: !jobId });
  const job = jobDetails?.data;

  const designConsultations = job?.designConsultation ?? [];
  const hasDocs = designConsultations.length > 0;
  const normalizedJobStatus = String(job?.status || "").trim().toLowerCase();
  const normalizedDownPaymentStatus = String(job?.downPaymentStatus || "")
    .trim()
    .toLowerCase();
  const isDownPaymentPending =
    normalizedDownPaymentStatus === "pending" ||
    normalizedJobStatus === "downpayment pending";
  const isAddAction = String(actionLabel || "")
    .trim()
    .toLowerCase()
    .startsWith("add");
  const shouldHideAction =
    hideAction || (isDownPaymentPending && !hasDocs && isAddAction);
  const showDownPaymentPendingMessage =
    !hideAction && isDownPaymentPending && !hasDocs && isAddAction;

  const renderFileLinks = (files = []) =>
    files.length ? (
      <div className="mt-2 space-y-1">
        {files.map((fileUrl) => (
          <a
            key={fileUrl}
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-600 underline text-sm"
          >
            📎 {getFileName(fileUrl)}
          </a>
        ))}
      </div>
    ) : (
      <p className="text-sm text-gray-500">No files attached.</p>
    );

  return (
    <div className="bg-white shadow-md rounded-xl border px-5 py-6 space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
          DC (Design Consultation)
        </h2>

        {!shouldHideAction && (
          <button
            onClick={
              onAction
                ? onAction
                : () =>
                    navigate(
                      actionUrl ||
                        `/sales-rep/jobs/${jobId}/design-consultation`
                    )
            }
            className="bg-blue-500 text-white px-4 py-2 text-sm sm:text-base rounded hover:bg-blue-600"
          >
            {actionLabel}
          </button>
        )}
        {showDownPaymentPendingMessage && (
          <p className="text-sm sm:text-base text-amber-700 font-medium">
            Downpayment is pending. You can add DC after downpayment approval.
          </p>
        )}
      </div>

      {hasDocs ? (
        <div className="space-y-4">
          {designConsultations.map((dc) => {
            const contractFiles =
              dc?.contract?.map((contract) => contract.contractUrl).filter(Boolean) ||
              [];
            const fileLinks = [
              dc.file,
              dc.contractUrl,
              ...contractFiles,
            ].filter(Boolean);

            return (
              <div key={dc._id} className="rounded-lg border p-4 sm:p-5">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <InfoLine label="Product" value={dc.product} />
                  <InfoLine label="Color Code" value={dc.colorCode} />
                  <InfoLine
                    label="Estimated Gallons"
                    value={dc.estimatedGallons}
                  />
                  <InfoLine
                    label="Estimated Start Date"
                    value={
                      dc.estimatedStartDate
                        ? new Date(dc.estimatedStartDate).toLocaleDateString()
                        : null
                    }
                  />
                  <InfoLine label="Added Hours" value={dc.addedHours} />
                  <InfoLine label="Upsell Description" value={dc.upsellDescription} />
                  <InfoLine label="Upsell Value" value={dc.upsellValue} />
                </div>
                <div className="mt-3">
                  <p className="text-sm sm:text-base font-semibold text-gray-700">
                    Files
                  </p>
                  {renderFileLinks(fileLinks)}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500">No design consultation data.</p>
      )}
    </div>
  );
};

export default DC;
