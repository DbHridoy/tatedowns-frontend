import { useState } from "react";

const Modal = ({ show, title, message, onCancel, onConfirm }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-[92vw] sm:w-full sm:max-w-md md:max-w-lg lg:max-w-xl">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-3">{title}</h3>
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-100 rounded"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DataTable = ({ title, data = [], config = {} }) => {
  //console.log(data);
  const {
    columns = [],
    actions = [],
    filters = [],
    showSearch,

    // server controlled
    currentPage,
    totalItems,
    itemsPerPage,
    sortKey,
    sortOrder,
    onPageChange,
    onSearch,
    onFilterChange,
    onSortChange,
  } = config;

  const [modalConfig, setModalConfig] = useState({
    show: false,
    item: null,
    action: null,
  });

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const emptyMessage = config.emptyMessage || "No data found";
  const sortableColumns = columns.filter((col) => col.sortable);
  const handleSort = (col) => {
    if (!col.sortable) return;
    onSortChange?.(col.accessor);
  };

  const handleAction = (action, item) => {
    if (action.modal) {
      setModalConfig({ show: true, item, action });
    } else {
      action.onClick?.(item);
    }
  };

  const handleConfirmModal = () => {
    modalConfig.action?.onConfirm?.(modalConfig.item);
    setModalConfig({ show: false, item: null, action: null });
  };

  const shouldShowSearch = showSearch ?? Boolean(onSearch);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      {title && (
        <div className="px-4 sm:px-6 py-4 border-b flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            {title}
          </h2>
          {shouldShowSearch && (
            <input
              type="text"
              placeholder="Search..."
              onChange={(e) => onSearch?.(e.target.value)}
              className="w-full sm:w-64 px-3 py-2 border rounded-lg text-sm sm:text-base"
            />
          )}
        </div>
      )}

      {/* Filters */}
      {filters.length > 0 && (
        <div className="flex flex-wrap gap-3 px-4 sm:px-6 py-4 border-b">
          {filters.map((f) => (
            <select
              key={f.accessor}
              onChange={(e) => onFilterChange?.(f.accessor, e.target.value)}
              className="w-full sm:w-auto px-3 py-2 border rounded-lg text-sm sm:text-base"
            >
              <option value="">{f.label}</option>
              {Object.entries(f.options).map(([label, value]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          ))}
        </div>
      )}

      {/* Table */}
      {data.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      ) : (
        <>
          {/* Mobile cards */}
          <div className="sm:hidden space-y-3 p-4">
            {sortableColumns.length > 0 && (
              <div className="flex items-center gap-3">
                <select
                  value={sortKey || ""}
                  onChange={(e) => {
                    const nextKey = e.target.value;
                    if (nextKey) onSortChange?.(nextKey);
                  }}
                  className="w-full px-3 py-2 border rounded-lg text-sm sm:text-base"
                >
                  <option value="">Sort by</option>
                  {sortableColumns.map((col) => (
                    <option key={col.accessor} value={col.accessor}>
                      {col.label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => sortKey && onSortChange?.(sortKey)}
                  disabled={!sortKey}
                  className="px-3 py-2 border rounded-lg text-sm sm:text-base disabled:opacity-50"
                >
                  {sortOrder === "desc" ? "Desc" : "Asc"}
                </button>
              </div>
            )}
            {data.map((row, idx) => {
              const numberValue = (currentPage - 1) * itemsPerPage + idx + 1;
              const displayColumns = columns.filter(
                (col) => col.accessor !== "No"
              );

              const getValue = (col) => {
                if (!col) return "";
                let value = row[col.accessor];
                if (col.label === "Date" && value) {
                  return new Date(value).toLocaleDateString();
                }
                return value;
              };

              return (
                <div
                  key={idx}
                  className="border rounded-xl bg-white p-4 shadow-sm space-y-3"
                >
                  <div className="space-y-2">
                    {displayColumns.map((col) => {
                      const value =
                        col.accessor === "No" ? numberValue : getValue(col);
                      return (
                        <div
                          key={col.accessor}
                          className="flex items-start gap-2 text-sm sm:text-base"
                        >
                          <span className="min-w-[90px] text-gray-500">
                            {col.label}:
                          </span>
                          <span
                            className={`text-gray-900 ${
                              col.colorMap?.[value] || ""
                            }`}
                          >
                            {value || "—"}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {actions.length > 0 && (
                    <div
                      className={`grid gap-2 pt-1 ${
                        actions.length === 1
                          ? "grid-cols-1"
                          : actions.length === 2
                            ? "grid-cols-2"
                            : "grid-cols-3"
                      }`}
                    >
                      {actions.map((action, i) => (
                        <button
                          key={i}
                          onClick={() => handleAction(action, row)}
                          className={`w-full ${
                            action.className ||
                            "px-2 py-1 text-sm sm:text-base bg-blue-500 text-white rounded"
                          }`}
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="min-w-full divide-y">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col.accessor}
                      onClick={() => col.sortable && handleSort(col)}
                      className={`px-3 sm:px-4 py-3 text-center align-middle text-xs sm:text-sm font-semibold ${
                        col.sortable ? "cursor-pointer" : ""
                      }`}
                    >
                      {col.label}
                      {col.sortable &&
                        sortKey === col.accessor &&
                        (sortOrder === "asc" ? " ▲" : " ▼")}
                    </th>
                  ))}
                  {actions.length > 0 && (
                    <th className="px-3 sm:px-4 py-3 text-center align-middle text-xs sm:text-sm font-semibold">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>

              <tbody className="divide-y">
                {data.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    {columns.map((col) => {
                      let value =
                        col.accessor === "No"
                          ? (currentPage - 1) * itemsPerPage + idx + 1
                          : row[col.accessor];

                      // Format date if accessor is 'date'
                      if (col.label === "Date" && value) {
                        value = new Date(value).toLocaleDateString();
                      }

                      return (
                        <td key={col.accessor}>
                          <div
                            className={`text-center align-middle text-sm sm:text-base ${
                              col.colorMap?.[value] || ""
                            }`}
                          >
                            {value}
                          </div>
                        </td>
                      );
                    })}

                    {actions.length > 0 && (
                      <td className="px-3 sm:px-4 py-3 flex flex-wrap justify-center items-center gap-2">
                        {actions.map((action, i) => (
                          <button
                            key={i}
                            onClick={() => handleAction(action, row)}
                            className={
                              action.className ||
                              "px-2 py-1 text-sm sm:text-base bg-blue-500 text-white rounded"
                            }
                          >
                            {action.label}
                          </button>
                        ))}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Pagination */}
      <div className="px-4 sm:px-6 py-4 border-t flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
        <span className="text-sm sm:text-base text-gray-600">
          Page {currentPage} of {totalPages || 0}
        </span>

        <div className="flex w-full sm:w-auto gap-2 justify-between sm:justify-end">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 border rounded text-sm sm:text-base disabled:opacity-50"
          >
            Prev
          </button>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 border rounded text-sm sm:text-base disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal */}
      <Modal
        show={modalConfig.show}
        title={modalConfig.action?.modalTitle || "Confirm"}
        message={
          modalConfig.action?.modalMessage?.(modalConfig.item) ||
          "Are you sure?"
        }
        onCancel={() =>
          setModalConfig({ show: false, item: null, action: null })
        }
        onConfirm={handleConfirmModal}
      />
    </div>
  );
};

export default DataTable;

// const tableConfig = {
// const [params, setParams] = useState({
//   page: 1,
//   limit: 10,
//   search: "",
//   sortKey: "fullName",
//   sortOrder: "asc",
//   filters: { role: "" },
// });
//   columns: [
//     { label: "No", accessor: "No" },
//     { label: "User Name", accessor: "fullName", sortable: true },
//     { label: "Email", accessor: "email" },
//     { label: "Role", accessor: "role" },
//   ],
//   filters: [
//     {
//       label: "Role",
//       accessor: "role",
//       options: {
//         "Sales rep": "sales-rep",
//         "Production manager": "production-manager",
//       },
//     },
//   ],
//   actions: [
//     {
//       label: "View",
//       className: "bg-blue-500 text-white p-2 rounded-lg",
//       onClick: (item) => {
//         setSelectedUserId(item._id);
//         setIsViewModal(true);
//       },
//     },
//     {
//       label: "Delete",
//       className: "bg-red-500 text-white p-2 rounded-lg",
//       modal: true,
//       modalTitle: "Delete User",
//       modalMessage: (item) =>
//         `Are you sure you want to delete ${item.fullName}?`,
//       onConfirm: (item) => deleteUser(item._id),
//     },
//   ],
//   totalItems: totalItems,
//   currentPage: params.page,
//   itemsPerPage: params.limit,
//   sortKey: params.sortKey,
//   sortOrder: params.sortOrder,
//   onPageChange: (page) => setParams((p) => ({ ...p, page })),
//   onSearch: (search) => setParams((p) => ({ ...p, search, page: 1 })),
//   onFilterChange: (key, value) =>
//     setParams((p) => ({
//       ...p,
//       page: 1,
//       filters: { ...p.filters, [key]: value },
//     })),
//   onSortChange: (sortKey, sortOrder) =>
//     setParams((p) => ({ ...p, sortKey, sortOrder })),
// };
// <DataTable title="Users" data={users} config={tableConfig} />;
