import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetAllClustersQuery,
  useGetUserQuery,
  useGetUserStatsQuery,
  useUpdateUserMutation,
} from "../../../redux/api/userApi";
import PeriodFilter from "../../../Components/Common/PeriodFilter";
import { getDefaultPeriodInput, normalizePeriodDate } from "../../../utils/period";
import {
  useCreatePaymentMutation,
  useGetPaymentsQuery,
  useUpdatePaymentMutation,
  useDeletePaymentMutation,
} from "../../../redux/api/common";
import toast from "react-hot-toast";

const emptyForm = {
  fullName: "",
  email: "",
  role: "",
  cluster: "",
};

const ViewUser = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [formUser, setFormUser] = useState(emptyForm);
  const [statsPeriodType, setStatsPeriodType] = useState("year");
  const [statsDateInput, setStatsDateInput] = useState(
    getDefaultPeriodInput("year")
  );
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    amount: "",
    date: "",
    taxStatus: "taxed",
  });
  const [editingPaymentId, setEditingPaymentId] = useState(null);
  const [updateUser, { isLoading: isSaving }] = useUpdateUserMutation();
  const [createPayment, { isLoading: isSavingPayment }] =
    useCreatePaymentMutation();
  const [updatePayment, { isLoading: isUpdatingPayment }] =
    useUpdatePaymentMutation();
  const [deletePayment, { isLoading: isDeletingPayment }] =
    useDeletePaymentMutation();
  const {
    data: paymentsData,
    isLoading: isPaymentsLoading,
  } = useGetPaymentsQuery(userId, { skip: !userId });
  const { data: userData, isLoading } = useGetUserQuery(userId, {
    skip: !userId,
  });
  const { data: userStatsData, isLoading: isStatsLoading } =
    useGetUserStatsQuery(
      {
        userId,
        periodType: statsPeriodType,
        date: normalizePeriodDate(statsPeriodType, statsDateInput),
      },
      { skip: !userId }
    );
  const { data: clustersData } = useGetAllClustersQuery();
  const user = userData?.data;
  const userStats = userStatsData?.data;
  const clusters = clustersData?.data ?? [];

  useEffect(() => {
    if (!user) return;
    setFormUser({
      fullName: user.fullName ?? "",
      email: user.email ?? "",
      role: user.role ?? "",
      cluster: user.cluster ?? "",
    });
  }, [user]);

  const stats = useMemo(() => {
    if (!userStats?.stats) return [];
    const statsData = userStats.stats;

    if (userStats.role === "Production Manager") {
      return [
        { key: "readyToScheduleCount", label: "Ready to Schedule", value: statsData.readyToScheduleCount ?? 0 },
        { key: "scheduledAndOpenCount", label: "Scheduled & Open", value: statsData.scheduledAndOpenCount ?? 0 },
        { key: "pendingCloseCount", label: "Pending Close", value: statsData.pendingCloseCount ?? 0 },
        { key: "cancelledCount", label: "Cancelled", value: statsData.cancelledCount ?? 0 },
        { key: "totalRevenue", label: "Total Revenue", value: statsData.totalRevenue ?? 0, prefix: "$" },
        { key: "totalProducedRevenue", label: "Total Produced Revenue", value: statsData.totalProducedRevenue ?? 0, prefix: "$" },
      ];
    }

    return [
      { key: "totalClients", label: "Total Clients", value: statsData.totalClients ?? 0 },
      { key: "totalQuotes", label: "Total Quotes", value: statsData.totalQuotes ?? 0 },
      { key: "totalJobs", label: "Total Jobs", value: statsData.totalJobs ?? 0 },
      { key: "totalRevenueSold", label: "Revenue Sold", value: statsData.totalRevenueSold ?? 0, prefix: "$" },
      { key: "totalRevenueProduced", label: "Revenue Produced", value: statsData.totalRevenueProduced ?? 0, prefix: "$" },
      { key: "totalCommissionEarned", label: "Commission Earned", value: statsData.totalCommissionEarned ?? 0, prefix: "$" },
      { key: "totalCommissionPaid", label: "Commission Paid", value: statsData.totalCommissionPaid ?? 0, prefix: "$" },
      { key: "totalCommissionRemaining", label: "Commission Remaining", value: statsData.totalCommissionRemaining ?? 0, prefix: "$" },
      { key: "totalCommissionPending", label: "Commission Pending", value: statsData.totalCommissionPending ?? 0, prefix: "$" },
    ];
  }, [userStats]);

  const formatValue = (item) => {
    const raw = item.value ?? 0;
    const formatted = typeof raw === "number" ? raw.toLocaleString() : String(raw);
    return `${item.prefix ?? ""}${formatted}${item.suffix ?? ""}`;
  };

  const handleCancel = () => {
    if (!user) return;
    setFormUser({
      fullName: user.fullName ?? "",
      email: user.email ?? "",
      role: user.role ?? "",
      cluster: user.cluster ?? "",
    });
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!user?._id) return;
    await updateUser({
      id: user._id,
      data: {
        fullName: formUser.fullName,
        email: formUser.email,
        role: formUser.role,
        cluster: formUser.role === "Sales Rep" ? formUser.cluster : "",
      },
    }).unwrap();
    setIsEditing(false);
  };

  const handlePaymentChange = (field, value) => {
    setPaymentForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!e.currentTarget.checkValidity()) {
      e.currentTarget.reportValidity();
      return;
    }
    if (!userId) return;
    try {
      if (editingPaymentId) {
        await updatePayment({
          paymentId: editingPaymentId,
          amount: Number(paymentForm.amount),
          paymentDate: paymentForm.date,
          taxStatus: paymentForm.taxStatus,
        }).unwrap();
        toast.success("Payment updated successfully");
      } else {
        await createPayment({
          salesRepId: userId,
          amount: Number(paymentForm.amount),
          paymentDate: paymentForm.date,
          taxStatus: paymentForm.taxStatus,
        }).unwrap();
        toast.success("Payment added successfully");
      }
      setShowPaymentModal(false);
      setPaymentForm({ amount: "", date: "", taxStatus: "taxed" });
      setEditingPaymentId(null);
    } catch (error) {
      toast.error(
        editingPaymentId ? "Failed to update payment" : "Failed to add payment"
      );
    }
  };

  const handleEditPayment = (payment) => {
    setEditingPaymentId(payment.id || payment._id);
    setPaymentForm({
      amount: String(payment.amount ?? ""),
      date: payment.paymentDate
        ? new Date(payment.paymentDate).toISOString().slice(0, 10)
        : "",
      taxStatus: payment.taxStatus || "taxed",
    });
    setShowPaymentModal(true);
  };

  const handleDeletePayment = async (paymentId) => {
    try {
      await deletePayment(paymentId).unwrap();
      toast.success("Payment deleted successfully");
    } catch (error) {
      toast.error("Failed to delete payment");
    }
  };

  const payments = paymentsData?.data || [];
  const totalPaymentAmount = payments.reduce(
    (sum, payment) => sum + (Number(payment.amount) || 0),
    0
  );
  const formatCurrency = (value) =>
    Number(value || 0).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });

  if (isLoading) {
    return <div className="p-6">Loading user...</div>;
  }

  if (!user) {
    return <div className="p-6 text-red-500">User not found.</div>;
  }

  return (
    <div className="page-container space-y-6">
      {/* <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
            User Details
          </h2>
          <p className="text-sm sm:text-base text-gray-500">
            Manage basic account information.
          </p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="w-full sm:w-auto px-3 py-2 border rounded-md text-sm sm:text-base"
        >
          Back
        </button>
      </div> */}

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">
            Personal Info
          </h3>
          <p className="text-sm sm:text-base text-gray-500">
            Review and update core contact details.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="w-full sm:w-auto px-3 py-2 border rounded-md text-sm sm:text-base"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="w-full sm:w-auto px-3 py-2 bg-blue-600 text-white rounded-md text-sm sm:text-base disabled:opacity-60"
                disabled={isSaving}
              >
                Save
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full sm:w-auto px-3 py-2 bg-blue-600 text-white rounded-md text-sm sm:text-base"
            >
              Edit
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InfoField
          label="Full Name"
          value={formUser.fullName}
          isEditing={isEditing}
          onChange={(value) => setFormUser((prev) => ({ ...prev, fullName: value }))}
        />
        <InfoField
          label="Email"
          value={formUser.email}
          type="email"
          isEditing={isEditing}
          onChange={(value) => setFormUser((prev) => ({ ...prev, email: value }))}
        />
        <InfoField
          label="Role"
          value={formUser.role}
          isEditing={isEditing}
          asSelect
          options={["Sales Rep", "Production Manager"]}
          onChange={(value) =>
            setFormUser((prev) => ({
              ...prev,
              role: value,
              cluster: value === "Sales Rep" ? prev.cluster : "",
            }))
          }
        />
        {formUser.role === "Sales Rep" ? (
          <InfoField
            label="Cluster"
            value={formUser.cluster}
            isEditing={isEditing}
            asSelect
            options={clusters.map((cluster) => cluster.clusterName)}
            onChange={(value) =>
              setFormUser((prev) => ({ ...prev, cluster: value }))
            }
          />
        ) : (
          <DisplayField label="Cluster" value="N/A" />
        )}
      </div>

      <div className="border-t pt-6">
        <div className="mb-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
              Role Stats
            </h3>
            <p className="text-sm sm:text-base text-gray-500">
              Performance metrics for {user?.role ?? "this role"}.
            </p>
          </div>
          <PeriodFilter
            label="Stats"
            periodType={statsPeriodType}
            dateValue={statsDateInput}
            onPeriodTypeChange={(value) => {
              setStatsPeriodType(value);
              setStatsDateInput(getDefaultPeriodInput(value));
            }}
            onDateChange={setStatsDateInput}
          />
        </div>
        {isStatsLoading ? (
          <div className="rounded-lg border border-dashed p-4 text-sm text-gray-500">
            Loading stats...
          </div>
        ) : stats.length === 0 ? (
          <div className="rounded-lg border border-dashed p-4 text-sm text-gray-500">
            No stats available for this role yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {stats.map((item) => (
              <div
                key={item.key}
                className="rounded-xl border bg-white p-4 shadow-sm"
              >
                <div className="text-sm text-gray-500">{item.label}</div>
                <div className="mt-1 text-lg sm:text-xl font-semibold text-gray-900">
                  {formatValue(item)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {user?.role === "Sales Rep" && (
        <div className="border-t pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
              Payment
            </h3>
            <button
              type="button"
              onClick={() => {
                setEditingPaymentId(null);
                setPaymentForm({ amount: "", date: "", taxStatus: "taxed" });
                setShowPaymentModal(true);
              }}
              className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md text-sm sm:text-base"
            >
              Add Payment
            </button>
          </div>
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
                {/* Mobile cards */}
                <div className="sm:hidden space-y-3">
                  {payments.map((payment) => (
                    <div
                      key={payment.id || payment._id}
                      className="border rounded-lg p-4 bg-white shadow-sm space-y-2"
                    >
                      <div className="text-sm">
                        <span className="text-gray-500">Amount:</span>{" "}
                        <span className="text-gray-900 font-medium">
                          {formatCurrency(payment.amount)}
                        </span>
                      </div>
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
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => handleEditPayment(payment)}
                          className="w-full px-3 py-2 border rounded text-sm"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleDeletePayment(payment.id || payment._id)
                          }
                          disabled={isDeletingPayment}
                          className="w-full px-3 py-2 bg-red-600 text-white rounded text-sm disabled:opacity-60"
                        >
                          Delete
                        </button>
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

                {/* Desktop table */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="min-w-max w-full text-left text-sm sm:text-base border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 border-b">Payment Date</th>
                        <th className="px-4 py-2 border-b">Tax Status</th>
                        <th className="px-4 py-2 border-b">Amount</th>
                        <th className="px-4 py-2 border-b">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((payment) => (
                        <tr key={payment.id || payment._id} className="border-b last:border-b-0">
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
                          <td className="px-4 py-2">
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => handleEditPayment(payment)}
                                className="px-3 py-1.5 border rounded text-xs sm:text-sm"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  handleDeletePayment(payment.id || payment._id)
                                }
                                disabled={isDeletingPayment}
                                className="px-3 py-1.5 bg-red-600 text-white rounded text-xs sm:text-sm disabled:opacity-60"
                              >
                                Delete
                              </button>
                            </div>
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
                        <td className="px-4 py-2" />
                      </tr>
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {showPaymentModal && (
        <PaymentModal
          paymentForm={paymentForm}
          isSaving={isSavingPayment || isUpdatingPayment}
          title={editingPaymentId ? "Edit Payment" : "Add Payment"}
          onChange={handlePaymentChange}
          onClose={() => {
            setShowPaymentModal(false);
            setEditingPaymentId(null);
          }}
          onSubmit={handlePaymentSubmit}
        />
      )}
    </div>
  );
};

const InfoField = ({
  label,
  value,
  type = "text",
  isEditing,
  onChange,
  asSelect = false,
  options = [],
}) => (
  <div className="space-y-1">
    <div className="text-sm font-medium text-gray-700">{label}</div>
    {isEditing ? (
      asSelect ? (
        <select
          className="w-full rounded-md border px-3 py-2 text-sm sm:text-base"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">Select</option>
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
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )
    ) : (
      <div className="rounded-md border px-3 py-2 text-sm sm:text-base text-gray-800">
        {value || "N/A"}
      </div>
    )}
  </div>
);

const DisplayField = ({ label, value }) => (
  <div className="space-y-1">
    <div className="text-sm font-medium text-gray-700">{label}</div>
    <div className="rounded-md border px-3 py-2 text-sm sm:text-base text-gray-800">
      {value || "N/A"}
    </div>
  </div>
);

const PaymentModal = ({
  paymentForm,
  isSaving,
  title,
  onChange,
  onClose,
  onSubmit,
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/40" onClick={onClose} />
    <div className="relative w-[92vw] sm:w-full sm:max-w-md md:max-w-lg lg:max-w-xl rounded-lg bg-white p-5 sm:p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-base sm:text-lg font-semibold text-gray-900">
          {title}
        </h4>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-500 hover:text-gray-900"
        >
          ✕
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Amount</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={paymentForm.amount}
            onChange={(e) => onChange("amount", e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm sm:text-base"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            value={paymentForm.date}
            onChange={(e) => onChange("date", e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm sm:text-base"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Tax Status
          </label>
          <select
            value={paymentForm.taxStatus}
            onChange={(e) => onChange("taxStatus", e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm sm:text-base"
          >
            <option value="taxed">Taxed</option>
            <option value="untaxed">Untaxed</option>
          </select>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 border rounded-md text-sm sm:text-base"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md text-sm sm:text-base disabled:opacity-60"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Payment"}
          </button>
        </div>
      </form>
    </div>
  </div>
);

export default ViewUser;
