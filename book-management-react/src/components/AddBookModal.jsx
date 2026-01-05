import { useState } from "react";
import toast from "react-hot-toast";

function AddBookModal({ isOpen, onClose, onSave }) {
  const [form, setForm] = useState({
    title: "",
    author: "",
    genre: "",
    status: "TO_READ",
    year: "",
  });

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.author || !form.genre || !form.year) {
      toast.error("Please fill all required fields");
      return;
    }

    const yearNum = Number(form.year);
    const currentYear = new Date().getFullYear();

    if (yearNum < 1500 || yearNum > currentYear) {
      toast.error("Please enter a valid publication year");
      return;
    }

    try {
      setLoading(true);

      await onSave({
        title: form.title.trim(),
        author: form.author.trim(),
        genre: form.genre,
        status: form.status,
        year: yearNum,
      });

      toast.success("Book added 📚");
      onClose();

      setForm({
        title: "",
        author: "",
        genre: "",
        status: "TO_READ",
        year: "",
      });
    } catch {
      toast.error("Failed to add book");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Add Book</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="title"
            placeholder="Title *"
            value={form.title}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />

          <input
            name="author"
            placeholder="Author *"
            value={form.author}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />

          <select
            name="genre"
            value={form.genre}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select Genre *</option>
            <option value="Programming">Programming</option>
            <option value="Business">Business</option>
            <option value="Psychology">Psychology</option>
            <option value="Self-Help">Self-Help</option>
            <option value="Finance">Finance</option>
            <option value="Motivation">Motivation</option>
            <option value="Creativity">Creativity</option>
          </select>

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="TO_READ">To Read</option>
            <option value="READING">Reading</option>
            <option value="COMPLETED">Completed</option>
          </select>

          <input
            name="year"
            type="number"
            placeholder="Publication Year *"
            value={form.year}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="border px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddBookModal;
