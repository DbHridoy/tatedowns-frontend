import { useState } from "react";

const ExpensesData = () => {
  const [filters, setFilters] = useState({
    salesRep: "All Representatives",
    timeRange: "This Month",
    cluster: "All Clusters",
  });

  const handleFilterChange = (event, key) => {
    setFilters((current) => ({
      ...current,
      [key]: event.target.value,
    }));
  };

  return (
    <div>
      <div className="p-6 mb-2 border rounded-lg shadow-sm">
        <div className="flex justify-between mb-4 ">
          <div>
            <h3 className="mb-4 font-semibold">Filters</h3>
          </div>
          <div>
            <button
              className="text-blue-500"
              onClick={() =>
                setFilters({
                  salesRep: "All Representatives",
                  timeRange: "This Month",
                  cluster: "All Clusters",
                })
              }
            >
              Reset All
            </button>
          </div>
        </div>
        <div className="flex justify-between">
          <div>
            <p className="text-[16px] mb-2"> Sales Rep</p>
            <select
              value={filters.salesRep}
              onChange={(e) => handleFilterChange(e, "salesRep")}
              className="px-4 py-2 border rounded-md"
            >
              <option>All Representatives</option>
              <option>Rep A</option>
              <option>Rep B</option>
              <option>Rep C</option>
            </select>
          </div>

          <div>
            <p className="text-[16px] mb-2"> Time Range</p>
            <select
              value={filters.timeRange}
              onChange={(e) => handleFilterChange(e, "timeRange")}
              className="p-2 border rounded-md"
            >
              <option>This Month</option>
              <option>New</option>
              <option>In progress</option>
              <option>Closed</option>
              <option>Pending</option>
              <option>Completed</option>
            </select>
          </div>

          <div>
            <p className="text-[16px] mb-2"> Cluster</p>
            <select
              value={filters.cluster}
              onChange={(e) => handleFilterChange(e, "cluster")}
              className="p-2 border rounded-md"
            >
              <option>All Clusters</option>
              <option>North Shore</option>
              <option>Inner West</option>
              <option>Eastern Suburbs</option>
            </select>
          </div>

          <div>
            Apply Filter
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpensesData;
