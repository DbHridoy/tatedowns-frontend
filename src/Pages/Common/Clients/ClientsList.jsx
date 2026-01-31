import { useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import DataTable from "../../../Components/Common/DataTable";
import {
  useDeleteClientMutation,
  useGetAllClientsQuery,
} from "../../../redux/api/clientApi";

function ClientsList() {
  const navigate = useNavigate();
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    search: "",
    sortKey: "",
    sortOrder: "asc",
    filters: { role: "" },
  });

  const sortValue = params.sortKey
    ? `${params.sortOrder === "desc" ? "-" : ""}${params.sortKey}`
    : "";
  const { data: clientsData } = useGetAllClientsQuery({
    ...params,
    sort: sortValue,
  });
  const [deleteClient] = useDeleteClientMutation();

  const clients = clientsData?.data;
  const totalItems = clientsData?.total;

  const tableConfig = {
    columns: [
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
    ],
    filters: [
      {
        label: "Call Status",
        accessor: "callStatus",
        options: {
          "Not Called": "Not Called",
          "Picked-Up: Appointment Booked": "Picked-Up: Appointment Booked",
          "Picked-Up: No Appointment": "Picked-Up: No Appointment",
          "No Pickup": "No Pickup",
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
          My Clients
        </h1>
        <p className="text-sm sm:text-base text-gray-500">
          Overview of your clients
        </p>
      </div>
      <DataTable title="Clients" data={clients || []} config={tableConfig} />
    </div>
  );
}

export default ClientsList;
