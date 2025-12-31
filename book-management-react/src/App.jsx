import { Toaster } from "react-hot-toast";
import BooksPage from "./pages/BooksPage";

export default function App() {
  return (
    <>
      <Toaster position="top-right" />
      <BooksPage />
    </>
  );
}
