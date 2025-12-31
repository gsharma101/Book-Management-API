import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";

import BookTable from "../components/BookTable";
import EditBookModal from "../components/EditBookModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";

function BooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Edit modal
  const [editingBook, setEditingBook] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Delete modal
  const [deleteBook, setDeleteBook] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Undo delete refs
  const pendingDeleteRef = useRef(null);
  const deleteTimerRef = useRef(null);
  const countdownIntervalRef = useRef(null);

  // ======================
  // Fetch books
  // ======================
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch("http://localhost:8081/api/v1/books");
        if (!res.ok) throw new Error("Failed to fetch books");
        setBooks(await res.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  // ======================
  // Edit
  // ======================
  const handleEdit = (book) => {
    setEditingBook(book);
    setIsEditOpen(true);
  };

  const handleUpdateBook = async (updatedBook) => {
    try {
      const res = await fetch(
        `http://localhost:8081/api/v1/books/${updatedBook.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedBook),
        }
      );

      if (!res.ok) throw new Error("Update failed");

      const saved = await res.json();
      setBooks((prev) => prev.map((b) => (b.id === saved.id ? saved : b)));

      toast.success("Book updated ✨");
      setIsEditOpen(false);
      setEditingBook(null);
    } catch (err) {
      toast.error(err.message);
    }
  };

  // ======================
  // Delete + Undo (FINAL)
  // ======================
  const handleDelete = (book) => {
    setDeleteBook(book);
    setIsDeleteOpen(true);
  };

  const confirmDelete = (book) => {
    // Optimistic UI
    setBooks((prev) => prev.filter((b) => b.id !== book.id));
    setIsDeleteOpen(false);
    // 🚫 Block multiple deletes
    if (pendingDeleteRef.current) {
      toast.error("Please undo or wait for the current delete to finish");
      return;
    }

    pendingDeleteRef.current = book;

    let timeLeft = 5;

    // Create toast and store its ID
    const toastId = toast.custom(
      <span className="flex gap-3 items-center">
        <span>Book deleted in {timeLeft}s</span>
        <button
          className="underline font-semibold cursor-pointer hover:text-indigo-600"
          onClick={() => undoDelete(toastId)}
        >
          Undo
        </button>
      </span>,
      { duration: 5000 }
    );

    // Countdown update (THIS makes it real-time)
    countdownIntervalRef.current = setInterval(() => {
      timeLeft -= 1;

      toast.custom(
        <span className="flex gap-3 items-center">
          <span>Book deleted in {timeLeft}s</span>
          <button
            className="underline font-semibold cursor-pointer hover:text-indigo-600"
            onClick={() => undoDelete(toastId)}
          >
            Undo
          </button>
        </span>,
        { id: toastId }
      );
    }, 1000);

    // Final delete after 5s
    deleteTimerRef.current = setTimeout(async () => {
      try {
        await fetch(`http://localhost:8081/api/v1/books/${book.id}`, {
          method: "DELETE",
        });
        toast.success("Book permanently deleted 🗑️");
      } catch {
        toast.error("Delete failed");
      } finally {
        cleanupTimers();
        toast.dismiss(toastId);
      }
    }, 5000);
  };

  const undoDelete = (toastId) => {
    const book = pendingDeleteRef.current;
    if (!book) return;

    cleanupTimers();
    setBooks((prev) => [book, ...prev]);

    toast.dismiss(toastId);
    toast.success("Delete undone ↩️");
  };

  const cleanupTimers = () => {
    clearTimeout(deleteTimerRef.current);
    clearInterval(countdownIntervalRef.current);
    pendingDeleteRef.current = null;
  };

  // ======================
  // UI
  // ======================
  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Books Table</h1>

      <BookTable books={books} onEdit={handleEdit} onDelete={handleDelete} />

      <EditBookModal
        isOpen={isEditOpen}
        book={editingBook}
        onClose={() => setIsEditOpen(false)}
        onSave={handleUpdateBook}
      />

      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        book={deleteBook}
        onCancel={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

export default BooksPage;
