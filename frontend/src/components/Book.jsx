import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import api from "../api";

import "../styles/Book.css";
import CommentsSection from "./CommentsSection";

const Book = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await api.get(`/api/book/${id}`);
        console.log(res.data);
        setBook(res.data);
      } catch (error) {
        console.log("Error when fetching book data: ", error);
      }
    };
    fetchBook();
  }, [id]);

  if (!book) return <div>Loading...</div>;

  return (
    <div className="book-details">
      <img className="book-cover" src={book.cover_image} alt={book.title} />
      <div className="book-info">
        <h1 className="book-title">{book.title}</h1>
        <h3 className="book-author">Autor: {book.author}</h3>
        <p className="book-description">{book.description}</p>
        <p className="book-category">Kategoria: {book.category}</p>
      </div>
      <CommentsSection bookId={id} />
    </div>
  );
};

export default Book;
