import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import api from "../api";

import "../styles/Book.css";
import CommentsSection from "./CommentsSection";

const Book = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false); // Dodany stan

  const maxDescriptionLength = 600;

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

  if (!book) return <div className="book-loading">Loading...</div>;

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  const renderDescription = () => {
    if (book.description.length <= maxDescriptionLength) {
      return <p className="book-description">{book.description}</p>;
    }

    if (isExpanded) {
      return (
        <p className="book-description">
          {book.description}{" "}
          <span className="read-more" onClick={toggleDescription}>
            Read less
          </span>
        </p>
      );
    } else {
      return (
        <p className="book-description">
          {book.description.substring(0, maxDescriptionLength)}...{" "}
          <span className="read-more" onClick={toggleDescription}>
            Read more
          </span>
        </p>
      );
    }
  };

  return (
    <div className="book-container">
      <div className="book-details">
        <img className="book-cover" src={book.cover_image} alt={book.title} />
        <div className="book-info">
          <h1 className="book-title">{book.title}</h1>
          <h3 className="book-author">Autor: {book.author}</h3>
          {renderDescription()}
          <p className="book-category">Kategoria: {book.category}</p>
        </div>
      </div>
      <div className="comments-section">
        <CommentsSection bookId={id} />
      </div>
    </div>
  );
};

export default Book;
