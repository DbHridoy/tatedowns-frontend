import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import AddCallLog from "./AddCallLog";
import {
  useGetClientByIdQuery,
  useUpdateClientMutation,
  useAddCallLogMutation,
  useAddNoteMutation,
} from "../../../redux/api/clientApi";

/* -------------------- Utils -------------------- */
const isImageFile = (url) => {
  if (!url) return false;
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
};

const getFileNameFromUrl = (url) => {
  try {
    return decodeURIComponent(url.split("/").pop().split("?")[0]);
  } catch {
    return "Download file";
  }
};

/* -------------------- Component -------------------- */
const ClientDetails = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError, refetch } = useGetClientByIdQuery(
    clientId,
    { skip: !clientId }
  );

  const [updateClient] = useUpdateClientMutation();
  const [addCallLog] = useAddCallLogMutation();
  const [addNote] = useAddNoteMutation();

  const client = data?.data;

  /* -------------------- State -------------------- */
  const [isEditing, setIsEditing] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);

  const [form, setForm] = useState({
    clientName: "",
    email: "",
    phoneNumber: "",
    address: "",
    leadSource: "",
    rating: 0,
  });

  const [noteText, setNoteText] = useState("");
  const [noteFile, setNoteFile] = useState(null);

  const leadSources = ["Door to Door", "Inbound", "Social"];

  /* -------------------- Sync API → Form -------------------- */
  useEffect(() => {
    if (!client) return;

    setForm({
      clientName: client.clientName || "",
      email: client.email || "",
      phoneNumber: client.phoneNumber || "",
      address: client.address || "",
      leadSource: client.leadSource || "",
      rating: client.rating || 0,
    });
  }, [client]);

  /* -------------------- Handlers -------------------- */
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveClient = async () => {
    try {
      await updateClient({ id: clientId, ...form }).unwrap();
      toast.success("Client updated");
      setIsEditing(false);
      refetch();
    } catch {
      toast.error("Failed to update client");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (!client) return;

    setForm({
      clientName: client.clientName || "",
      email: client.email || "",
      phoneNumber: client.phoneNumber || "",
      address: client.address || "",
      leadSource: client.leadSource || "",
      rating: client.rating || 0,
    });
  };

  const handleAddNote = async () => {
    if (!noteText.trim()) return;

    const formData = new FormData();
    formData.append("note", noteText);
    if (noteFile) formData.append("file", noteFile);

    try {
      await addNote({
        clientId,
        formData, // ✅ must match API
      }).unwrap();

      toast.success("Note added");
      setNoteText("");
      setNoteFile(null);
      refetch();
    } catch (err) {
      toast.error("Failed to add note");
    }
  };

  /* -------------------- UI States -------------------- */
  if (isLoading) return <div className="p-6">Loading...</div>;
  if (isError || !client)
    return <div className="p-6">Failed to load client</div>;

  /* -------------------- Render -------------------- */
  return (
    <div className="page-container space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
            {client.clientName}
          </h1>
          <p className="text-sm sm:text-base text-gray-500">
            Client ID: {client.customClientId || "—"}
          </p>
          <p className="text-sm sm:text-base text-gray-500">
            Created At:{" "}
            {client.createdAt
              ? new Date(client.createdAt).toLocaleDateString()
              : "—"}
          </p>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded text-sm sm:text-base"
          >
            Edit
          </button>
        ) : (
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleSaveClient}
              className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded text-sm sm:text-base"
            >
              Save
            </button>
            <button
              onClick={handleCancelEdit}
              className="w-full sm:w-auto px-4 py-2 bg-gray-500 text-white rounded text-sm sm:text-base"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Client Information */}
      <div className="bg-white section-pad rounded shadow space-y-4">
        <h3 className="font-semibold">Client Information</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            ["Name", "clientName"],
            ["Email", "email"],
            ["Phone", "phoneNumber"],
            ["Address", "address"],
          ].map(([label, field]) => (
            <div key={field} className="sm:col-span-1">
              <label className="block text-sm font-medium mb-1">{label}</label>
              <input
                type={field === "email" ? "email" : "text"}
                value={form[field]}
                disabled={!isEditing}
                onChange={(e) => handleChange(field, e.target.value)}
                className={`w-full p-2 border rounded text-sm sm:text-base ${
                  !isEditing ? "bg-gray-100" : ""
                }`}
              />
            </div>
          ))}
        </div>

        {/* Lead Source */}
        <div>
          <label className="block text-sm font-medium mb-1">Lead Source</label>
          <select
            value={form.leadSource}
            disabled={!isEditing}
            onChange={(e) => handleChange("leadSource", e.target.value)}
            className={`w-full border px-3 py-2 rounded text-sm sm:text-base ${
              !isEditing ? "bg-gray-100" : ""
            }`}
          >
            <option value="">Select</option>
            {leadSources.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium mb-2">Lead Rating</label>
          <div className="flex flex-wrap items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                disabled={!isEditing}
                onClick={() => handleChange("rating", star)}
                className={`text-xl sm:text-2xl ${
                  !isEditing ? "cursor-not-allowed" : ""
                }`}
              >
                {star <= form.rating ? "★" : "☆"}
              </button>
            ))}
            <span className="text-sm text-gray-600">{form.rating}/5</span>
          </div>
        </div>
      </div>

      {/* Call History */}
      <div className="bg-white section-pad rounded shadow space-y-3">
        <h3 className="font-semibold">Call History</h3>

        {client.callLogs?.length === 0 && (
          <p className="text-gray-400 italic">No call logs</p>
        )}

        {client.callLogs?.map((log) => (
          <div key={log._id} className="border-b pb-2">
            <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
              <span>{log.status}</span>
              <span className="text-sm text-gray-500">
                {new Date(log.callAt).toLocaleDateString()}
              </span>
            </div>

            {log.note && <p className="text-sm">{log.note}</p>}

            {log.reason && (
              <p className="text-sm text-gray-600 italic">
                <b>Reason:</b> {log.reason}
              </p>
            )}
          </div>
        ))}

        <button
          onClick={() => setShowCallModal(true)}
          className="w-full border-dashed border p-2 rounded text-sm sm:text-base text-gray-600"
        >
          Add Call Log
        </button>
      </div>

      {/* Notes */}
      <div className="bg-white section-pad rounded shadow space-y-4">
        <h3 className="font-semibold">Notes & Attachments</h3>

        <textarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Add note..."
          className="w-full border p-2 rounded text-sm sm:text-base"
        />

        <input
          type="file"
          className="w-full text-sm sm:text-base"
          onChange={(e) => setNoteFile(e.target.files?.[0] || null)}
        />

        <button
          onClick={handleAddNote}
          className="w-full bg-gray-100 p-2 rounded text-sm sm:text-base"
        >
          Add Note
        </button>

        {client.notes?.length > 0 ? (
          <div className="space-y-3">
            {client.notes.map((note) => (
              <div
                key={note._id}
                className="border rounded-lg p-3 bg-gray-50 space-y-2"
              >
                <p className="text-sm">{note.note || "—"}</p>

                {note.file && (
                  <div>
                    {isImageFile(note.file) ? (
                      <img
                        src={note.file}
                        alt="Attachment"
                        className="w-full rounded border"
                      />
                    ) : (
                      <a
                        href={note.file}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline text-sm"
                      >
                        📎 {getFileNameFromUrl(note.file)}
                      </a>
                    )}
                  </div>
                )}

                {note.createdAt && (
                  <div className="text-xs text-gray-500">
                    {new Date(note.createdAt).toLocaleString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 italic">No notes added yet</p>
        )}
      </div>

      {showCallModal && (
        <AddCallLog
          clientId={clientId}
          closeModal={() => {
            setShowCallModal(false);
            refetch();
          }}
          onSubmit={async (payload) => {
            await addCallLog(payload).unwrap();
            toast.success("Call log added");
            setShowCallModal(false);
            refetch();
          }}
        />
      )}
    </div>
  );
};

export default ClientDetails;
