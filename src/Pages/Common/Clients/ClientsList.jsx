import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import DataTable from "../../../Components/Common/DataTable";
import {
  useDeleteClientMutation,
  useGetAllClientsQuery,
} from "../../../redux/api/clientApi";
import { useGetAllUsersQuery } from "../../../redux/api/userApi";

function ClientsList({ salesRepId } = {}) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const supportedSortKeys = [
    "clientName",
    "phoneNumber",
    "callStatus",
    "leadStatus",
    "createdAt",
  ];

  const [params, setParams] = useState(() => {
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);
    const search = searchParams.get("search") || "";
    const rawSortKey = searchParams.get("sortKey");
    const sortOrder = searchParams.get("sortOrder") || "asc";
    const callStatus = searchParams.get("callStatus") || "";
    const leadStatus = searchParams.get("leadStatus") || "Not quoted";
    const selectedSalesRepId = searchParams.get("salesRepId") || "";
    const sortKey = supportedSortKeys.includes(rawSortKey) ? rawSortKey : "createdAt";

    return {
      page: Number.isFinite(page) && page > 0 ? page : 1,
      limit: Number.isFinite(limit) && limit > 0 ? limit : 10,
      search,
      sortKey,
      sortOrder,
      filters: {
        role: "",
        callStatus,
        leadStatus,
        salesRepId: selectedSalesRepId,
      },
    };
  });

  useEffect(() => {
    const nextParams = new URLSearchParams();
    nextParams.set("page", String(params.page));
    nextParams.set("limit", String(params.limit));
    if (params.search) nextParams.set("search", params.search);
    if (params.sortKey) nextParams.set("sortKey", params.sortKey);
    if (params.sortOrder) nextParams.set("sortOrder", params.sortOrder);
    if (params.filters?.callStatus) {
      nextParams.set("callStatus", params.filters.callStatus);
    }
    if (params.filters?.leadStatus) {
      nextParams.set("leadStatus", params.filters.leadStatus);
    }
    if (params.filters?.salesRepId) {
      nextParams.set("salesRepId", params.filters.salesRepId);
    }
    setSearchParams(nextParams, { replace: true });
  }, [params, setSearchParams]);

  const { data: clientsData, isLoading } = useGetAllClientsQuery({
    page: 1,
    limit: 0,
    filters: {
      ...params.filters,
      ...(salesRepId ? { salesRepId } : {}),
    },
  });
  const [deleteClient] = useDeleteClientMutation();
  const { data: salesRepsData } = useGetAllUsersQuery({
    page: 1,
    limit: 0,
    filters: { role: "Sales Rep" },
  });

  const isSalesRepView = Boolean(salesRepId);
  const salesReps = salesRepsData?.data ?? [];
  const normalizedClients = useMemo(
    () =>
      (clientsData?.data ?? []).map((client) => ({
        ...client,
        clientName: client.clientName ?? "N/A",
        phoneNumber: client.phoneNumber ?? "",
        callStatus: client.callStatus ?? "",
        leadStatus: client.leadStatus ?? "",
        createdAt: client.createdAt,
      })),
    [clientsData?.data]
  );

  const filteredClients = useMemo(() => {
    const searchValue = params.search.trim().toLowerCase();

    return normalizedClients.filter((client) => {
      if (!searchValue) return true;

      return [
        client.clientName,
        client.phoneNumber,
        client.callStatus,
        client.leadStatus,
      ].some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(searchValue)
      );
    });
  }, [normalizedClients, params.search]);

  const sortedClients = useMemo(() => {
    const items = [...filteredClients];

    items.sort((a, b) => {
      const aValue = a?.[params.sortKey];
      const bValue = b?.[params.sortKey];

      if (params.sortKey === "createdAt") {
        return new Date(aValue || 0).getTime() - new Date(bValue || 0).getTime();
      }

      return String(aValue || "").localeCompare(String(bValue || ""));
    });

    return params.sortOrder === "desc" ? items.reverse() : items;
  }, [filteredClients, params.sortKey, params.sortOrder]);

  const totalItems = sortedClients.length;
  const pagedClients = useMemo(() => {
    const start = (params.page - 1) * params.limit;
    return sortedClients.slice(start, start + params.limit);
  }, [sortedClients, params.page, params.limit]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(totalItems / params.limit));
    if (params.page > totalPages) {
      setParams((prev) => ({ ...prev, page: totalPages }));
    }
  }, [params.limit, params.page, totalItems]);

  const baseColumns = [
      { label: "No", accessor: "No" },
      { label: "Client Name", accessor: "clientName", sortable: true },
      { label: "Phone", accessor: "phoneNumber", sortable: true },
      {
        label: "Call Status",
        accessor: "callStatus",
        sortable: true,
        colorMap: {
          "Not Called": "bg-gray-100 text-gray-700 rounded-2xl text-center p-2",
          "Picked-Up: Appointment Booked":
            "bg-green-100 text-green-800 rounded-2xl text-center p-2",
          "Picked-Up: No Appointment":
            "bg-red-100 text-red-700 rounded-2xl text-center p-2",
          "No Pickup":
            "bg-yellow-100 text-yellow-700 rounded-2xl text-center p-2",
        },
      },
      {
        label: "Lead Status",
        accessor: "leadStatus",
        sortable: true,
        colorMap: {
          "Not quoted": "bg-gray-100 text-gray-700 rounded-2xl text-center p-2",
          Quoted: "bg-blue-100 text-blue-800 rounded-2xl text-center p-2",
          Job: "bg-green-100 text-green-800 rounded-2xl text-center p-2",
        },
      },
      {
        label: "Created At",
        accessor: "createdAt",
        sortable: true,
        format: (value) =>
          value ? new Date(value).toLocaleDateString() : "—",
      },
    ];

  const tableConfig = {
    columns: baseColumns,
    filters: [
      ...(!isSalesRepView
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
        label: "Call Status",
        accessor: "callStatus",
        value: params.filters.callStatus || "",
        options: {
          "Not Called": "Not Called",
          "Picked-Up: Appointment Booked": "Picked-Up: Appointment Booked",
          "Picked-Up: No Appointment": "Picked-Up: No Appointment",
          "No Pickup": "No Pickup",
        },
      },
      {
        label: "Lead Status",
        accessor: "leadStatus",
        value: params.filters.leadStatus || "",
        options: {
          "Not quoted": "Not quoted",
          Quoted: "Quoted",
          Job: "Job",
        },
      },
    ],
    actions: [
      {
        label: "View",
        className: "bg-blue-500 text-white p-2 rounded-lg",
        onClick: (item) => navigate(`${item._id}`),
      },
      {
        label: "Call",
        className:
          "bg-white text-blue-600 border border-blue-600 p-2 rounded-lg disabled:opacity-50",
        onClick: (item) => {
          if (!item.phoneNumber) return;
          window.location.href = `tel:${item.phoneNumber}`;
        },
        disabled: (item) => !item.phoneNumber,
      },
      {
        label: "Delete",
        className: "bg-red-500 text-white p-2 rounded-lg",
        modal: true,
        modalTitle: "Delete Client",
        modalMessage: (item) =>
          `Are you sure you want to delete ${item.clientName}?`,
        onConfirm: (item) => {
          deleteClient(item._id);
          toast.success("Client deleted successfully");
        },
      },
    ],
    totalItems,
    currentPage: params.page,
    itemsPerPage: params.limit,
    sortKey: params.sortKey,
    sortOrder: params.sortOrder,
    searchValue: params.search,
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
          My Leads
        </h1>
        <p className="text-sm sm:text-base text-gray-500">
          Overview of your leads
        </p>
      </div>
      <DataTable
        title="Leads"
        data={pagedClients}
        config={tableConfig}
        loading={isLoading}
      />
    </div>
  );
}

export default ClientsList;
