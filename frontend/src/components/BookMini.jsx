import "../styles/BookMini.css";

// eslint-disable-next-line react/prop-types
const BookMini = ({ title, cover }) => {
  return (
    <div className="book-mini">
      <img src={cover} alt={`${title} cover`} />
      <h2>{title}</h2>
      <button className="details-button">View Details</button>
    </div>
  );
};

export default BookMini;
