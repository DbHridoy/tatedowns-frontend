import { useState } from "react";
import AddExpense from "../../../Components/Sales-rep/Expenses/AddExpense";
import ExpenseCard from "../../../Components/Sales-rep/Expenses/ExpenseCard";
import { useGetAllMileageLogsQuery } from "../../../redux/api/expenseApi";
import DataTable from "../../../Components/Common/DataTable";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../redux/slice/authSlice";

function UserExpenses() {
  const user = useSelector(selectCurrentUser);
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    search: "",
    sortKey: "fullName",
    sortOrder: "asc",
    filters: { salesRepId: user?._id },
  });
  const { data: mileageLogs } = useGetAllMileageLogsQuery(params);

  const mileageLogsData = mileageLogs?.data ?? [];
  const totalItems = mileageLogs?.total ?? 0;

  const totalMiles = mileageLogsData.reduce(
    (sum, log) => sum + (Number(log.totalMilesDriven) || 0),
    0
  );
  const totalDeduction = mileageLogsData.reduce(
    (sum, log) => sum + (Number(log.deduction) || 0),
    0
  );

  const tableConfig = {
    columns: [
      { label: "No", accessor: "No" },
      { label: "Date", accessor: "createdAt", sortable: true },
      { label: "Total Miles Driven", accessor: "totalMilesDriven" },
      { label: "Deduction (USD)", accessor: "deduction" },
      { label: "Status", accessor: "status", colorMap: { "Pending": "bg-yellow-100 text-yellow-700 rounded-2xl text-center p-2", "Approved": "bg-green-100 text-green-800 rounded-2xl text-center p-2", "Rejected": "bg-red-100 text-red-700 rounded-2xl text-center p-2" } },
    ],
    filters: [],
    totalItems,
    currentPage: params.page,
    itemsPerPage: params.limit,
    sortKey: params.sortKey,
    sortOrder: params.sortOrder,
    showSearch: false,
    onPageChange: (page) => setParams((p) => ({ ...p, page })),
    onSearch: (search) => setParams((p) => ({ ...p, search, page: 1 })),
    onFilterChange: (key, value) =>
      setParams((p) => ({
        ...p,
        page: 1,
        filters: { ...p.filters, [key]: value },
      })),
    onSortChange: (sortKey, sortOrder) =>
      setParams((p) => ({ ...p, sortKey, sortOrder })),
  };

  return (
    <div className="page-container space-y-6">
      <AddExpense />
      <ExpenseCard totalMiles={totalMiles} totalDeduction={totalDeduction} />
      <DataTable
        title="Mileage Logs"
        data={mileageLogsData}
        config={tableConfig}
      />
    </div>
  );
}

export default UserExpenses;
