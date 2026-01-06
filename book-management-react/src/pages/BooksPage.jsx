import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";

import BookTable from "../components/BookTable";
import AddBookModal from "../components/AddBookModal";
import EditBookModal from "../components/EditBookModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import DeleteAllConfirmModal from "../components/DeleteAllConfirmModal";

// ✅ import API_URL directly
import { API_URL } from "../api/booksApi";

function BooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isDeleteAllOpen, setIsDeleteAllOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteBook, setDeleteBook] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const pendingDeleteRef = useRef(null);
  const deleteTimerRef = useRef(null);
  const countdownIntervalRef = useRef(null);

  // ======================
  // Fetch books
  // ======================
  useEffect(() => {
    const loadBooks = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Failed to fetch books");
        setBooks(await res.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadBooks();
  }, []);

  // ======================
  // Add
  // ======================
  const handleAddBook = async (book) => {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(book),
    });

    if (!res.ok) throw new Error("Failed to add book");

    const saved = await res.json();
    setBooks((prev) => [saved, ...prev]);
  };

  // ======================
  // Edit
  // ======================
  const handleEdit = (book) => {
    setEditingBook(book);
    setIsEditOpen(true);
  };

  const handleUpdateBook = async (updatedBook) => {
    try {
      const res = await fetch(`${API_URL}/${updatedBook.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBook),
      });

      if (!res.ok) throw new Error("Update failed");

      const saved = await res.json();
      setBooks((prev) =>
        prev.map((b) => (b.id === saved.id ? saved : b))
      );

      toast.success("Book updated ✨");
      setIsEditOpen(false);
      setEditingBook(null);
    } catch (err) {
      toast.error(err.message);
    }
  };

  // ======================
  // Delete + Undo
  // ======================
  const handleDelete = (book) => {
    setDeleteBook(book);
    setIsDeleteOpen(true);
  };

  const confirmDelete = (book) => {
    if (pendingDeleteRef.current) {
      toast.error("Please undo or wait for the current delete");
      return;
    }

    setBooks((prev) => prev.filter((b) => b.id !== book.id));
    setIsDeleteOpen(false);

    pendingDeleteRef.current = book;
    let timeLeft = 5;

    const toastId = toast.custom(
      <span className="flex gap-3 items-center">
        <span>Book deleted in {timeLeft}s</span>
        <button
          className="underline font-semibold"
          onClick={() => undoDelete(toastId)}
        >
          Undo
        </button>
      </span>,
      { duration: 5000 }
    );

    countdownIntervalRef.current = setInterval(() => {
      timeLeft -= 1;
      toast.custom(
        <span className="flex gap-3 items-center">
          <span>Book deleted in {timeLeft}s</span>
          <button
            className="underline font-semibold"
            onClick={() => undoDelete(toastId)}
          >
            Undo
          </button>
        </span>,
        { id: toastId }
      );
    }, 1000);

    deleteTimerRef.current = setTimeout(async () => {
      try {
        await fetch(`${API_URL}/${book.id}`, { method: "DELETE" });
        toast.success("Book permanently deleted 🗑️");
      } catch {
        toast.error("Delete failed");
        setBooks((prev) => [book, ...prev]);
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

  const handleDeleteAll = async () => {
    try {
      await fetch(`${API_URL}/all`, { method: "DELETE" });
      setBooks([]);
      toast.success("All books deleted");
      setIsDeleteAllOpen(false);
    } catch {
      toast.error("Failed to delete all books");
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <BookTable
        books={books}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={() => setIsAddOpen(true)}
        onDeleteAll={() => setIsDeleteAllOpen(true)}
      />

      <AddBookModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSave={handleAddBook}
      />

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

      <DeleteAllConfirmModal
        isOpen={isDeleteAllOpen}
        onClose={() => setIsDeleteAllOpen(false)}
        onConfirm={handleDeleteAll}
      />
    </div>
  );
}

export default BooksPage;
