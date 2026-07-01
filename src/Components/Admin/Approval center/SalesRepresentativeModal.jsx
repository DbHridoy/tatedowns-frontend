import React, { useState, useMemo } from "react";
import {
  useGetAllClustersQuery,
  useGetAllUsersQuery,
} from "../../../redux/api/userApi";
import { useUpdateClientMutation } from "../../../redux/api/clientApi";
import SimpleLoader from "../../Common/SimpleLoader";

export default function SalesRepresentativeModal({ isOpen, onClose, lead }) {
  const [search, setSearch] = useState("");
  const [selectedCluster, setSelectedCluster] = useState("All Clusters");

  const [updateClient, { isLoading: updating }] =
    useUpdateClientMutation();

  const { data: clustersData } = useGetAllClustersQuery();
  const clusters = clustersData?.data ?? [];

  const { data: user, isLoading } = useGetAllUsersQuery({
    page: 1,
    limit: 0,
    filters: { role: "Sales Rep" },
  });

  const users = user?.data || [];

  const filteredReps = useMemo(() => {
    const searchValue = search.toLowerCase();
    return users.filter((rep) => {
      const fullName = (rep.fullName || "").toLowerCase();
      const email = (rep.email || "").toLowerCase();
      const matchesCluster =
        selectedCluster === "All Clusters" || rep.cluster === selectedCluster;
      const matchesSearch =
        fullName.includes(searchValue) || email.includes(searchValue);
      return matchesCluster && matchesSearch;
    });
  }, [users, search, selectedCluster]);

  const handleAssignSalesRep = async (rep) => {
    if (!lead?._id) return;

    try {
      await updateClient({
        id: lead._id,
        salesRepId: rep._id,
      }).unwrap();

      onClose();
    } catch (error) {
      console.error("Failed to assign sales rep:", error);
    }
  };

  if (!isOpen) return null;

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-6 w-[92vw] sm:w-full sm:max-w-md md:max-w-lg lg:max-w-xl">
          <SimpleLoader className="min-h-[120px] border-0 p-0" />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-[92vw] sm:w-full sm:max-w-md md:max-w-lg lg:max-w-xl rounded-xl p-5 sm:p-6 shadow-lg">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl font-semibold">
            Sales Representative
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            ✕
          </button>
        </div>

        {/* Filters */}
        <div className="space-y-3 mb-4">
          <select
            value={selectedCluster}
            onChange={(e) => setSelectedCluster(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-sm sm:text-base"
          >
            <option value="All Clusters">All Clusters</option>
            {clusters.map((cluster) => (
              <option key={cluster._id} value={cluster.clusterName}>
                {cluster.clusterName}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search sales rep..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-sm sm:text-base"
          />
        </div>

        {/* List */}
        <div className="max-h-64 overflow-y-auto space-y-2">
          {filteredReps.length > 0 ? (
            filteredReps.map((rep) => (
              <div
                key={rep._id}
                onClick={() => handleAssignSalesRep(rep)}
                className="p-3 rounded-md border hover:bg-gray-100 cursor-pointer"
              >
                <p className="font-medium text-sm sm:text-base">
                  {rep.fullName}
                </p>
                <p className="text-sm text-gray-500">{rep.email}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4 text-sm sm:text-base">
              No representatives found.
            </p>
          )}
        </div>

        {updating && (
          <p className="text-sm text-center text-blue-500 mt-3">
            Assigning sales rep...
          </p>
        )}
      </div>
    </div>
  );
}
