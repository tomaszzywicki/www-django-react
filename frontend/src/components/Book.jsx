import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import api from "../api";

import "../styles/Book.css";
import CommentsSection from "./CommentsSection";
import { ACCESS_TOKEN } from "../constants";

const Book = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [orderStatus, setOrderStatus] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const maxDescriptionLength = 600;

  useEffect(() => {
    const checkUser = () => {
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (token) {
        setIsLoggedIn(true);
      }
    };
    checkUser();
  }, []);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await api.get(`/api/book/${id}`);
        setBook(res.data);
      } catch (error) {
        console.log("Error when fetching book data: ", error);
      }
    };
    fetchBook();
  }, [id]);

  if (!book) return <div className="book-loading">Loading...</div>;

  const handleOrder = async () => {
    try {
      await api.post(`/api/book/${id}/order/`);
      setOrderStatus("success");
      setBook({ ...book, available_copies: book.available_copies - 1 });
    } catch (error) {
      setOrderStatus("error");
      console.error("Error ordering book:", error);
    }
  };

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
          <div className="order-section">
            <p className="available-copies">
              Dostępne egzemplarze: {book.available_copies}
            </p>
            {isLoggedIn && book.available_copies > 0 && (
              <button className="order-button" onClick={handleOrder}>
                Zamów książkę
              </button>
            )}
            {orderStatus === "success" && (
              <p className="order-success">Zamówienie złożone pomyślnie!</p>
            )}
            {orderStatus === "error" && (
              <p className="order-error">Wystąpił błąd podczas zamawiania.</p>
            )}
          </div>
        </div>
      </div>
      <div className="comments-section">
        <CommentsSection bookId={id} />
      </div>
    </div>
  );
};

export default Book;
