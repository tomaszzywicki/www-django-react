/* eslint-disable react/prop-types */
import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import "../styles/OrderMini.css";

const OrderMini = ({ orderId, book, orderDate, status, onCancelSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCancel = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await api.post(`/api/orders/${orderId}/cancel/`);
      onCancelSuccess(orderId);
    } catch (err) {
      setError("Failed to cancel order");
      console.error("Error cancelling order:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="order-mini">
      <img src={book.cover_image} alt={`${book.title} cover`} />

      <h2 className="order-title">{book.title}</h2>

      <p className="order-date">
        Ordered: {new Date(orderDate).toLocaleDateString()}
      </p>
      <p className="order-status">Status: {status}</p>

      <div className="buttons-row">
        <button className="details-button">
          <Link to={`/book/${book.id}`}>View book</Link>
        </button>
        <button
          className="cancel-button"
          onClick={handleCancel}
          disabled={isLoading}
        >
          {isLoading ? "Cancelling..." : "Cancel Order"}
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default OrderMini;
