export const getLeadSourceColor = (source) => {
  switch (source) {
    case "Door":
      return "bg-blue-100 text-blue-800";
    case "Inbound":
      return "bg-green-100 text-green-800";
    case "Social":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getCallStatusColor = (status) => {
  switch (status) {
    case "Not Called":
      return "bg-gray-100 text-gray-800";
    case "Picked-Up Yes":
      return "bg-green-100 text-green-800";
    case "Picked-Up No":
      return "bg-red-100 text-red-800";
    case "No Pickup":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Map raw API client data to usable format
export const mapClientData = (client) => ({
  id: client._id,
  name: client.clientName,
  partnerName: client.partnerName,
  phone: client.phoneNumber,
  email: client.email,
  leadSource: client.source,
  leadSourceColor: getLeadSourceColor(client.source),
  callStatus: client.callStatus,
  callStatusColor: getCallStatusColor(client.callStatus),
  rating: client.rating,
  ratingCount: client.note?.length || 0, // Or use callLogs length if needed
});


export default {
  getLeadSourceColor,
  getCallStatusColor,
  mapClientData
};
