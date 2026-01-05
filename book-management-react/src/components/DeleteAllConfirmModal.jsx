function DeleteAllConfirmModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-lg font-semibold text-red-600">
          Delete All Books
        </h2>

        <p className="text-sm text-gray-600 mt-2">
          This action will permanently delete all books.
          This cannot be undone.
        </p>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="border px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Delete All
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteAllConfirmModal;
