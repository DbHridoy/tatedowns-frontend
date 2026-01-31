import React, { useState } from "react";
import {
  useGetAllJobsQuery,
  useUpdateJobMutation,
} from "../../../redux/api/jobApi";
import DataTable from "../../Common/DataTable";

function DownpaymentRequest() {
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    search: "",
    sortKey: "",
    sortOrder: "asc",
    filters: {downPaymentStatus:"Pending"},
  });

  // ✅ pass params to RTK Query
  const { data: downpaymentRequests, isLoading } =
    useGetAllJobsQuery(params);

  //console.log(downpaymentRequests);

  const downpaymentRequestData = downpaymentRequests?.data ?? [];
  const totalItems = downpaymentRequests?.total ?? 0;
  //console.log(downpaymentRequestData);

  const formattedData = downpaymentRequestData.map((item) => ({
    id: item._id,
    clientName: item?.clientId?.clientName ?? "N/A",
    amount: item?.downPayment ?? 0,
    status: item?.downPaymentStatus ?? "Pending",
  }));
  const [updateDownPaymentStatus] = useUpdateJobMutation();
  const tableConfig = {
    columns: [
      { label: "No", accessor: "No" },
      { label: "Client Name", accessor: "clientName", sortable: true },
      { label: "Amount", accessor: "amount" },
      { label: "Status", accessor: "status" },
    ],
    actions: [
      {
        label: "Accept",
        className: "bg-green-500 text-white p-2 rounded-lg",
        modal: true,
        modalTitle: "Accept Down Payment Request",
        modalMessage: (item) =>
          `Are you sure you want to accept ${item.clientName}?`,
        onConfirm: (item) => {
          //console.log("item",item)
          updateDownPaymentStatus({
            id: item.id,
            data: { downPaymentStatus: "Approved" },
          });
        },
      },
      {
        label: "Reject",
        className: "bg-red-500 text-white p-2 rounded-lg",
        modal: true,
        modalTitle: "Reject Down Payment Request",
        modalMessage: (item) =>
          `Are you sure you want to reject ${item.clientName}?`,
        onConfirm: (item) => {
          updateDownPaymentStatus({
            id: item.id,
            data: { downPaymentStatus: "Rejected" },
          });
        },
      },
    ],
    totalItems,
    currentPage: params.page,
    itemsPerPage: params.limit,
    sortKey: params.sortKey,
    sortOrder: params.sortOrder,

    onPageChange: (page) => setParams((p) => ({ ...p, page })),

    onSearch: (search) => setParams((p) => ({ ...p, search, page: 1 })),

    onSortChange: (sortKey, sortOrder) =>
      setParams((p) => ({ ...p, sortKey, sortOrder })),
  };

  return (
    <DataTable
      title="Down Payment Request"
      data={formattedData}
      config={tableConfig}
      loading={isLoading}
    />
  );
}

export default DownpaymentRequest;
