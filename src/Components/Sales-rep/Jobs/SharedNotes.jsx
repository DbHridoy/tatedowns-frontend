import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../redux/slice/authSlice";
import { useAddNoteMutation } from "../../../redux/api/clientApi";
import { useParams } from "react-router-dom";
import { useGetJobByIdQuery } from "../../../redux/api/jobApi";

const isImageFile = (url = "") => /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(url);
const getFileName = (url = "") => decodeURIComponent(url.split("/").pop());

const SharedNotes = () => {
  const { jobId } = useParams();
  const { data } = useGetJobByIdQuery(jobId, { skip: !jobId });

  const job = data?.data;
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [addNoteMutation] = useAddNoteMutation();
  const user = useSelector(selectCurrentUser);

  useEffect(() => {
    setNotes(job?.notes ?? []);
  }, [job?.notes]);

  const handlePostNote = async () => {
    if (!newNote.trim() && !selectedFile) return;
    if (!job?.clientId?._id) return;

    const formData = new FormData();
    formData.append("jobId", jobId);
    formData.append("createdBy", user._id);
    formData.append("note", newNote.trim());

    if (selectedFile) {
      formData.append("file", selectedFile);
    }

    try {
      const res = await addNoteMutation({
        clientId: job.clientId._id,
        formData,
      }).unwrap();
      setNotes((prev) => [...prev, res.data]);
      setNewNote("");
      setSelectedFile(null);
    } catch (err) {
      console.error("Failed to create note", err);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-md border section-pad space-y-4">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
        Notes and Attachments
      </h2>

      <div className="space-y-4">
        {notes.length === 0 && (
          <p className="text-gray-500 text-sm">No notes yet.</p>
        )}

        {notes.map((note) => (
          <div
            key={note._id || note.id}
            className="p-4 bg-blue-50 rounded-lg shadow-sm flex space-x-4"
          >
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <p className="font-semibold text-gray-700">
                  {note.createdBy?.fullName || note.authorId?.fullName || "Unknown"}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(note.createdAt).toLocaleString()}
                </p>
              </div>

              <p className="text-sm text-gray-700 mt-2">{note.note}</p>

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
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t pt-4 space-y-3">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          rows="3"
          placeholder="Add a note for the team..."
          className="w-full p-3 border rounded-md text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex items-center gap-3">
          <label className="cursor-pointer flex items-center gap-2 text-blue-600 text-sm">
            📎 Attach file
            <input
              type="file"
              hidden
              onChange={(e) => setSelectedFile(e.target.files[0])}
            />
          </label>

          {selectedFile && (
            <span className="text-sm text-gray-600 truncate">
              {selectedFile.name}
            </span>
          )}
        </div>

        <button
          onClick={handlePostNote}
          disabled={!newNote.trim() && !selectedFile}
          className="px-6 py-2 bg-blue-500 text-white rounded-md text-sm sm:text-base hover:bg-blue-600 disabled:opacity-50"
        >
          Post Note
        </button>
      </div>
    </div>
  );
};

export default SharedNotes;
