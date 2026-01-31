import React, { useMemo, useState } from "react";
import {
  FiArrowLeft,
  FiChevronDown,
  FiClock,
  FiPlus,
} from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetJobByIdQuery,
  useUpdateJobMutation
} from "../../../redux/api/jobApi";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../redux/slice/authSlice";
import toast from "react-hot-toast";
import { useAddNoteMutation } from "../../../redux/api/clientApi";
const isImageFile = (url = "") => /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(url);

const getFileName = (url = "") => decodeURIComponent(url.split("/").pop());
export default function JobOverview() {
  const navigate = useNavigate();
  const { id } = useParams();
  const user = useSelector(selectCurrentUser)

  const [currentStatus, setCurrentStatus] = useState("");
  const [noteText, setNoteText] = useState("");
  const [file, setFile] = useState(null);
  const [designNotes, setDesignNotes] = useState(
    "This is a sample note, and should never act as part of..."
  );

  const { data, isLoading } = useGetJobByIdQuery(id);
  const [changeStatus] = useUpdateJobMutation();
  const [createJobNote] = useAddNoteMutation();

  const job = data?.data;
  const productionManagerId = job?.productionManagerId?._id ?? job?.productionManagerId;
  const canManageStatus = Boolean(productionManagerId && user?._id && productionManagerId === user._id);
  const statusOptions = useMemo(() => {
    const options = [job?.status, "Scheduled", "In Progress", "On Hold", "Completed", "Cancelled"];
    return [...new Set(options)].filter((option) => option && option !== "Closed");
  }, [job?.status]);

  const changeStatusHandler = async (status) => {
    if (!status) return;
    //console.log("from change status handler", job._id, status)
    try {
      await changeStatus({ id: job._id, data: { status } }).unwrap();
      toast.success("Status updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  const addNoteHandler = async () => {
    if (!noteText && !file) return alert("Enter a note or select a file");

    const formData = new FormData();
    formData.append("authorId", user._id);
    formData.append("jobId", id);
    formData.append("note", noteText);
    if (file) formData.append("file", file);

    try {
      await createJobNote(formData).unwrap();
      setNoteText("");
      setFile(null);
      toast.success("Note added successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add note")
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="px-4 sm:px-6 py-3 border-b border-gray-200 flex items-center gap-2">
        <button
          className="text-gray-600 hover:text-gray-900"
          onClick={() => navigate(-1)}
        >
          <FiArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-base sm:text-lg font-semibold text-gray-900">
            Job Overview - {job?.customJobId}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            View and edit updates here only.
          </p>
        </div>
      </div>

      <div className="page-container">
        {/* Job Overview & Status */}
        <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-3">
          {/* Job Overview */}
          <div className="p-4 sm:p-5 bg-white border border-gray-300 rounded lg:col-span-2">
            <h2 className="mb-4 text-base font-semibold text-gray-900">
              Job Overview
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
              <div>
                <p className="mb-1 text-xs text-gray-500">Job ID</p>
                <p className="text-sm font-medium text-gray-900">
                  {job?.customJobId}
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs text-gray-500">Client Name</p>
                <p className="text-sm font-medium text-gray-900">
                  {job?.quoteId?.clientId?.clientName}
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs text-gray-500">Location</p>
                <p className="text-sm font-medium text-gray-900">
                  {job?.quoteId?.clientId?.address}
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs text-gray-500">Job Status</p>
                <p className="text-sm font-medium text-gray-900">
                  {job?.status}
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs text-gray-500">Job Date</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(job?.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs text-gray-500">Total Price</p>
                <p className="text-sm font-medium text-gray-900">
                  ${job?.estimatedPrice}
                </p>
              </div>
            </div>
          </div>

          {/* Job Status */}
          <div className="p-4 sm:p-5 bg-white border border-gray-300 rounded">
            <h2 className="mb-4 text-base font-semibold text-gray-900">
              Job Status
            </h2>
            {!canManageStatus ? (
              <p className="text-sm text-gray-600">You do not have access to update this job.</p>
            ) : job?.status === "Closed" ? (
              <p className="text-sm text-gray-600">This job is closed and cannot be updated.</p>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <select
                    value={currentStatus || job?.status}
                    onChange={(e) => setCurrentStatus(e.target.value)}
                    className="w-full px-3 py-2 text-sm sm:text-base text-gray-900 bg-white border border-gray-300 rounded appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {statusOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <FiChevronDown className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 pointer-events-none right-2 top-1/2" />
                </div>

                <button
                  onClick={() => changeStatusHandler(currentStatus || job?.status)}
                  className="w-full flex justify-center items-center gap-x-2 bg-blue-400 hover:bg-blue-500 font-medium py-2.5 rounded text-sm sm:text-base transition-colors"
                >
                  Change Status
                </button>

                <button
                  onClick={() => changeStatusHandler("Pending Close")}
                  className="w-full flex justify-center items-center gap-x-2 bg-yellow-400 hover:bg-yellow-500 font-medium py-2.5 rounded text-sm sm:text-base transition-colors"
                >
                  <FiClock className="w-4 h-4" /> Mark as Pending Close
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Notes & Design Consultation */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Notes */}
          <div className="p-4 sm:p-5 bg-white border border-gray-300 rounded lg:col-span-2">
            <h2 className="mb-4 text-base font-semibold text-gray-900">
              Notes & Progress Updates
            </h2>

            <div className="mb-4">
              <label className="block mb-2 text-xs text-gray-500">
                Add Notes
              </label>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Enter note"
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                rows="2"
              />
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="mt-2 text-sm sm:text-base"
              />
            </div>

            <button
              onClick={addNoteHandler}
              className="flex items-center gap-2 px-3 py-2 bg-[#B0D6F0] rounded text-sm sm:text-base font-medium mb-5"
            >
              <FiPlus className="w-4 h-4" /> Add Note
            </button>

            <div className="mb-5">
              <h3 className="mb-2 text-xs font-semibold text-gray-900">
                Recent Notes
              </h3>
              {job?.notes?.length === 0 && (
                <p className="text-xs text-gray-600">No notes yet</p>
              )}
              {job?.notes?.map((note) => (
                <div key={note._id} className="mb-2 text-xs text-gray-700">
                  <p>
                    <strong>{note.authorId.fullName}:</strong> {note.note}
                  </p>
                  {note.file && (
                    <div className="mt-3">
                      {isImageFile(note.file) ? (
                        <img
                          src={note.file}
                          alt="Note attachment"
                          className="w-32 h-32 object-cover rounded border"
                        />
                      ) : (
                        <a
                          href={note.file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-blue-600 underline text-sm"
                        >
                          📎 {getFileName(note.file)}
                          {/* View file */}
                        </a>
                      )}
                    </div>
                  )}
                  <p className="text-gray-400 text-[10px]">
                    {new Date(note.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            {/* Design Consultation */}
            {/* <div>
              <h3 className="mb-3 text-xs font-semibold text-gray-900">
                Design Consultation Files
              </h3>
              {job?.designConsultaion?.map((d) => (
                <div key={d._id} className="mb-2 text-xs text-gray-700">
                  <p>{d.upsellDescription || d.products}</p>
                  {d.file && (
                    <a
                      href={d.file}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-500 underline text-xs"
                    >
                      View File
                    </a>
                  )}
                </div>
              ))}
            </div> */}
          </div>

          {/* Design Consultation Section */}
          <div className="p-4 sm:p-5 bg-white border border-gray-300 rounded">
            <h2 className="mb-4 text-base font-semibold text-gray-900">
              Design Consultation
            </h2>
            {job?.designConsultaion?.length === 0 && (
              <p className="text-xs text-gray-500">
                No design consultation added yet.
              </p>
            )}
            {job?.designConsultaion?.map((d) => (
              <div
                key={d._id}
                className="mb-3 p-3 border border-gray-200 rounded text-xs text-gray-700"
              >
                {d.products && (
                  <p>
                    <strong>Products:</strong> {d.products}
                  </p>
                )}
                {d.colorCodes && (
                  <p>
                    <strong>Color Codes:</strong> {d.colorCodes}
                  </p>
                )}
                {d.estimatedGallos && (
                  <p>
                    <strong>Estimated Gallons:</strong> {d.estimatedGallos}
                  </p>
                )}
                {d.addedHours && (
                  <p>
                    <strong>Added Hours:</strong> {d.addedHours}
                  </p>
                )}
                {d.upsellDescription && (
                  <p>
                    <strong>Upsell Description:</strong> {d.upsellDescription}
                  </p>
                )}
                {d.upsellValue && (
                  <p>
                    <strong>Upsell Value:</strong> ${d.upsellValue}
                  </p>
                )}
                {d.file && (
                  <a
                    href={d.file}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-500 underline text-xs"
                  >
                    View File
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
