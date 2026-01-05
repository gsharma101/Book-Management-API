import axios from "axios";

const API_URL = "http://localhost:8081/api/v1/books";

export const fetchBooks = () => axios.get(API_URL);
export const addBook = (book) => axios.post(API_URL, book);
