import { useState } from "react";
import {
  useCreateClientMutation,
  useAddNoteMutation,
} from "../../redux/api/clientApi";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/slice/authSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ClientNote from "../../Components/Sales-rep/Clients/ClientNote";
import RequiredMark from "../../Components/Common/RequiredMark";

const AddClient = () => {
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);

  const [createClient, { isLoading }] = useCreateClientMutation();
  const [addNote] = useAddNoteMutation();

  const [note, setNote] = useState("");
  const [noteFile, setNoteFile] = useState(null);

  const [formData, setFormData] = useState({
    clientName: "",
    partnerName: "",
    phoneNumber: "",
    email: "",
    address: "",
    leadSource: "",
    rating: 0,
  });

  const leadSources = ["Door to Door", "Inbound", "Social"];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  /* ================= SUBMIT ================= */

  const handleCreateClient = async (e) => {
    e.preventDefault();
    if (!e.currentTarget.checkValidity()) {
      e.currentTarget.reportValidity();
      return;
    }

    const noteValue = note.trim();
    if (!noteValue && noteFile) {
      toast.error("Add a note for the attachment.");
      return;
    }

    try {
      // 1️⃣ Create client
      const client = await createClient(formData).unwrap();
      const clientId = client.data._id;

      //console.log("Client from add client", client);

      // 2️⃣ Upload note (if provided)
      if (noteValue || noteFile) {
        const fd = new FormData();
        if (noteValue) fd.append("note", noteValue);
        if (noteFile) fd.append("file", noteFile);

        await addNote({ clientId, formData: fd }).unwrap();
      }

      toast.success("Client added successfully");
      navigate("/sales-rep/clients");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create client");
    }
  };

  /* ================= UI ================= */

  return (
    <div className="page-container">
      <div className="space-y-6">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 text-center">
          Add Client
        </h1>

        <form
          onSubmit={handleCreateClient}
          className="space-y-6 bg-white section-pad border rounded-lg"
        >
        {/* Client Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm sm:text-base font-semibold mb-2">
              Client Name <RequiredMark />
            </label>
            <input
              value={formData.clientName}
              onChange={(e) => handleInputChange("clientName", e.target.value)}
              className="w-full border px-3 py-2 rounded-lg text-sm sm:text-base"
              required
            />
          </div>

          <div>
            <label className="block text-sm sm:text-base font-semibold mb-2">
              Partner Name
            </label>
            <input
              value={formData.partnerName}
              onChange={(e) => handleInputChange("partnerName", e.target.value)}
              className="w-full border px-3 py-2 rounded-lg text-sm sm:text-base"
            />
          </div>
        </div>

        {/* Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm sm:text-base font-semibold mb-2">
              Phone <RequiredMark />
            </label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
              className="w-full border px-3 py-2 rounded-lg text-sm sm:text-base"
              required
            />
          </div>

          <div>
            <label className="block text-sm sm:text-base font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="w-full border px-3 py-2 rounded-lg text-sm sm:text-base"
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm sm:text-base font-semibold mb-2">
            Address <RequiredMark />
          </label>
          <input
            value={formData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            className="w-full border px-3 py-2 rounded-lg text-sm sm:text-base"
            required
          />
        </div>

        {/* Lead Source */}
        <div>
          <label className="block text-sm sm:text-base font-semibold mb-2">
            Lead Source <RequiredMark />
          </label>
          <select
            value={formData.leadSource}
            onChange={(e) => handleInputChange("leadSource", e.target.value)}
            className="w-full border px-3 py-2 rounded-lg text-sm sm:text-base"
            required
          >
            {leadSources.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Lead Rating */}
        <div>
          <label className="block text-sm sm:text-base font-semibold mb-2">
            Lead Rating
          </label>
          <div className="flex flex-wrap items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleInputChange("rating", star)}
                className="text-xl sm:text-2xl"
              >
                {star <= formData.rating ? "★" : "☆"}
              </button>
            ))}
            <span className="text-sm text-gray-600">{formData.rating}/5</span>
          </div>
        </div>

        {/* Notes */}
        <ClientNote
          note={note}
          file={noteFile}
          onNoteChange={setNote}
          onFileChange={setNoteFile}
        />

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
          <button
            type="button"
            onClick={() => navigate("/s/sales-rep/clients")}
            className="w-full sm:flex-1 border py-2 rounded-lg text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm sm:text-base"
          >
            {isLoading ? "Saving..." : "Save Client"}
          </button>
        </div>
        </form>
      </div>
    </div>
  );
};

export default AddClient;
