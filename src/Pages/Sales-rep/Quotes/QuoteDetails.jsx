import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetQuoteByIdQuery,
  useDeleteQuoteMutation,
  useUpdateQuoteMutation,
} from "../../../redux/api/quoteApi";
import toast from "react-hot-toast";
import SimpleLoader from "../../../Components/Common/SimpleLoader";
import DeleteModal from "../../../Components/Common/DeleteModal";

const getFileName = (url = "") => {
  const parts = decodeURIComponent(url).split("/");
  return parts[parts.length - 1] || "File";
};

const normalizeStatus = (value = "") => {
  const lowered = value.toString().toLowerCase();
  if (lowered === "pending") return "Pending";
  if (lowered === "approved") return "Approved";
  if (lowered === "rejected") return "Rejected";
  return value;
};

const QuoteDetails = () => {
  const { quoteId } = useParams();
  const navigate = useNavigate();

  const { data: quoteData, isLoading } = useGetQuoteByIdQuery(quoteId);
  const [updateQuote, { isLoading: isUpdating }] = useUpdateQuoteMutation();
  const [deleteQuote, { isLoading: isDeleting }] = useDeleteQuoteMutation();

  const quote = quoteData?.data;

  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState(null);
  const [bidSheetFile, setBidSheetFile] = useState(null);

  const getQuoteNoteText = (quoteData) => {
    if (!quoteData) return "";
    if (typeof quoteData.notes === "string") return quoteData.notes;
    if (Array.isArray(quoteData.notes)) {
      const note = quoteData.notes.find((n) => n.quoteId === quoteData._id);
      return note?.note || "";
    }
    return "";
  };

  /* ---------------- Init editable data ---------------- */
  useEffect(() => {
    if (quote) {
      setFormData({
        estimatedPrice: quote.estimatedPrice,
        notes: getQuoteNoteText(quote),
        status: normalizeStatus(quote.status),
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
      if (normalizeStatus(quote?.status) === "Approved") {
        toast.error("Approved quotes cannot be edited");
        setIsEditing(false);
        return;
      }
      const payload = new FormData();
      const currentStatus = normalizeStatus(quote?.status);
      const lockedStatus =
        currentStatus === "Approved" ? "Approved" : normalizeStatus(formData?.status);

      // append text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === "status") {
            payload.append("status", lockedStatus);
          } else {
            payload.append(key, value);
          }
        }
      });

      // append file ONLY if changed
      if (bidSheetFile) {
        payload.append("bidSheet", bidSheetFile);
      }
      payload.append("_dummy", "true");

      await updateQuote({
        id: quote._id,
        body: payload,
      }).unwrap();
      toast.success("Quote updated successfully")
      setIsEditing(false);
      setBidSheetFile(null);
      if (lockedStatus === "Approved") {
        navigate(`/sales-rep/jobs/add-job?quoteId=${quote._id}`);
      }
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
      notes: getQuoteNoteText(quote),
      status: normalizeStatus(quote.status),
      bookedOnSpot: quote.bookedOnSpot,
    });
  };

  const handleDelete = async () => {
    try {
      await deleteQuote({
        id: quote._id,
        clientId: quote?.clientId?._id ?? quote?.clientId,
      });
      toast.success("Quote deleted successfully");
      setShowDeleteModal(false);
      navigate("/sales-rep/quotes");
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Failed to delete quote");
    }
  };

  if (isLoading || !quote) {
    return <SimpleLoader />;
  }

  const {
    clientId,
    estimatedPrice,
    notes: quoteNotes,
    status,
    bookedOnSpot,
    bidSheet,
    bidSheetUrl,
    createdAt,
    customQuoteId,
  } = quote;
  const normalizedStatus = normalizeStatus(status);
  const isApprovedStatus = normalizedStatus === "Approved";
  const notesList = Array.isArray(quoteNotes)
    ? quoteNotes
    : quoteNotes
      ? [{ note: quoteNotes }]
      : [];
  const bidSheetSource = bidSheetUrl ?? bidSheet;
  const bidSheets = Array.isArray(bidSheetSource)
    ? bidSheetSource
    : bidSheetSource
      ? [{ bidSheetUrl: bidSheetSource }]
      : [];

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
              <p className="font-semibold">{clientId?.clientName || "-"}</p>
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
                  disabled={isApprovedStatus}
                  className="border rounded px-3 py-2 text-sm sm:text-base"
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              ) : (
                <span className="font-medium">{normalizedStatus}</span>
              )}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="bg-white border rounded-lg section-pad">


          <div className="mb-4">
            <p className="text-sm text-gray-500">Booked on the spot</p>
            <p>{bookedOnSpot ? "Yes" : "No"}</p>
          </div>

          {isEditing ? (
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Quote Note</p>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className="border rounded p-3 w-full text-sm sm:text-base"
              />
            </div>
          ) : null}

          <div>
            <p className="text-sm text-gray-500 mb-2">Notes</p>
            {notesList.length === 0 ? (
              <p>-</p>
            ) : (
              <div className="space-y-3">
                {notesList.map((noteItem) => (
                  <div
                    key={noteItem._id || noteItem.id || noteItem.note}
                    className="rounded border p-3"
                  >
                    <p className="text-sm text-gray-800">{noteItem.note}</p>
                    {noteItem.file && (
                      <a
                        href={noteItem.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 block text-sm text-blue-600 underline"
                      >
                        {getFileName(noteItem.file)}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bid Sheet */}
        <div className="bg-white border rounded-lg section-pad">
          <h3 className="font-semibold mb-3">Bid Sheet</h3>

          {bidSheets.length > 0 && !isEditing && (
            <div className="space-y-2">
              {bidSheets.map((sheet) => (
                <a
                  key={sheet._id || sheet.id || sheet.bidSheetUrl}
                  href={sheet.bidSheetUrl || sheet}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 underline"
                >
                  {getFileName(sheet.bidSheetUrl || sheet)}
                </a>
              ))}
            </div>
          )}

          {isEditing && (
            <div className="space-y-2">
              {bidSheets.length > 0 && (
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
                disabled={isApprovedStatus}
                className={`w-full sm:flex-1 border py-2.5 sm:py-3 rounded text-sm sm:text-base ${
                  isApprovedStatus ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Edit Quote
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                disabled={isDeleting}
                className="w-full sm:flex-1 bg-red-600 text-white py-2.5 sm:py-3 rounded text-sm sm:text-base disabled:opacity-60"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </>
          )}
        </div>
      </div>
      <DeleteModal
        open={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default QuoteDetails;
