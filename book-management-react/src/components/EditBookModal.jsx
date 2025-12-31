import { useEffect, useState } from "react";

export default function EditBookModal({ isOpen, book, onClose, onSave }) {
  const [form, setForm] = useState({
    title: "",
    author: "",
    genre: "",
    year: "",
    status: "TO_READ",
  });

  useEffect(() => {
    if (book) {
      setForm(book);
    }
  }, [book]);

  if (!isOpen || !book) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[420px] rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold">Edit Book</h2>

        <input
          className="w-full border px-3 py-2 rounded"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Title"
        />

        <input
          className="w-full border px-3 py-2 rounded"
          value={form.author}
          onChange={(e) => setForm({ ...form, author: e.target.value })}
          placeholder="Author"
        />

        <input
          className="w-full border px-3 py-2 rounded"
          value={form.genre}
          onChange={(e) => setForm({ ...form, genre: e.target.value })}
          placeholder="Genre"
        />

        <input
          type="number"
          className="w-full border px-3 py-2 rounded"
          value={form.year}
          onChange={(e) =>
            setForm({ ...form, year: Number(e.target.value) })
          }
          placeholder="Year"
        />

        <select
          className="w-full border px-3 py-2 rounded"
          value={form.status}
          onChange={(e) =>
            setForm({ ...form, status: e.target.value })
          }
        >
          <option value="TO_READ">TO_READ</option>
          <option value="READING">READING</option>
          <option value="COMPLETED">COMPLETED</option>
        </select>

        <div className="flex justify-end gap-2 pt-4">
          <button onClick={onClose} className="px-3 py-1 border rounded">
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            className="px-3 py-1 bg-indigo-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
