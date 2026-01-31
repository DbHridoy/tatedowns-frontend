const InfoLine = ({ label, value }) => (
  <p className="text-sm sm:text-base">
    <span className="font-semibold">{label}:</span>{" "}
    {value !== undefined && value !== null && value !== "" ? value : "N/A"}
  </p>
);

const InfoField = ({
  label,
  value,
  isEditing,
  type = "text",
  onChange,
  readOnly = false,
  asSelect = false,
  options = [],
}) => (
  <div className="space-y-1">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    {isEditing && !readOnly ? (
      asSelect ? (
        <select
          className="w-full rounded-md border px-3 py-2 text-sm sm:text-base"
          value={value ?? ""}
          onChange={(e) => onChange?.(e.target.value)}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          className="w-full rounded-md border px-3 py-2 text-sm sm:text-base"
          value={value ?? ""}
          onChange={(e) => onChange?.(e.target.value)}
        />
      )
    ) : (
      <div className="rounded-md border px-3 py-2 text-sm sm:text-base text-gray-800">
        {value !== undefined && value !== null && value !== ""
          ? value
          : "N/A"}
      </div>
    )}
  </div>
);

const JobDetailsOverview = ({
  job,
  formJob,
  isEditing,
  statusOptions = [],
  onFieldChange,
  showEstimatedStartDate = false,
  showDownPaymentStatus = false,
  showProductionManager = false,
  jobIdPosition = "afterStartDate",
  estimatedStartDatePosition = "afterStatus",
  readOnlyFields = [],
  readOnlyFieldsPosition = "afterPrice",
  readOnlyFieldKeys = [],
}) => {
  if (!job) return null;

  const client = job.clientId;
  const quote = job.quoteId;
  const salesRep = job.salesRepId;
  const productionManager = job.productionManagerId;
  const contractUrl = job.contractUrl;
  const bidSheetUrl = quote?.bidSheetUrl;
  const latestDesignConsultation = job?.designConsultation?.length
    ? job.designConsultation[job.designConsultation.length - 1]
    : null;
  const designConsultationDoc =
    latestDesignConsultation?.contractUrl || latestDesignConsultation?.file;

  const renderLink = (label, url) =>
    url ? (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline text-sm sm:text-base"
      >
        {label}
      </a>
    ) : (
      <span className="text-sm sm:text-base text-gray-500">N/A</span>
    );

  const isFieldReadOnly = (key) => readOnlyFieldKeys.includes(key);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="section-pad bg-white shadow-md rounded-md border">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
          Job Details
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InfoField
            label="Title"
            value={formJob.title}
            isEditing={isEditing}
            readOnly={isFieldReadOnly("title")}
            onChange={(value) => onFieldChange?.("title", value)}
          />
          <InfoField
            label="Status"
            value={formJob.status}
            isEditing={isEditing}
            asSelect
            options={statusOptions}
            readOnly={isFieldReadOnly("status")}
            onChange={(value) => onFieldChange?.("status", value)}
          />
          {jobIdPosition === "afterStatus" && (
            <InfoField label="Job ID" value={job.customJobId} readOnly />
          )}
          {readOnlyFieldsPosition === "afterStatus" &&
            readOnlyFields.map((field) => (
              <InfoField
                key={field.label}
                label={field.label}
                value={field.value}
                readOnly
              />
            ))}
          {showEstimatedStartDate && estimatedStartDatePosition === "afterStatus" && (
            <InfoField
              label="Estimated Start Date"
              value={formJob.estimatedStartDate}
              isEditing={isEditing}
              type="date"
              readOnly={isFieldReadOnly("estimatedStartDate")}
              onChange={(value) => onFieldChange?.("estimatedStartDate", value)}
            />
          )}
          <InfoField
            label="Start Date"
            value={formJob.startDate}
            isEditing={isEditing}
            type="date"
            readOnly={isFieldReadOnly("startDate")}
            onChange={(value) => onFieldChange?.("startDate", value)}
          />
          {jobIdPosition === "afterStartDate" && (
            <InfoField label="Job ID" value={job.customJobId} readOnly />
          )}
          {readOnlyFieldsPosition === "afterStartDate" &&
            readOnlyFields.map((field) => (
              <InfoField
                key={field.label}
                label={field.label}
                value={field.value}
                readOnly
              />
            ))}
          {showDownPaymentStatus && (
            <InfoField
              label="Down Payment Status"
              value={formJob.downPaymentStatus}
              readOnly
            />
          )}
          <InfoField
            label="Price"
            value={formJob.price}
            isEditing={isEditing}
            type="number"
            readOnly={isFieldReadOnly("price")}
            onChange={(value) => onFieldChange?.("price", value)}
          />
          {showEstimatedStartDate && estimatedStartDatePosition === "afterPrice" && (
            <InfoField
              label="Estimated Start Date"
              value={formJob.estimatedStartDate}
              isEditing={isEditing}
              type="date"
              readOnly={isFieldReadOnly("estimatedStartDate")}
              onChange={(value) => onFieldChange?.("estimatedStartDate", value)}
            />
          )}
          {readOnlyFieldsPosition === "afterPrice" &&
            readOnlyFields.map((field) => (
              <InfoField
                key={field.label}
                label={field.label}
                value={field.value}
                readOnly
              />
            ))}
          <InfoField
            label="Down Payment"
            value={formJob.downPayment}
            isEditing={isEditing}
            type="number"
            readOnly={isFieldReadOnly("downPayment")}
            onChange={(value) => onFieldChange?.("downPayment", value)}
          />
          <InfoField
            label="Budget Spent"
            value={formJob.budgetSpent}
            isEditing={isEditing}
            type="number"
            readOnly={isFieldReadOnly("budgetSpent")}
            onChange={(value) => onFieldChange?.("budgetSpent", value)}
          />
          <InfoField
            label="Total Hours"
            value={formJob.totalHours}
            isEditing={isEditing}
            type="number"
            readOnly={isFieldReadOnly("totalHours")}
            onChange={(value) => onFieldChange?.("totalHours", value)}
          />
          <InfoField
            label="Setup/Cleanup"
            value={formJob.setupCleanup}
            isEditing={isEditing}
            type="number"
            readOnly={isFieldReadOnly("setupCleanup")}
            onChange={(value) => onFieldChange?.("setupCleanup", value)}
          />
          <InfoField
            label="Powerwash"
            value={formJob.powerwash}
            isEditing={isEditing}
            type="number"
            readOnly={isFieldReadOnly("powerwash")}
            onChange={(value) => onFieldChange?.("powerwash", value)}
          />
          <InfoField
            label="Labor Hours"
            value={formJob.laborHours}
            isEditing={isEditing}
            type="number"
            readOnly={isFieldReadOnly("laborHours")}
            onChange={(value) => onFieldChange?.("laborHours", value)}
          />
        </div>
      </div>

      <div className="space-y-6">
        <div className="section-pad bg-white shadow-md rounded-md border">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
            Sales Rep Information
          </h2>
          <div className="space-y-2 text-sm sm:text-base text-gray-700">
            <InfoLine label="Name" value={salesRep?.fullName} />
            <InfoLine label="Email" value={salesRep?.email} />
            <InfoLine label="Phone" value={salesRep?.phoneNumber} />
            <InfoLine label="Address" value={salesRep?.address} />
          </div>
        </div>

        {showProductionManager && (
          <div className="section-pad bg-white shadow-md rounded-md border">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
              Production Manager Information
            </h2>
            <div className="space-y-2 text-sm sm:text-base text-gray-700">
              <InfoLine label="Name" value={productionManager?.fullName} />
              <InfoLine label="Email" value={productionManager?.email} />
              <InfoLine label="Phone" value={productionManager?.phoneNumber} />
              <InfoLine label="Address" value={productionManager?.address} />
            </div>
          </div>
        )}

        <div className="section-pad bg-white shadow-md rounded-md border">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
            Quote Summary
          </h2>
          <div className="space-y-2 text-sm sm:text-base text-gray-700">
            <InfoLine label="Estimated Price" value={quote?.estimatedPrice} />
            <InfoLine label="Status" value={quote?.status} />
            <InfoLine
              label="Booked on the spot"
              value={quote?.bookedOnSpot ? "Yes" : "No"}
            />
            <div className="text-sm sm:text-base">
              <span className="font-semibold">Bid Sheet:</span>{" "}
              {renderLink("View bid sheet", bidSheetUrl)}
            </div>
          </div>
        </div>

        {(contractUrl || bidSheetUrl || designConsultationDoc) && (
          <div className="section-pad bg-white shadow-md rounded-md border">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
              Documents
            </h2>
            <div className="space-y-2 text-sm sm:text-base text-gray-700">
              <div className="text-sm sm:text-base">
                <span className="font-semibold">Contract:</span>{" "}
                {renderLink("View contract", contractUrl)}
              </div>
              <div className="text-sm sm:text-base">
                <span className="font-semibold">Bid Sheet:</span>{" "}
                {renderLink("View bid sheet", bidSheetUrl)}
              </div>
              <div className="text-sm sm:text-base">
                <span className="font-semibold">Design Consultation:</span>{" "}
                {renderLink("View design consultation", designConsultationDoc)}
              </div>
            </div>
          </div>
        )}

        <div className="section-pad bg-white shadow-md rounded-md border">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
            Client Information
          </h2>
          <div className="space-y-2 text-sm sm:text-base text-gray-700">
            <InfoLine label="Name" value={client?.clientName} />
            <InfoLine label="Partner" value={client?.partnerName} />
            <InfoLine label="Email" value={client?.email} />
            <InfoLine label="Phone" value={client?.phoneNumber} />
            <InfoLine label="Address" value={client?.address} />
            <InfoLine label="Lead Source" value={client?.leadSource} />
            <InfoLine label="Lead Status" value={client?.leadStatus} />
            <InfoLine label="Rating" value={client?.rating} />
            <InfoLine label="Custom Client ID" value={client?.customClientId} />
            <InfoLine label="Call Status" value={client?.callStatus} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsOverview;
