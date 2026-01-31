import React from "react";

const JobDetailsHeader = ({ job, isEditing }) => {
  const jobData = {
    jobId: job.customJobId,
    clientName: job.clientId?.clientName,
    jobTitle: job.title,
    startDate: job.startDate,
    jobStatus: job.status,
  };

  return (
    <div className="flex justify-between items-center p-6 bg-white mb-6 shadow-md rounded-md border">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          {jobData.jobTitle}
        </h2>
        <p className="text-lg text-gray-600">
          <span className="font-semibold">Job ID:</span> {jobData.jobId}
        </p>
        <p className="text-lg text-gray-600">
          <span className="font-semibold">Client:</span> {jobData.clientName}
        </p>
        <p className="text-lg text-gray-600">
          <span className="font-semibold">Start Date:</span>{" "}
          {jobData.startDate
            ? new Date(jobData.startDate).toLocaleDateString()
            : "N/A"}
        </p>
        <p className="text-lg text-gray-600">
          <span className="font-semibold">Job Status:</span>{" "}
          <span className="px-3 py-1 text-blue-800 bg-blue-100 rounded-full text-lg font-medium">
            {jobData.jobStatus}
          </span>
        </p>
      </div>
    </div>
  );
};

export default JobDetailsHeader;
