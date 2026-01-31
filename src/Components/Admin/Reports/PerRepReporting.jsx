import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const PerRepReporting = () => {
  const navigate = useNavigate();
  const getStatusColor = (status) => {
    switch (status) {
      // case "New":
      //   return "bg-blue-200 text-blue-800";
      // case "In progress":
      //   return "bg-yellow-200 text-yellow-800";
      // case "Closed":
      //   return "bg-gray-200 text-gray-800";
      case "Pending":
        return "bg-orange-200 text-orange-800";
      case "Approved":
        return "bg-green-200 text-green-800";
      default:
        return "";
    }
  };
  // Initial filter state
  const [filters, setFilters] = useState({
    salesRep: "All Sales Reps",
    status: "All Statuses",
    timeRange: "All Time Ranges",
    cluster: "All Clusters",
  });

  // Dummy data
  const data = [
    {
      id: "L1234",
      clientName: "John Doe",
      cluster: "North Shore",
      salesRep: "Rep A",
      status: "Approved",
      startDate: "2025/11/25",
    },
    {
      id: "Q1234",
      clientName: "Jane Smith",
      cluster: "Inner West",
      salesRep: "Rep B",
      status: "Pending",
      startDate: "2025/11/24",
    },
    {
      id: "J1234",
      clientName: "Mark Johnson",
      cluster: "Eastern Suburbs",
      salesRep: "Rep C",
      status: "Approved",
      startDate: "2025/11/20",
    },
    {
      id: "L1234",
      clientName: "Sarah Williams",
      cluster: "North Shore",
      salesRep: "Rep D",
      status: "Pending",
      startDate: "2025/11/15",
    },
    {
      id: "J1234",
      clientName: "Robert Brown",
      cluster: "Inner West",
      salesRep: "Rep B",
      status: "Approved",
      startDate: "2025/11/10",
    },
    {
      id: "L5678",
      clientName: "Emily Davis",
      cluster: "North Shore",
      salesRep: "Rep A",
      status: "Approved",
      startDate: "2025/10/05",
    },
    {
      id: "Q5678",
      clientName: "Chris Lee",
      cluster: "Inner West",
      salesRep: "Rep B",
      status: "Pending",
      startDate: "2025/09/20",
    },
    // Add more dummy data as needed
  ];

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5; // Number of items per page

  // Filter logic
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      return (
        (filters.salesRep === "All Sales Reps" ||
          item.salesRep === filters.salesRep) &&
        (filters.status === "All Statuses" || item.status === filters.status) &&
        (filters.timeRange === "All Time Ranges" ||
          item.startDate >= "2025/01/01") && // You can modify this to handle different time ranges
        (filters.cluster === "All Clusters" || item.cluster === filters.cluster)
      );
    });
  }, [filters, data]);

  // Pagination calculation
  const indexOfLastItem = currentPage * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle filter change
  const handleFilterChange = (e, filterName) => {
    setFilters({ ...filters, [filterName]: e.target.value });
    setCurrentPage(1); // Reset to first page on filter change
  };

  return (
    <div className="p-6">
      <h1 className="mb-1 text-2xl">Per-Rep Reporting</h1>
      <p className="text-xs">Detailed breakdown by sales representative</p>
      {/* Table */}
      <table className="min-w-full mt-6 border-collapse table-auto">
        <thead>
          <tr className="bg-[#D9EBF8] ">
            <th className="px-6 py-3 text-left">ID</th>
            <th className="px-6 py-3 text-left">Client Name</th>
            <th className="px-6 py-3 text-left">Cluster</th>
            <th className="px-6 py-3 text-left">Sales Rep</th>
            <th className="px-6 py-3 text-left">Deduction Status</th>
            <th className="px-6 py-3 text-left">Start Date</th>
            <th className="px-6 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((job) => (
            <tr key={job.id} className="border-b">
              <td className="py-3 px-6 text-[#007CCD]">{job.id}</td>
              <td className="px-6 py-3">
                <div className="flex item-center gap-x-3">
                  <div className="w-[50px] h-[50px] rounded-full bg-[#C4C4C4]"></div>
                  <p className="mt-3"> {job.clientName}</p>
                </div>
              </td>
              <td className="px-6 py-3">{job.cluster}</td>
              <td className="px-6 py-3">{job.salesRep}</td>
              <td className="px-6 py-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                    job.status
                  )}`}
                >
                  {job.status}
                </span>
              </td>
              <td className="px-6 py-3">{job.startDate}</td>
              <td
                onClick={() => navigate(`/s/admin/reports-details`)}
                className="text-[#007CCD] underline cursor-pointer"
              >
                View Details
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/*======================= Pagination =======================*/}
      <div className="flex items-center justify-between mt-4">
        <span>
          Showing {indexOfFirstItem + 1}-{indexOfLastItem} of{" "}
          {filteredData.length} Jobs
        </span>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 rounded-md"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {[...Array(Math.ceil(filteredData.length / pageSize))].map(
            (_, index) => (
              <button
                key={index}
                className={`py-2 px-4 border rounded-md ${
                  currentPage === index + 1 ? "bg-blue-500 text-white" : ""
                }`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            )
          )}
          <button
            className="px-4 py-2 rounded-md"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === Math.ceil(filteredData.length / pageSize)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PerRepReporting;
