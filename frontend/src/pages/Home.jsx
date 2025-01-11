import { useState, useEffect } from "react";
import api from "../api";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import BookMini from "../components/BookMini";

import "../styles/Home.css";
import FilterBar from "../components/FilterBar";

const Home = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    const getBooks = () => {
      setLoading(true);
      let query = "";
      if (selectedCategories.length > 0) {
        const categoriesQuery = selectedCategories.join(",");
        query = `?category=${categoriesQuery}`;
      }

      api
        .get(`/api/books/${query}`)
        .then((res) => res.data)
        .then((data) => {
          setBooks(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching books:", err);
          setLoading(false);
        });
    };
    getBooks();
  }, [selectedCategories]);

  const getCategories = () => {
    api
      .get("/api/categories/")
      .then((res) => res.data)
      .then((data) => {
        setCategories(data);
        console.log(data);
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
      });
  };

  const handleCategorySelection = (categoryIds) => {
    setSelectedCategories(categoryIds);
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
        <FilterBar
          categories={categories}
          selectedCategories={selectedCategories}
          onCategoryChange={handleCategorySelection}
        />
      </div>
      <div className="books-container">
        {loading ? (
          <div className="loading">Loading books...</div>
        ) : books.length > 0 ? (
          books.map((book) => (
            <BookMini
              key={book.id}
              title={book.title}
              cover={book.cover_image}
            />
          ))
        ) : (
          <div className="no-books">No books found.</div>
        )}
      </div>
    </div>
  );
};

export default Home;
