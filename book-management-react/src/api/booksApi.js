import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const API_URL = `${BASE_URL}/api/v1/books`;

export const fetchBooks = () => axios.get(API_URL);
export const addBook = (book) => axios.post(API_URL, book);
