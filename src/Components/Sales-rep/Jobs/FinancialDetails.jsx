import React, { useEffect, useState } from "react";

const FinancialDetails = ({ job = {}, isEditing = false }) => {
  const estimatedPrice = job?.estimatedPrice || 0;
  const initialBudgetSpent = job?.budgetSpent || 0;

  const [contractValue, setContractValue] = useState(estimatedPrice);
  const [budgetSpent, setBudgetSpent] = useState(initialBudgetSpent);
  const [remaining, setRemaining] = useState(
    estimatedPrice - initialBudgetSpent
  );

  useEffect(() => {
    setRemaining(contractValue - budgetSpent);
  }, [contractValue, budgetSpent]);

  const progress =
    contractValue === 0 ? 0 : (budgetSpent / contractValue) * 100;

  return (
    <div className="mb-6 p-6 bg-white shadow-md rounded-md border">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Financial Details
      </h2>

      <div className="flex space-x-8 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">
            Contract Value
          </label>
          <input
            type="number"
            value={contractValue}
            disabled={!isEditing}
            onChange={(e) => setContractValue(Number(e.target.value) || 0)}
            className={`w-full mt-1 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              !isEditing ? "bg-gray-100" : ""
            }`}
            placeholder="$ 0.00"
          />
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">
            Budget Spent
          </label>
          <input
            type="number"
            value={budgetSpent}
            disabled={!isEditing}
            onChange={(e) => setBudgetSpent(Number(e.target.value) || 0)}
            className={`w-full mt-1 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              !isEditing ? "bg-gray-100" : ""
            }`}
            placeholder="$ 0.00"
          />
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">
            Remaining
          </label>
          <input
            type="number"
            value={remaining}
            readOnly
            className="w-full mt-1 p-3 border border-gray-300 rounded-md bg-gray-100"
            placeholder="$ 0.00"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Budget Progress
        </label>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-blue-600">
            {progress.toFixed(0)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default FinancialDetails;
