import axios from "axios";

// single source of truth
export const API_URL = `${
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8081"
}/api/v1/books`;

export const fetchBooks = () => axios.get(API_URL);
export const addBook = (book) => axios.post(API_URL, book);
export const updateBook = (id, book) => axios.put(`${API_URL}/${id}`, book);
export const deleteBook = (id) => axios.delete(`${API_URL}/${id}`);
export const deleteAllBooks = () => axios.delete(`${API_URL}/all`);
