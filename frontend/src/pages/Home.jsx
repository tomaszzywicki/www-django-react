import { useState, useEffect } from "react";
import api from "../api";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import BookMini from "../components/BookMini";

import "../styles/Home.css";
import FilterBar from "../components/FilterBar";

const Home = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    getBooks();
  }, []);

  const getBooks = () => {
    api
      .get("/api/books/")
      .then((res) => res.data)
      .then((data) => {
        setBooks(data);
        console.log(data);
      });
  };

  return (
    <div className="home">
      <div className="navbar-container">
        <Navbar />
      </div>
      <div className="search-bar">
        <SearchBar placeholder="Enter book title" />
      </div>
      <div className="filter-bar">
        <FilterBar />
      </div>
      <div className="books-container">
        {books.map((book) => (
          <BookMini key={book.id} title={book.title} cover={book.cover_image} />
        ))}
      </div>
    </div>
  );
};

export default Home;
