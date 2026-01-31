import React from 'react';

const ExpenseBreakdown = () => {
  // Example data
  const totalExpenses = 5000;
  const approvedExpenses = 4800;
  const mileageDeductions = 1200;
  const pendingExpenses = 200;

  // Calculating percentages
  const approvedPercentage = (approvedExpenses / totalExpenses) * 100;
  const mileageDeductionsPercentage = (mileageDeductions / totalExpenses) * 100;
  const pendingExpensesPercentage = (pendingExpenses / totalExpenses) * 100;

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-semibold">Expense Breakdown</h1>

      {/* Total Expenses */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-700">Total Expenses</span>
          <span className="font-medium text-blue-600">${totalExpenses}</span>
        </div>
        <div className="h-2 mt-2 bg-blue-500" style={{ width: '100%' }}></div>
      </div>

      {/* Approved Expenses */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-700">Approved Expenses</span>
          <span className="font-medium text-blue-600">${approvedExpenses} ({approvedPercentage.toFixed(0)}%)</span>
        </div>
        <div className="h-2 mt-2 bg-blue-500" style={{ width: `${approvedPercentage}%` }}></div>
      </div>

      {/* Mileage Deductions */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-700">Mileage Deductions</span>
          <span className="font-medium text-blue-600">${mileageDeductions} ({mileageDeductionsPercentage.toFixed(0)}%)</span>
        </div>
        <div className="h-2 mt-2 bg-blue-300" style={{ width: `${mileageDeductionsPercentage}%` }}></div>
      </div>

      {/* Pending Expenses */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-700">Pending Expenses</span>
          <span className="font-medium text-orange-600">${pendingExpenses} ({pendingExpensesPercentage.toFixed(0)}%)</span>
        </div>
        <div className="h-2 mt-2 bg-yellow-400" style={{ width: `${pendingExpensesPercentage}%` }}></div>
      </div>

      {/* View Details Button */}
      <div className="flex justify-end mt-6">
        <a href="#" className="text-blue-600 hover:text-blue-800">View Details →</a>
      </div>
    </div>
  );
};

export default ExpenseBreakdown;
