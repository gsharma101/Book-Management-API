import React, { useState } from "react";
import BookTable from "./components/BookTable";

export default function App() {
  const [books, setBooks] = useState([
    {
      id: 1,
      title: "Clean Code",
      author: "Robert C. Martin",
      genre: "Programming",
      year: 2008,
      status: "completed",
    },
    {
      id: 2,
      title: "The Pragmatic Programmer",
      author: "Andrew Hunt & David Thomas",
      genre: "Programming",
      year: 1999,
      status: "reading",
    },
    {
      id: 3,
      title: "Atomic Habits",
      author: "James Clear",
      genre: "Self-help",
      year: 2018,
      status: "to-read",
    },
    {
      id: 4,
      title: "Deep Work",
      author: "Cal Newport",
      genre: "Productivity",
      year: 2016,
      status: "completed",
    },
    {
      id: 5,
      title: "Rich Dad Poor Dad",
      author: "Robert Kiyosaki",
      genre: "Finance",
      year: 1997,
      status: "reading",
    },
    {
      id: 6,
      title: "The Lean Startup",
      author: "Eric Ries",
      genre: "Business",
      year: 2011,
      status: "to-read",
    },
    {
      id: 7,
      title: "Zero to One",
      author: "Peter Thiel",
      genre: "Business",
      year: 2014,
      status: "completed",
    },
    {
      id: 8,
      title: "Sapiens",
      author: "Yuval Noah Harari",
      genre: "History",
      year: 2011,
      status: "reading",
    },
  ]);

  // Dummy functions for now
  const handleEdit = (book) => {
    alert("Edit clicked for: " + book.title);
  };

  const handleDelete = (book) => {
    alert("Delete clicked for: " + book.title);
    // Example delete logic
    setBooks((prev) => prev.filter((b) => b.id !== book.id));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Books Table Demo</h1>
      <BookTable
        books={books}
        onEdit={handleEdit}
        onDelete={handleDelete}
        initialPageSize={8}
      />
    </div>
  );
}
