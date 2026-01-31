import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useGetMyStatsQuery, useGetPaymentsQuery } from "../../../redux/api/common";
import { selectCurrentUser } from "../../../redux/slice/authSlice";
import PeriodFilter from "../../../Components/Common/PeriodFilter";
import { getDefaultPeriodInput, normalizePeriodDate } from "../../../utils/period";

/**
 * Single component that can render any set of stats.
 * Usage example at the bottom (just replace the demo data with your API data).
 */
export default function SalesRepReports() {
  // ✅ Replace these with real values from your API (or props if you want)

  const [periodType, setPeriodType] = useState("year");
  const [dateInput, setDateInput] = useState(getDefaultPeriodInput("year"));
  const user = useSelector(selectCurrentUser);
  const { data: myStats } = useGetMyStatsQuery({
    periodType,
    date: normalizePeriodDate(periodType, dateInput),
  });
  const { data: paymentsData, isLoading: isPaymentsLoading } =
    useGetPaymentsQuery(user?._id, { skip: !user?._id });
  const payments = paymentsData?.data ?? [];
  const statsData = myStats?.data;
  const stats = [
    {
      key: "totalRevenueSold",
      label: "Total Revenue Sold",
      value: statsData?.totalRevenueSold ?? 0,
      prefix: "$",
    },
    {
      key: "totalRevenueProduced",
      label: "Total Revenue Produced",
      value: statsData?.totalRevenueProduced ?? 0,
      prefix: "$",
    },
    {
      key: "totalCommissionEarned",
      label: "Total Commission Earned",
      value: statsData?.totalCommissionEarned ?? 0,
      prefix: "$",
    },
    {
      key: "totalCommissionPaid",
      label: "Total Commission Paid",
      value: statsData?.totalCommissionPaid ?? 0,
      prefix: "$",
    },
    {
      key: "totalCommissionPending",
      label: "Total Commission Pending",
      value: statsData?.totalCommissionPending ?? 0,
      prefix: "$",
    },
    {
      key: "totalClients",
      label: "Total Clients",
      value: statsData?.totalClients ?? 0,
    },
    {
      key: "totalQuotes",
      label: "Total Quotes",
      value: statsData?.totalQuotes ?? 0,
    },
    { key: "totalJobs", label: "Total Jobs", value: statsData?.totalJobs ?? 0 },
  ];

  const formatValue = (item) => {
    const raw = item.value ?? 0;

    // If it's a number, format with commas
    const formatted =
      typeof raw === "number" ? raw.toLocaleString() : String(raw);

    return `${item.prefix ?? ""}${formatted}${item.suffix ?? ""}`;
  };
  const formatCurrency = (value) =>
    Number(value || 0).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });
  const totalPaymentAmount = payments.reduce(
    (sum, payment) => sum + (Number(payment.amount) || 0),
    0
  );

  return (
    <div className="page-container space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
            Reports
          </h1>
          <p className="text-sm sm:text-base text-gray-500">
            Overall business stats
          </p>
        </div>
        <PeriodFilter
          periodType={periodType}
          dateValue={dateInput}
          onPeriodTypeChange={(value) => {
            setPeriodType(value);
            setDateInput(getDefaultPeriodInput(value));
          }}
          onDateChange={setDateInput}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item) => (
          <div
            key={item.key}
            className="rounded-xl border bg-white section-pad shadow-sm"
          >
            <div className="text-sm text-gray-500">{item.label}</div>
            <div className="mt-1 text-xl sm:text-2xl font-semibold text-gray-900">
              {formatValue(item)}
            </div>

            {item.subLabel ? (
              <div className="mt-1 text-xs text-gray-400">{item.subLabel}</div>
            ) : null}
          </div>
        ))}
      </div>

      <div className="border-t pt-6">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900">
          Payment History
        </h2>
        <div className="mt-4">
          {isPaymentsLoading ? (
            <div className="rounded-lg border border-dashed p-4 text-sm text-gray-500">
              Loading payments...
            </div>
          ) : payments.length === 0 ? (
            <div className="rounded-lg border border-dashed p-4 text-sm text-gray-500">
              No payments yet.
            </div>
          ) : (
            <>
              <div className="sm:hidden space-y-3">
                {payments.map((payment) => (
                  <div
                    key={payment.id || payment._id}
                    className="border rounded-lg p-4 bg-white shadow-sm space-y-2"
                  >
                    <div className="text-sm">
                      <span className="text-gray-500">Payment Date:</span>{" "}
                      <span className="text-gray-900">
                        {payment.paymentDate
                          ? new Date(payment.paymentDate).toLocaleDateString()
                          : "—"}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Tax Status:</span>{" "}
                      <span className="text-gray-900 capitalize">
                        {payment.taxStatus || "—"}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Amount:</span>{" "}
                      <span className="text-gray-900 font-medium">
                        {formatCurrency(payment.amount)}
                      </span>
                    </div>
                  </div>
                ))}
                <div className="border-t pt-3 text-sm text-gray-700 flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold">
                    {formatCurrency(totalPaymentAmount)}
                  </span>
                </div>
              </div>

              <div className="hidden sm:block overflow-x-auto">
                <table className="min-w-max w-full text-left text-sm sm:text-base border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 border-b">Payment Date</th>
                      <th className="px-4 py-2 border-b">Tax Status</th>
                      <th className="px-4 py-2 border-b">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr
                        key={payment.id || payment._id}
                        className="border-b last:border-b-0"
                      >
                        <td className="px-4 py-2">
                          {payment.paymentDate
                            ? new Date(payment.paymentDate).toLocaleDateString()
                            : "—"}
                        </td>
                        <td className="px-4 py-2 capitalize">
                          {payment.taxStatus || "—"}
                        </td>
                        <td className="px-4 py-2">
                          {formatCurrency(payment.amount)}
                        </td>
                      </tr>
                    ))}
                    <tr className="border-t bg-gray-50">
                      <td className="px-4 py-2 font-semibold text-gray-700">
                        Total
                      </td>
                      <td className="px-4 py-2" />
                      <td className="px-4 py-2 font-semibold text-gray-700">
                        {formatCurrency(totalPaymentAmount)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
