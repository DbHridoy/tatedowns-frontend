import React from 'react';

const RecentJobActivity = () => {
  const jobs = [
    {
      id: 'J12345',
      client: 'John Doe',
      status: 'Ready to Schedule',
      time: '2 hours ago',
      statusColor: 'bg-blue-100 text-blue-700'
    },
    {
      id: 'J12344',
      client: 'Sarah Williams',
      status: 'Scheduled & Open',
      time: '5 hours ago',
      statusColor: 'bg-green-100 text-green-700'
    },
    {
      id: 'J12343',
      client: 'Michael Brown',
      status: 'Pending close',
      time: '1 day ago',
      statusColor: 'bg-yellow-100 text-yellow-700'
    }
  ];

  return (
    <div className="p-6 mx-auto ">
      <h1 className="mb-6 text-2xl font-semibold text-gray-800">Recent Job Activity</h1>
      
      <div className="space-y-4">
        {jobs.map((job) => (
          <div key={job.id} className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`px-3 py-1 rounded text-sm font-medium ${job.statusColor}`}>
                    {job.status}
                  </span>
                  <span className="text-sm text-gray-500">{job.time}</span>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-900">
                    Job ID: {job.id}
                  </p>
                  <p className="text-sm text-gray-600">
                    Client: {job.client}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3 ml-6">
                <button className="px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700">
                  Job Detail
                </button>
                <button className="px-4 py-2 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                  Update Status
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentJobActivity;