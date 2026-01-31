import React, { useState } from 'react'

const ExpensesData = () => {

     const [activeFilter, setActiveFilter] = useState('Week');
    
      const filters = ['Week', 'Month', 'Year', 'All Clusters'];
    
      const data = [
        { title: 'Total Leads', value: '$145,230', change: '+12%', color: 'text-green-500' },
        { title: 'Total Quotes', value: '120', change: '+8%', color: 'text-green-500' },
        { title: 'Booked Jobs', value: '100', change: '-3%', color: 'text-red-500' },
        { title: 'DC Pending', value: '34', change: 'Pending', color: 'text-yellow-500' },
      
      ];
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
                  salesRep: "All Sales Reps",
                  status: "All Statuses",
                  timeRange: "All Time Ranges",
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
              value={filters.status}
              onChange={(e) => handleFilterChange(e, "status")}
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
  )
}

export default ExpensesData
