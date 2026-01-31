import React from 'react';

// Estimated Price Component
const EstimatedPrice = ({ price }) => (
  <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
    <span className="text-xl font-semibold">Estimated Price</span>
    <div className="flex items-center space-x-2">
      <span className="text-2xl font-bold text-blue-600">${price}</span>
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14V10m0 0L9 12m3-2l3 2m1 10H4a2 2 0 01-2-2V4a2 2 0 012-2h16a2 2 0 012 2v16a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
      </svg>
    </div>
  </div>
);

// Job Status Component
const JobStatus = ({ status, steps }) => (
  <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
    <span className="text-xl font-semibold">Job Status</span>
    <div className="flex items-center space-x-4">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center space-x-2">
          <span className={`w-5 h-5 rounded-full ${step.completed ? 'bg-blue-600' : 'bg-gray-300'}`}></span>
          <span className={`${step.completed ? 'text-blue-600' : 'text-gray-600'}`}>{step.name}</span>
          {index < steps.length - 1 && <span className="text-gray-500">→</span>}
        </div>
      ))}
    </div>
  </div>
);

// Client Info Component
const ClientInfo = ({ name, contact }) => (
  <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
    <div className="flex items-center space-x-4">
      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
        <span className="text-xl text-gray-700">{name[0]}</span>
      </div>
      <div>
        <p className="text-xl font-semibold">{name}</p>
        <p className="text-gray-600">{contact}</p>
      </div>
    </div>
  </div>
);

// Main JobInfo Component
const JobInfo = () => {
  const steps = [
    { name: 'Scheduled', completed: true },
    { name: 'In Progress', completed: true },
    { name: 'Pending', completed: false },
    { name: 'Close', completed: false },
  ];

  return (
    <div className="w-full p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Estimated Price */}
        <EstimatedPrice price="5000" />
        
        {/* Job Status */}
        <JobStatus status="In Progress" steps={steps} />
        
        {/* Client Info */}
        <ClientInfo name="Jane Smith" contact="(555) 123-4567" />
      </div>
    </div>
  );
};

export default JobInfo;
