import React, { useState } from "react";

import DownpaymentRequest from "../../../Components/Admin/Approval center/DownpaymentRequest";
import MileageApprovalRequests from "../../../Components/Admin/Approval center/MileageApprovalRequests";
import JobCloseRequests from "../../../Components/Admin/Approval center/JobCloseRequests";
import SalesAssignement from "../../../Components/Admin/Approval center/SalesAssignement";
import DcApprovalRequests from "../../../Components/Admin/Approval center/DcApprovalRequests";

const Approvals = () => {
  const [activeTab, setActiveTab] = useState("downpayment");
  const [open, setOpen] = useState(false);



  // const reps = [
  //   "John Doe",
  //   "Sarah Parker",
  //   "Michael Smith",
  //   "Aisha Rahman",
  //   "David Miller",
  // ];
  const tabs = [
    { id: "downpayment", label: "Down Payment Approval", count: 0 },
    { id: "dcapproval", label: "DC Approval", count: 0 },
    { id: "jobclose", label: "Job Close Approvals", count: 0 },
    { id: "leadassignment", label: "Lead Assignment", count: 0 },
    { id: "mileage", label: "Mileage Log Approvals", count: 0 },
  ];










  return (
    <div className="min-h-screen page-container space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 whitespace-nowrap text-sm sm:text-base transition-colors ${activeTab === tab.id
                ? "border-b-2 border-blue-500 text-blue-600 font-medium"
                : "text-gray-600 hover:text-gray-800"
              }`}
          >
            {tab.label}
            {/* <span className="bg-gray-300 text-gray-700 text-xs font-semibold px-2 py-0.5 rounded-full">
              {tab.count}
            </span> */}
          </button>
        ))}
      </div>

      {/* Down Payment Approval Section */}
      {activeTab === "downpayment" && <DownpaymentRequest />}

      {/* DC Approvals Section */}
      {activeTab === "dcapproval" && <DcApprovalRequests />}

      {/* Job Close Approvals Section */}
      {activeTab === "jobclose" && (
        <JobCloseRequests />
      )}

      {/* Lead Assignment Approvals Section */}
      {activeTab === "leadassignment" && (
        <SalesAssignement />
      )}

      {/* Mileage Log Approvals Section */}
      {activeTab === "mileage" && <MileageApprovalRequests />}


    </div>
  );
};
export default Approvals;
