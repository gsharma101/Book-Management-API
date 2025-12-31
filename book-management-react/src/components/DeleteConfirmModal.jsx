export default function DeleteConfirmModal({
  isOpen,
  book,
  onCancel,
  onConfirm,
}) {
  if (!isOpen || !book) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-semibold mb-4 text-red-600">
          Delete Book
        </h2>

        <p className="mb-6">
          Are you sure you want to delete
          <strong> "{book.title}"</strong>?
        </p>

        <div className="flex justify-end gap-3">
          <button onClick={onCancel}>Cancel</button>
          <button
            onClick={() => onConfirm(book)}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
