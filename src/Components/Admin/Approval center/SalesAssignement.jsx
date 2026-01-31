import React, { useState } from "react";
import SalesRepresentativeModal from "./SalesRepresentativeModal";
import { useGetAllClientsQuery } from "../../../redux/api/clientApi";
import { useGetAllUsersQuery } from "../../../redux/api/userApi";

function SalesAssignement() {
  const [open, setOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  const { data: clientData, isLoading: clientsLoading } = useGetAllClientsQuery(
    { filters: { salesRepId: null } }
  );
  const leadAssignmentData = clientData?.data || [];
  //console.log("Salesassignment", leadAssignmentData);
  const isLoading = clientsLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-6">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 section-pad border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
              Lead Assignment Approvals
            </h2>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-max w-full">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-xs font-semibold text-left text-gray-700 uppercase">
                Lead ID
              </th>
              <th className="px-4 sm:px-6 py-3 text-xs font-semibold text-left text-gray-700 uppercase">
                Client Name
              </th>
              <th className="px-4 sm:px-6 py-3 text-xs font-semibold text-left text-gray-700 uppercase">
                Phone Number
              </th>
              <th className="px-4 sm:px-6 py-3 text-xs font-semibold text-left text-gray-700 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {leadAssignmentData.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 sm:px-6 py-4 text-sm text-gray-800">
                  {item.customClientId}
                </td>
                <td className="px-4 sm:px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    <span className="text-sm text-gray-800">
                      {item.clientName}
                    </span>
                  </div>
                </td>
                <td className="px-4 sm:px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    <span className="text-sm text-gray-800">
                      {item.phoneNumber}
                    </span>
                  </div>
                </td>
                {/* <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium`}
                  >
                    {item.status}
                  </span>
                </td> */}
                <td className="px-4 sm:px-6 py-4">
                  <div className="flex gap-2">
                    {item.salesRepId ? (
                      // Show the sales rep name
                      <span className="px-4 py-2 text-sm font-medium text-gray-800 bg-gray-100 rounded">
                        {item.salesRepId.fullName}
                      </span>
                    ) : (
                      // Show Assign button if no rep assigned
                      <button
                        onClick={() => {
                          setSelectedLead(item); // if you have a selectedLead state for modal
                          setOpen(true);
                        }}
                        className="px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-500 rounded hover:bg-blue-600"
                      >
                        Assign
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <SalesRepresentativeModal
        isOpen={open}
        onClose={() => setOpen(false)}
        lead={selectedLead}
      />
    </div>
  );
}

export default SalesAssignement;
