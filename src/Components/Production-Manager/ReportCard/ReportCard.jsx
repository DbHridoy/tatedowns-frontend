import React from 'react';
import { FiCheckCircle, FiClipboard, FiClock } from 'react-icons/fi';

const ReportCard = () => {
  const stats = [
    {
      id: 1,
      title: 'Total Jobs Assigned',
      value: '150',
      subtitle: 'Active assignments',
      icon: FiClipboard,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      id: 2,
      title: 'Pending Close',
      value: '150',
      subtitle: '60% of total jobs',
      icon: FiClock,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      id: 3,
      title: 'Jobs Completed',
      value: '$87',
      subtitle: '40% completion rate',
      icon: FiCheckCircle,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    }
  ];

  return (
    <div >
      <div >
        {/* Header */}
        <div className="mb-6">
          <h1 className="mb-1 text-2xl font-bold text-gray-900">Production Manager Report</h1>
          <p className="text-sm text-gray-600">Track job completion status and team performance metrics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div 
                key={stat.id}
                className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="mb-3 text-xs font-medium text-gray-500">
                      {stat.title}
                    </p>
                    <p className="mb-1 text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-500">
                      {stat.subtitle}
                    </p>
                  </div>
                  
                  <div className={`w-12 h-12 ${stat.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
export default ReportCard;
