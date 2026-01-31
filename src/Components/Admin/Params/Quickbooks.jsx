import React from "react";

function Quickbooks() {
  const formatLastSync = (date) => {
    return date.toLocaleString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };
  const handleDisconnect = () => {
    if (
      window.confirm(
        "Are you sure you want to disconnect from QuickBooks? This will stop automatic syncing."
      )
    ) {
      setIsConnected(false);
      //console.log("QuickBooks disconnected");
    }
  };

  const handleConnect = () => {
    // Simulate OAuth connection flow
    setTimeout(() => {
      setIsConnected(true);
      setLastSync(new Date());
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
      //console.log("QuickBooks connected");
    }, 1000);
  };

  const handleSyncNow = () => {
    if (!isConnected) return;

    setIsSyncing(true);

    // Simulate sync operation
    setTimeout(() => {
      setLastSync(new Date());
      setIsSyncing(false);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
      //console.log("Synced at:", new Date().toISOString());
    }, 2000);
  };
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div>
        <h2 className="mb-1 text-lg font-semibold text-gray-900">
          QuickBooks Integration Status
        </h2>
        <p className="mb-4 text-sm text-gray-600">
          Manage your QuickBooks Online connection
        </p>

        {isConnected ? (
          <div className="p-4 mb-4 border border-green-200 rounded-lg bg-green-50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="w-2 h-2 mr-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-900">
                  Integration Status: Connected
                </span>
              </div>
              <span className="px-3 py-1 text-xs font-medium text-white bg-green-500 rounded-full">
                Active
              </span>
            </div>
            <p className="text-xs text-green-700">
              Last Sync: {formatLastSync(lastSync)}
            </p>
          </div>
        ) : (
          <div className="p-4 mb-4 border border-yellow-200 rounded-lg bg-yellow-50">
            <div className="flex items-center mb-2">
              <div className="w-2 h-2 mr-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm font-medium text-yellow-900">
                Integration Status: Disconnected
              </span>
            </div>
            <p className="text-xs text-yellow-700">
              Connect to QuickBooks to enable automatic syncing
            </p>
          </div>
        )}

        <div className="flex justify-between">
          {isConnected ? (
            <button
              onClick={handleDisconnect}
              className="flex items-center px-4 py-2 font-medium text-red-600 transition-colors border border-red-300 rounded-md hover:bg-red-50"
            >
              <X className="w-4 h-4 mr-2" />
              Disconnect
            </button>
          ) : (
            <button
              onClick={handleConnect}
              className="flex items-center px-4 py-2 font-medium text-white transition-colors bg-green-500 rounded-md hover:bg-green-600"
            >
              <Check className="w-4 h-4 mr-2" />
              Connect to QuickBooks
            </button>
          )}

          <div className="flex space-x-3">
            <button
              onClick={handleSyncNow}
              disabled={!isConnected || isSyncing}
              className={`flex items-center px-4 py-2 rounded-md font-medium transition-colors ${isConnected && !isSyncing
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isSyncing ? "animate-spin" : ""}`}
              />
              {isSyncing ? "Syncing..." : "Sync Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Quickbooks;
