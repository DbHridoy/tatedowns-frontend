import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import DataTable from "../../../Components/Common/DataTable";
import { useDeleteQuoteMutation, useGetAllQuotesQuery } from "../../../redux/api/quoteApi";
import toast from "react-hot-toast";
import formatCurrency from "../../../utils/formatCurrency";
import { useGetAllUsersQuery } from "../../../redux/api/userApi";

function QuotesList({ salesRepId, canDelete = false } = {}) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [params, setParams] = useState(() => {
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);
    const search = searchParams.get("search") || "";
    const sortKey = searchParams.get("sortKey") || "fullName";
    const sortOrder = searchParams.get("sortOrder") || "asc";
    const status = searchParams.get("status") || "Pending";
    const selectedSalesRepId = searchParams.get("salesRepId") || "";

    return {
      page: Number.isFinite(page) && page > 0 ? page : 1,
      limit: Number.isFinite(limit) && limit > 0 ? limit : 10,
      search,
      sortKey,
      sortOrder,
      filters: { status, salesRepId: selectedSalesRepId },
    };
  });

  useEffect(() => {
    const nextParams = new URLSearchParams();
    nextParams.set("page", String(params.page));
    nextParams.set("limit", String(params.limit));
    if (params.search) nextParams.set("search", params.search);
    if (params.sortKey) nextParams.set("sortKey", params.sortKey);
    if (params.sortOrder) nextParams.set("sortOrder", params.sortOrder);
    if (params.filters?.status) nextParams.set("status", params.filters.status);
    if (params.filters?.salesRepId) nextParams.set("salesRepId", params.filters.salesRepId);
    setSearchParams(nextParams, { replace: true });
  }, [params, setSearchParams]);

  const sortValue = params.sortKey
    ? `${params.sortOrder === "desc" ? "-" : ""}${params.sortKey}`
    : "";
  const { data, isLoading } = useGetAllQuotesQuery({
    ...params,
    sort: sortValue,
    filters: {
      ...params.filters,
      ...(salesRepId ? { salesRepId } : {}),
    },
  });
  const [deleteQuote] = useDeleteQuoteMutation();
  const { data: salesRepsData } = useGetAllUsersQuery({
    page: 1,
    limit: 0,
    filters: { role: "Sales Rep" },
  });

  const quotes = data?.data ?? [];
  const salesReps = salesRepsData?.data ?? [];
  const scopedQuotes = salesRepId
    ? quotes.filter((q) => {
        const repId =
          typeof q.salesRepId === "string"
            ? q.salesRepId
            : q.salesRepId?._id;
        return repId === salesRepId;
      })
    : quotes;
  const totalItems = data?.total;

  const formattedQuote = scopedQuotes.map((q) => {
    const normalizedStatus = String(q.status || "")
      .trim()
      .toLowerCase();
    const displayStatus =
      normalizedStatus === "pending"
        ? "Pending"
        : normalizedStatus === "approved"
          ? "Approved"
          : normalizedStatus === "rejected"
            ? "Rejected"
            : "Pending";

    return {
      _id: q._id,
      clientId: q.clientId?._id ?? q.clientId,
      clientName: q.clientId?.clientName ?? "N/A",
      estimatedPrice: q.estimatedPrice,
      bidSheet: q.bidSheet,
      bookedOnSpot: q.bookedOnSpot,
      expiryDate: new Date(q.expiryDate).toLocaleDateString(),
      notes: q.notes,
      status: displayStatus,
      createdAt: new Date(q.createdAt).toLocaleDateString(),
      updatedAt: new Date(q.updatedAt).toLocaleDateString(),
      customQuoteId: q.customQuoteId,
    };
  });

  const tableConfig = {
    columns: [
      { label: "No", accessor: "No" },
      { label: "Client name", accessor: "clientName", sortable: true },
      { label: "Estimated price", accessor: "estimatedPrice", sortable: true, format: formatCurrency },
      {
        label: "Status",
        accessor: "status",
        sortable: true,
        colorMap: {
          Pending: "bg-gray-100 text-gray-700 rounded-2xl text-center p-2",
          Approved: "bg-green-100 text-green-800 rounded-2xl text-center p-2",
          Rejected: "bg-red-100 text-red-700 rounded-2xl text-center p-2",
        },
      },
      { label: "Creation date", accessor: "createdAt", sortable: true },
    ],
    filters: [
      ...(!salesRepId
        ? [
            {
              label: "Sales Rep",
              accessor: "salesRepId",
              value: params.filters.salesRepId || "",
              options: salesReps.reduce((acc, rep) => {
                acc[rep.fullName || rep.email || rep._id] = rep._id;
                return acc;
              }, {}),
            },
          ]
        : []),
      {
        label: "Status",
        accessor: "status",
        value: params.filters.status || "",
        options: {
          Pending: "Pending",
          Approved: "Approved",
          Rejected: "Rejected",
        },
      },
    ],
    actions: [
      {
        label: "View",
        className: "bg-blue-500 text-white p-2 rounded-lg",
        onClick: (item) => {
          navigate(`${item._id}`);
        },
      },
      ...(canDelete
        ? [
            {
              label: "Delete",
              className: "bg-red-500 text-white p-2 rounded-lg",
              modal: true,
              modalTitle: "Delete Quote",
              modalMessage: (item) =>
                `Are you sure you want to delete ${item.clientName}?`,
              onConfirm: async (item) => {
                await deleteQuote({ id: item._id, clientId: item.clientId });
                toast.success("Quote deleted successfully");
              },
            },
          ]
        : []),
    ],
    totalItems,
    currentPage: params.page,
    itemsPerPage: params.limit,
    sortKey: params.sortKey,
    sortOrder: params.sortOrder,
    onPageChange: (page) => setParams((p) => ({ ...p, page })),
    onSearch: (search) => setParams((p) => ({ ...p, search, page: 1 })),
    onFilterChange: (key, value) =>
      setParams((p) => ({
        ...p,
        page: 1,
        filters: { ...p.filters, [key]: value },
      })),
    onSortChange: (sortKey) =>
      setParams((p) => {
        const isSameKey = p.sortKey === sortKey;
        const nextOrder = isSameKey && p.sortOrder === "asc" ? "desc" : "asc";
        return { ...p, sortKey, sortOrder: nextOrder };
      }),
  };

  return (
    <div className="page-container space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
          Quotes
        </h1>
        <p className="text-sm sm:text-base text-gray-500">
          Manage your quotes here
        </p>
      </div>
      <DataTable
        title="Quotes"
        data={formattedQuote}
        config={tableConfig}
        loading={isLoading}
      />
    </div>
  );
}

export default QuotesList;
