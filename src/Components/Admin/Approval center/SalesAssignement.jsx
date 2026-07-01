import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SalesRepresentativeModal from "./SalesRepresentativeModal";
import { useGetAllClientsQuery } from "../../../redux/api/clientApi";
import SimpleLoader from "../../Common/SimpleLoader";

function SalesAssignement() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  const { data: clientData, isLoading: clientsLoading } = useGetAllClientsQuery(
    { filters: { salesRepId: null } }
  );
  const leadAssignmentData = (clientData?.data || []).filter(
    (client) => client?.leadStatus === "Not quoted"
  );
  //console.log("Salesassignment", leadAssignmentData);
  const isLoading = clientsLoading;

  if (isLoading) {
    return <SimpleLoader />;
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
                Email
              </th>
              <th className="px-4 sm:px-6 py-3 text-xs font-semibold text-left text-gray-700 uppercase">
                Lead Source
              </th>
              <th className="px-4 sm:px-6 py-3 text-xs font-semibold text-left text-gray-700 uppercase">
                Call Status
              </th>
              <th className="px-4 sm:px-6 py-3 text-xs font-semibold text-left text-gray-700 uppercase">
                Created At
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
                <td className="px-4 sm:px-6 py-4 text-sm text-gray-800">
                  {item.email || "—"}
                </td>
                <td className="px-4 sm:px-6 py-4 text-sm text-gray-800">
                  {item.leadSource || "—"}
                </td>
                <td className="px-4 sm:px-6 py-4 text-sm text-gray-800">
                  {item.callStatus || "—"}
                </td>
                <td className="px-4 sm:px-6 py-4 text-sm text-gray-800">
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString()
                    : "—"}
                </td>
                <td className="px-4 sm:px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/admin/leads/${item._id}`)}
                      className="px-4 py-2 text-sm font-medium text-white transition-colors bg-indigo-500 rounded hover:bg-indigo-600"
                    >
                      View
                    </button>
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
