import React, { useState } from "react";
import PaymentModal from "../../../Components/Admin/Reports/PaymentModal";
import { useParams } from "react-router-dom";
import {
  useGetAllJobsQuery,
} from "../../../redux/api/jobApi";
import { useGetAllMileageLogsQuery } from "../../../redux/api/expenseApi";

const RepDetails = () => {
  const [addPaymentModal, setAddPaymentModal] = useState(false);
  const { id } = useParams();
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    search: "",
    sortKey: "",
    sortOrder: "asc",
    filters: {},
  });
  //console.log("repId", id);
  const { data: jobsData = [] } = useGetAllJobsQuery({
    options: params,
    repId: id,
  });

  const { data: deductionData } = useGetAllMileageLogsQuery(id);

  // Use the rep ID from params
  const jobs = jobsData.data || [];
  const totalItems = jobsData.total || 0;
  const totalEarnings = jobsData.totalEarning || 0;
  const totalDeductions = deductionData?.data || 0;

  return (
    <div className="min-h-screen page-container text-gray-800 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
          View Details - Rep A
        </h1>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="section-pad bg-white rounded-lg shadow">
          <p className="text-sm text-gray-500">Total Earned</p>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
            ${totalEarnings}
          </h2>
        </div>
        {/* <div className="p-4 bg-white rounded-lg shadow">
          <p>Total Deductions</p>
          <h2 className="text-2xl font-bold text-red-500">${totalDeductions}</h2>
        </div> */}
        <div className="section-pad bg-white rounded-lg shadow">
          <p className="text-sm text-gray-500">Mileage Deductions</p>
          <h2 className="text-xl sm:text-2xl font-semibold text-blue-600">
            ${totalDeductions}
          </h2>
        </div>
      </div>

      {/* Earnings Breakdown */}
      {/* <EarningBreakdown id={id}/> */}

      {/* Payment History */}
      <div className="section-pad bg-white rounded-lg shadow space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
            Payment History
          </h3>
          <button
            onClick={() => setAddPaymentModal(true)}
            className="w-full sm:w-auto px-4 py-2 text-white bg-blue-600 rounded-lg text-sm sm:text-base"
          >
            + Add Payment
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-max w-full text-left text-sm sm:text-base">
            <thead>
              <tr className="border-b">
                <th className="py-2">Payment Amount</th>
                <th>Date Paid</th>
                <th>Remaining Owed</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {[
                { amount: "$300.00", date: "12/05/2025", owed: "$450.00" },
                { amount: "$300.00", date: "12/05/2025", owed: "$450.00" },
              ].map((p, i) => (
                <tr key={i} className="border-b last:border-none">
                  <td className="py-2 font-semibold text-blue-600">
                    {p.amount}
                  </td>
                  <td>{p.date}</td>
                  <td>{p.owed}</td>
                  <td className="flex gap-2 text-red-500">
                    <button>✎</button>
                    <button>🗑</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between gap-2 text-sm sm:text-base">
          <p>
            Total Payments Made:{" "}
            <span className="font-semibold text-green-600">$400.00</span>
          </p>
          <p>
            Remaining:{" "}
            <span className="font-semibold text-blue-600">$350.00</span>
          </p>
        </div>
      </div>

      {/* Manual Payment */}
      {addPaymentModal && (
        <PaymentModal
          isOpen={addPaymentModal}
          onClose={() => setAddPaymentModal(false)}
          onSave={() => {
            setAddPaymentModal(false);
          }}
        />
      )}

      {/* Deductions */}
      {/* <div className="p-4 bg-white rounded-lg shadow">
        <h3 className="mb-3 text-lg font-semibold">Deductions</h3>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2">Deduction Type</th>
              <th>Amount Deducted</th>
              <th>Miles Traveled</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2">Mileage</td>
              <td className="font-semibold text-red-500">$100</td>
              <td>100 miles</td>
              <td className="font-semibold text-green-600">Approved</td>
            </tr>
            <tr>
              <td className="py-2">Mileage</td>
              <td className="font-semibold text-red-500">$50</td>
              <td>—</td>
              <td className="font-semibold text-yellow-500">Pending</td>
            </tr>
          </tbody>
        </table>
      </div> */}
    </div>
  );
};

export default RepDetails;
