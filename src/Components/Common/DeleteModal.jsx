const DeleteModal = ({ open, onCancel, onConfirm }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-[92vw] sm:w-full sm:max-w-md md:max-w-lg lg:max-w-xl">
        <h3 className="text-lg font-semibold mb-2">Confirm Delete</h3>
        <p className="text-sm text-gray-600 mb-4">
          Are you sure you want to delete this item?
        </p>

        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 border rounded">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
