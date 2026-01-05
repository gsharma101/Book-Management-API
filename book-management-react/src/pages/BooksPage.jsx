import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";

import BookTable from "../components/BookTable";
import AddBookModal from "../components/AddBookModal";
import EditBookModal from "../components/EditBookModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import DeleteAllConfirmModal from "../components/DeleteAllConfirmModal";

function BooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Delete ALL modal
  const [isDeleteAllOpen, setIsDeleteAllOpen] = useState(false);

  // Add modal
  const [isAddOpen, setIsAddOpen] = useState(false);

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
  // Add
  // ======================
  const handleAddBook = async (book) => {
    const res = await fetch("http://localhost:8081/api/v1/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(book),
    });

    if (!res.ok) throw new Error("Failed to add book");

    const saved = await res.json();

    // ✅ single source of truth
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
  // Delete + Undo
  // ======================
  const handleDelete = (book) => {
    setDeleteBook(book);
    setIsDeleteOpen(true);
  };

  const confirmDelete = (book) => {
    // 🚫 Prevent parallel deletes
    if (pendingDeleteRef.current) {
      toast.error("Please undo or wait for the current delete");
      return;
    }

    // Optimistic UI
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
        await fetch(`http://localhost:8081/api/v1/books/${book.id}`, {
          method: "DELETE",
        });
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
      await fetch("http://localhost:8081/api/v1/books/all", {
        method: "DELETE",
      });

      setBooks([]);
      toast.success("All books deleted");
      setIsDeleteAllOpen(false);
    } catch {
      toast.error("Failed to delete all books");
    }
  };

  // ======================
  // UI
  // ======================
  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          📚 Books Library
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage, search, and organize your books
        </p>
      </div>

      <BookTable
        books={books}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={() => setIsAddOpen(true)}
        onDeleteAll={() => setIsDeleteAllOpen(true)} // ✅ ADD THIS
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
