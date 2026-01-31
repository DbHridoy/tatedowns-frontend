import { FiClock, FiFileText, FiUsers, FiBriefcase } from 'react-icons/fi';
import React, { useState } from 'react';

const ReportsData = () => {
  const [activeFilter, setActiveFilter] = useState('Week');

  const filters = ['Week', 'Month', 'Year', 'All Clusters'];

  const data = [
    {
      title: 'Total Leads',
      value: '$145,230',
      change: '+12%',
      color: 'text-green-500',
      icon: FiUsers,
    },
    {
      title: 'Total Quotes',
      value: '120',
      change: '+8%',
      color: 'text-green-500',
      icon: FiFileText,
    },
    {
      title: 'Booked Jobs',
      value: '100',
      change: '-3%',
      color: 'text-red-500',
      icon: FiBriefcase,
    },
    {
      title: 'DC Pending',
      value: '34',
      change: 'Pending',
      color: 'text-yellow-500',
      icon: FiClock,
    },
  ];

  return (
    <div className="p-6">

      {/* Cards Grid */}
      <div className="grid grid-cols-4 gap-4">
        {data.map((item, index) => (
          <div
            key={index}
            className='flex justify-between p-6 bg-white rounded-lg shadow-md'
          >
            <div>
              <div className="w-[52px] h-[52px] flex items-center justify-center bg-blue-100 rounded-lg mb-4">
                {item.icon ? <item.icon className="w-6 h-6 text-blue-600" /> : null}
              </div>
              <div className="text-sm text-gray-500">{item.title}</div>
              <div className="mt-2 text-xl font-bold">{item.value}</div>
            </div>
            <div>
              {item.change && (
                <div className={`mt-1 text-sm ${item.color}`}>
                  {item.change}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportsData;
