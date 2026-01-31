import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetQuoteByIdQuery,
  useUpdateQuoteMutation,
} from "../../../redux/api/quoteApi";
import toast from "react-hot-toast";

const AdminQuoteDetails = () => {
  const { quoteId } = useParams();
  const navigate = useNavigate();

  const { data: quoteData, isLoading } = useGetQuoteByIdQuery(quoteId);
  const [updateQuote, { isLoading: isUpdating }] = useUpdateQuoteMutation();

  const quote = quoteData?.data;

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [bidSheetFile, setBidSheetFile] = useState(null);

  /* ---------------- Init editable data ---------------- */
  useEffect(() => {
    if (quote) {
      setFormData({
        estimatedPrice: quote.estimatedPrice,
        expiryDate: quote.expiryDate?.split("T")[0],
        notes: Array.isArray(quote.notes) ? "" : quote.notes || "",
        status: quote.status,
        bookedOnSpot: quote.bookedOnSpot,
      });
      setBidSheetFile(null); // reset file on load
    }
  }, [quote]);

  /* ---------------- Handlers ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBidSheetChange = (e) => {
    const file = e.target.files[0];
    if (file) setBidSheetFile(file);
  };

  const handleSave = async () => {
    try {
      const payload = new FormData();

      // append text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          payload.append(key, value);
        }
      });

      // append file ONLY if changed
      if (bidSheetFile) {
        payload.append("bidSheet", bidSheetFile);
      }
      payload.append("_dummy", "true");
      // ✅ correct debug
      for (let [key, value] of payload.entries()) {
        //console.log(key, value);
      }

      await updateQuote({
        id: quote._id,
        body: payload,
      }).unwrap();
      toast.success("Quote updated successfully")
      setIsEditing(false);
      setBidSheetFile(null);
    } catch (err) {
      console.error("Update failed", err);
      toast.error("Failed to update quote")

    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setBidSheetFile(null);
    setFormData({
      estimatedPrice: quote.estimatedPrice,
      expiryDate: quote.expiryDate?.split("T")[0],
      notes: quote.notes || "",
      status: quote.status,
      bookedOnSpot: quote.bookedOnSpot,
    });
  };

  const handleConvertToJob = () => {
    navigate(`/s/sales-rep/jobs/create-job/${quote._id}`);
  };

  if (isLoading || !quote) {
    return <div className="p-6">Loading...</div>;
  }

  const {
    clientId,
    estimatedPrice,
    expiryDate,
    notes,
    status,
    bookedOnSpot,
    bidSheet,
    createdAt,
    customQuoteId,
  } = quote;

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen page-container">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
            Quote Details
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            <strong>Quote ID:</strong> {customQuoteId}
          </p>
        </div>

        {/* Summary */}
        <div className="bg-white border rounded-lg section-pad">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Client</p>
              <p className="font-semibold">{clientId.clientName}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Estimated Price</p>
              {isEditing ? (
                <input
                  type="number"
                  name="estimatedPrice"
                  value={formData.estimatedPrice}
                  onChange={handleChange}
                  className="border rounded px-3 py-2 w-full text-sm sm:text-base"
                />
              ) : (
                <p className="font-semibold text-green-600">
                  ${estimatedPrice}
                </p>
              )}
            </div>

            <div>
              <p className="text-sm text-gray-500">Quote Date</p>
              <p>{new Date(createdAt).toLocaleDateString()}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Status</p>
              {isEditing ? (
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="border rounded px-3 py-2 text-sm sm:text-base"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              ) : (
                <span className="font-medium">{status}</span>
              )}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="bg-white border rounded-lg section-pad">
          <div className="mb-4">
            <p className="text-sm text-gray-500">Expiry Date</p>
            {isEditing ? (
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                className="border rounded px-3 py-2 text-sm sm:text-base"
              />
            ) : (
              <p>{new Date(expiryDate).toLocaleDateString()}</p>
            )}
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-500">Booked on the spot</p>
            <p>{bookedOnSpot === "true" ? "Yes" : "No"}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Notes</p>
            {isEditing ? (
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className="border rounded p-3 w-full text-sm sm:text-base"
              />
            ) : (
              <>
                {Array.isArray(notes) ? (
                  notes.length ? (
                    <ul className="list-disc list-inside space-y-1">
                      {notes.map((note) => (
                        <li key={note._id || note.id}>
                          {note.note || note.text || "-"}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>-</p>
                  )
                ) : (
                  <p>{notes || "-"}</p>
                )}
              </>
            )}
          </div>
        </div>

        {/* Bid Sheet */}
        <div className="bg-white border rounded-lg section-pad">
          <h3 className="font-semibold mb-3">Bid Sheet</h3>

          {bidSheet && !isEditing && (
            <a
              href={bidSheet}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              View Current Bid Sheet
            </a>
          )}

          {isEditing && (
            <div className="space-y-2">
              {bidSheet && (
                <p className="text-sm text-gray-600">
                  Current file will be replaced if you upload a new one
                </p>
              )}

              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="w-full text-sm sm:text-base"
                onChange={handleBidSheetChange}
              />

              {bidSheetFile && (
                <p className="text-sm text-green-600">
                  Selected: {bidSheetFile.name}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={isUpdating}
                className="w-full sm:flex-1 bg-blue-600 text-white py-2.5 sm:py-3 rounded text-sm sm:text-base"
              >
                {isUpdating ? "Saving..." : "Save"}
              </button>
              <button
                onClick={handleCancel}
                className="w-full sm:flex-1 border py-2.5 sm:py-3 rounded text-sm sm:text-base"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              {/* <button
                onClick={handleConvertToJob}
                className="flex-1 bg-green-600 text-white py-3 rounded"
              >
                Convert to Job
              </button> */}
              <button
                onClick={() => setIsEditing(true)}
                className="w-full sm:flex-1 border py-2.5 sm:py-3 rounded text-sm sm:text-base"
              >
                Edit Quote
              </button>
              <button className="w-full sm:flex-1 bg-red-600 text-white py-2.5 sm:py-3 rounded text-sm sm:text-base">
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminQuoteDetails;
