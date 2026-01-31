import { useNavigate } from "react-router-dom";
import { useState } from "react";
import DataTable from "../../../Components/Common/DataTable";
import { useGetAllQuotesQuery } from "../../../redux/api/quoteApi";

function QuotesList() {
  const navigate = useNavigate();
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    search: "",
    sortKey: "fullName",
    sortOrder: "asc",
    filters: { status: "Pending" },
  });

  const sortValue = params.sortKey
    ? `${params.sortOrder === "desc" ? "-" : ""}${params.sortKey}`
    : "";
  const { data } = useGetAllQuotesQuery({ ...params, sort: sortValue });
  const quotes = data?.data ?? [];
  const totalItems = data?.total;

  const formattedQuote = quotes.map((q) => ({
    _id: q._id,
    clientName: q.clientId.clientName,
    estimatedPrice: q.estimatedPrice,
    bidSheet: q.bidSheet,
    bookedOnSpot: q.bookedOnSpot,
    expiryDate: new Date(q.expiryDate).toLocaleDateString(),
    notes: q.notes,
    status:
      q.status === "pending"
        ? "Pending"
        : q.status === "approved"
        ? "Approved"
        : "Rejected",
    createdAt: new Date(q.createdAt).toLocaleDateString(),
    updatedAt: new Date(q.updatedAt).toLocaleDateString(),
    customQuoteId: q.customQuoteId,
  }));

  const tableConfig = {
    columns: [
      { label: "No", accessor: "No" },
      { label: "Client name", accessor: "clientName", sortable: true },
      { label: "Estimated price", accessor: "estimatedPrice", sortable: true },
      { label: "Creation date", accessor: "createdAt", sortable: true },
    ],
    actions: [
      {
        label: "View",
        className: "bg-blue-500 text-white p-2 rounded-lg",
        onClick: (item) => {
          navigate(`${item._id}`);
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
      <DataTable title="Quotes" data={formattedQuote} config={tableConfig} />
    </div>
  );
}

export default QuotesList;
