import { Link } from "react-router-dom";

import "../styles/BookMini.css";

// eslint-disable-next-line react/prop-types
const BookMini = ({ title, cover, id }) => {
  return (
    <div className="book-mini">
      <img src={cover} alt={`${title} cover`} />
      <h2>{title}</h2>
      <button className="details-button">
        <Link to={`/book/${id}`}>View details</Link>
      </button>
    </div>
  );
};

export default BookMini;
