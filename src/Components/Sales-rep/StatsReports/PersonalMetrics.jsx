import React from "react";

const PersonalMetrics = () => {
  const metrics = [
    { title: "Total Sold", value: "$30,000", icon: "💰" },
    { title: "Total Paid", value: "$10,000", icon: "🛍️" },
    { title: "Booking Rate", value: "70%", icon: "📊" },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Personal Metrics
      </h2>
      {metrics.map((metric, index) => (
        <div
          key={index}
          className="flex justify-between items-center bg-gray-50 p-4 rounded-lg mb-4"
        >
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{metric.icon}</span>
            <h3 className="text-lg font-semibold text-gray-800">
              {metric.title}
            </h3>
          </div>
          <p className="text-lg font-medium text-blue-500">{metric.value}</p>
        </div>
      ))}
      <div className="mt-6">
        <p className="text-sm font-semibold text-gray-800 mb-2">
          Progress to Goal
        </p>
        <div className="relative pt-1 mb-4">
          <div className="flex mb-2 items-center justify-between">
            <div className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
              75%
            </div>
          </div>
          <div className="flex mb-2">
            <div className="w-full bg-gray-200 rounded-full">
              <div className="w-3/4 bg-blue-500 text-xs leading-none py-1 text-center text-white rounded-full">
                75%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalMetrics;
