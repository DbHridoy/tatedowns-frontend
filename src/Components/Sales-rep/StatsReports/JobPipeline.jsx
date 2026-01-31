import React from "react";

const JobPipeline = () => {
  const pipelineData = [
    { status: "DC Pending", count: 10, color: "yellow", icon: "⏳" },
    { status: "DC Pending", count: 10, color: "blue", icon: "📅" },
    { status: "DC Pending", count: 10, color: "green", icon: "✔️" },
  ];

  return (
    <div className="mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Job Pipeline</h2>

      <div className="flex space-x-4">
        {pipelineData.map((job, index) => (
          <div
            key={index}
            className={`flex-1 p-4 rounded-lg flex items-center justify-between ${
              job.color === "yellow"
                ? "bg-yellow-100"
                : job.color === "blue"
                ? "bg-blue-100"
                : "bg-green-100"
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-3xl">{job.icon}</span>
              <span className="text-lg font-medium text-gray-800">
                {job.status}
              </span>
            </div>
            <div className="text-xl font-semibold text-gray-900">
              {job.count}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobPipeline;
