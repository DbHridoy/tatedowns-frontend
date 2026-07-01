import React, { useMemo, useState } from "react";
import { FiX } from "react-icons/fi";
import DataTable from "../../../Components/Common/DataTable";
import {
  useCreatUserMutation,
  useDeleteUserMutation,
  useGetAllUsersQuery,
} from "../../../redux/api/userApi";
import UserForm from "../../../Components/Admin/UserMangement/UserForm";
import { useNavigate } from "react-router-dom";

const UserManagement = () => {
  const navigate = useNavigate();
  /* ================= STATE ================= */
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    search: "",
    sortKey: "fullName",
    sortOrder: "asc",
    filters: { role: "" },
  });

  /* ================= API ================= */
  const { data: allUsersData, isLoading } = useGetAllUsersQuery({
    page: 1,
    limit: 0,
  });
  const [createUser] = useCreatUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const users = allUsersData?.data || [];
  const allowedRoles = ["Sales Rep", "Production Manager"];

  const filteredUsers = useMemo(() => {
    const searchValue = params.search.toLowerCase();
    return users.filter((user) => {
      const roleMatch = allowedRoles.includes(user.role);
      const filterRole = params.filters?.role;
      const filterMatch = filterRole ? user.role === filterRole : true;
      const nameMatch = (user.fullName || "")
        .toLowerCase()
        .includes(searchValue);
      const emailMatch = (user.email || "")
        .toLowerCase()
        .includes(searchValue);
      return roleMatch && filterMatch && (nameMatch || emailMatch);
    });
  }, [users, params.search, params.filters, allowedRoles]);

  const sortedUsers = useMemo(() => {
    const { sortKey, sortOrder } = params;
    if (!sortKey) return filteredUsers;
    const sorted = [...filteredUsers].sort((a, b) => {
      const aValue = a?.[sortKey];
      const bValue = b?.[sortKey];
      if (typeof aValue === "number" && typeof bValue === "number") {
        return aValue - bValue;
      }
      return String(aValue || "").localeCompare(String(bValue || ""));
    });
    return sortOrder === "desc" ? sorted.reverse() : sorted;
  }, [filteredUsers, params.sortKey, params.sortOrder]);

  const totalItems = sortedUsers.length;
  const pagedUsers = useMemo(() => {
    const start = (params.page - 1) * params.limit;
    return sortedUsers.slice(start, start + params.limit);
  }, [sortedUsers, params.page, params.limit]);

  const [formUser, setFormUser] = useState({
    fullName: "",
    email: "",
    role: "",
    cluster: "",
    password: "",
  });

  const [isAddModal, setIsAddModal] = useState(false);

  /* ================= HELPERS ================= */
  const resetForm = () =>
    setFormUser({
      fullName: "",
      email: "",
      role: "",
      cluster: "",
      password: "",
    });

  const closeAddModal = () => {
    resetForm();
    setIsAddModal(false);
  };

  /* ================= ACTIONS ================= */
  const handleAddUser = async () => {
    //console.log("from Add user", formUser);
    await createUser(formUser).unwrap();
    closeAddModal();
  };

  const handleDeleteUser = async (item) => {
    await deleteUser(item._id).unwrap();
  };

  /* ================= TABLE CONFIG ================= */
  const tableConfig = {
    columns: [
      { label: "No", accessor: "No" },
      { label: "User Name", accessor: "fullName", sortable: true },
      { label: "Email", accessor: "email" },
      { label: "Role", accessor: "role" },
    ],
    filters: [
      {
        label: "Role",
        accessor: "role",
        options: {
          "Sales Rep": "Sales Rep",
          "Production Manager": "Production Manager",
        },
      },
    ],
    actions: [
      {
        label: "View",
        className: "bg-blue-500 text-white p-2 rounded-lg",
        onClick: (item) => {
          navigate(`/admin/user-management/${item._id}`);
        },
      },
      {
        label: "Delete",
        className: "bg-red-500 text-white p-2 rounded-lg",
        modal: true,
        modalTitle: "Delete User",
        modalMessage: (item) =>
          `Are you sure you want to delete ${item.fullName}?`,
        onConfirm: handleDeleteUser,
      },
    ],
    totalItems: totalItems,
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
        const nextOrder =
          p.sortKey === sortKey && p.sortOrder === "asc" ? "desc" : "asc";
        return { ...p, sortKey, sortOrder: nextOrder };
      }),
  };

  /* ================= UI ================= */
  return (
    <div className="page-container space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
          User Management
        </h2>
        <button
          className="w-full sm:w-auto px-5 py-2 bg-blue-600 text-white rounded-lg text-sm sm:text-base"
          onClick={() => setIsAddModal(true)}
        >
          + Add User
        </button>
      </div>

      <DataTable
        title="Users"
        data={pagedUsers}
        config={tableConfig}
        loading={isLoading}
      />

      {/* ADD */}
      {isAddModal && (
        <Modal title="Add User" onClose={closeAddModal}>
          <UserForm formUser={formUser} setFormUser={setFormUser} isAdd />
          <ModalActions onCancel={closeAddModal} onSave={handleAddUser} />
        </Modal>
      )}
    </div>
  );
};

/* ================= REUSABLE COMPONENTS ================= */

const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center p-4">
    <div className="bg-white w-[92vw] sm:w-full sm:max-w-md md:max-w-lg lg:max-w-xl p-5 sm:p-6 rounded-lg">
      <div className="flex justify-between mb-4">
        <h3 className="text-base sm:text-lg font-semibold">{title}</h3>
        <FiX className="cursor-pointer" onClick={onClose} />
      </div>
      {children}
    </div>
  </div>
);

const ModalActions = ({ onCancel, onSave }) => (
  <div className="flex flex-col sm:flex-row sm:justify-end gap-3 mt-5">
    <button
      onClick={onCancel}
      className="w-full sm:w-auto border px-4 py-2 rounded text-sm sm:text-base"
    >
      Cancel
    </button>
    <button
      onClick={onSave}
      className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded text-sm sm:text-base"
    >
      Save
    </button>
  </div>
);


export default UserManagement;
