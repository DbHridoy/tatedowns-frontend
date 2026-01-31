import React from "react";
import { FiBriefcase, FiDollarSign, FiTruck } from "react-icons/fi";

const approvals = [
  {
    id: 1,
    title: "Down Payment Approval",
    subtitle: "John Doe – $500 for Job #12345",
    icon: <FiDollarSign size={28} />,
    bg: "bg-orange-50",
  },
  {
    id: 2,
    title: "Job Close Approval",
    subtitle: "Jane Smith – Job #12346 ($3,000)",
    icon: <FiBriefcase size={28} />,
    bg: "bg-blue-50",
  },
  {
    id: 3,
    title: "Mileage Log Approval",
    subtitle: "John Doe – $500 for Job #12345",
    icon: <FiTruck size={28} />,
    bg: "bg-purple-50",
  },
];

const PendingApprovals  =()  => {
  return (
    <div className="w-full mx-auto p-6 border rounded-xl shadow-sm bg-white mt-10">
      <h2 className="text-2xl font-semibold text-gray-900">Pending Approvals</h2>
      <p className="text-gray-500 mt-1">Items requiring your attention</p>

      <div className="mt-6 space-y-4">
        {approvals.map((item) => (
          <div
            key={item.id}
            className={`flex justify-between items-center p-5 rounded-xl border ${item.bg}`}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-xl border shadow-sm">
                {item.icon}
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm">{item.subtitle}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="px-5 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 transition">
                Reject
              </button>
              <button className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
                Approve
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PendingApprovals;
