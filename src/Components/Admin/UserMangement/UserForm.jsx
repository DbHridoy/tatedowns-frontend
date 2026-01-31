import { useState, useEffect } from "react";
import {
  useCreateClusterMutation,
  useGetAllClustersQuery,
} from "../../../redux/api/userApi";

const UserForm = ({ formUser, setFormUser, isAdd }) => {
  // Fetch clusters
  const { data: clustersData, isLoading } = useGetAllClustersQuery();
  const [clusters, setClusters] = useState([]);

  useEffect(() => {
    if (clustersData?.data) setClusters(clustersData.data);
  }, [clustersData]);

  const [createCluster, { isLoading: isCreating }] = useCreateClusterMutation();
  const [showAddCluster, setShowAddCluster] = useState(false);
  const [newCluster, setNewCluster] = useState("");

  const handleAddCluster = async () => {
    if (!newCluster.trim()) return;

    try {
      // Call mutation with the body { clusterName }
      const res = await createCluster(newCluster.trim()).unwrap();

      // Add the new cluster to local state for immediate dropdown update
      setClusters((prev) => [...prev, res.data]);

      // Select the newly created cluster
      setFormUser({ ...formUser, cluster: res.data.clusterName });

      // Reset input
      setNewCluster("");
      setShowAddCluster(false);
    } catch (err) {
      console.error("Failed to create cluster:", err);
    }
  };

  return (
    <div className="space-y-3">
      <input
        className="w-full p-2 border rounded text-sm sm:text-base"
        placeholder="Full Name"
        value={formUser.fullName}
        onChange={(e) =>
          setFormUser({ ...formUser, fullName: e.target.value })
        }
      />

      <input
        className="w-full p-2 border rounded text-sm sm:text-base"
        placeholder="Email"
        type="email"
        value={formUser.email}
        onChange={(e) =>
          setFormUser({ ...formUser, email: e.target.value })
        }
      />

      <select
        className="w-full p-2 border rounded text-sm sm:text-base"
        value={formUser.role}
        onChange={(e) =>
          setFormUser({ ...formUser, role: e.target.value, cluster: "" })
        }
      >
        <option value="">Select Role</option>
        <option value="Sales Rep">Sales Rep</option>
        <option value="Production Manager">Production Manager</option>
      </select>

      {/* Cluster Field */}
      {formUser.role === "Sales Rep" && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <select
              className="flex-1 p-2 border rounded text-sm sm:text-base"
              value={formUser.cluster}
              onChange={(e) =>
                setFormUser({ ...formUser, cluster: e.target.value })
              }
              disabled={isLoading}
            >
              <option value="">Select Cluster</option>
              {clusters.map((cluster) => (
                <option key={cluster._id} value={cluster.clusterName}>
                  {cluster.clusterName}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => setShowAddCluster((prev) => !prev)}
              className="px-3 border rounded bg-gray-100 hover:bg-gray-200 text-sm sm:text-base"
            >
              + Add
            </button>
          </div>

          {showAddCluster && (
            <div className="flex gap-2">
              <input
                className="flex-1 p-2 border rounded text-sm sm:text-base"
                placeholder="New cluster name"
                value={newCluster}
                onChange={(e) => setNewCluster(e.target.value)}
              />
              <button
                type="button"
                onClick={handleAddCluster}
                disabled={isCreating}
                className="px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 text-sm sm:text-base"
              >
                Save
              </button>
            </div>
          )}
        </div>
      )}

      {isAdd && (
        <input
          type="password"
          className="w-full p-2 border rounded text-sm sm:text-base"
          placeholder="Password"
          value={formUser.password}
          onChange={(e) =>
            setFormUser({ ...formUser, password: e.target.value })
          }
        />
      )}
    </div>
  );
};

export default UserForm;
