import { useState, useEffect } from "react";
import api from "../api";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import BookMini from "../components/BookMini";
import FilterBar from "../components/FilterBar";
import "../styles/Home.css";

const Home = () => {
  const [allBooks, setAllBooks] = useState([]);
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("Added");
  const [sortOrder, setSortOrder] = useState("Ascending");

  useEffect(() => {
    setLoading(true);
    api
      .get("/api/books/")
      .then((res) => res.data)
      .then((data) => {
        setAllBooks(data);
        setBooks(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching books:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    api
      .get("/api/categories/")
      .then((res) => res.data)
      .then((data) => {
        setCategories(data);
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
      });
  }, []);

  useEffect(() => {
    let filtered = [...allBooks];

    // Filter by categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((book) =>
        selectedCategories.includes(book.category_id)
      );
    }

    // Filter by search term
    if (searchTerm.trim() !== "") {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter((book) =>
        book.title.toLowerCase().includes(lowerSearch)
      );
    }

    // Sort
    if (sortBy === "Title") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "Author") {
      filtered.sort((a, b) => a.author.localeCompare(b.author));
    } else if (sortBy === "Category") {
      filtered.sort((a, b) => a.category.localeCompare(b.category));
    } else if (sortBy === "Added") {
      filtered.sort((a, b) => new Date(a.added) - new Date(b.added));
    }

    // Reverse if descending
    if (sortOrder === "Descending") {
      filtered.reverse();
    }

    setBooks(filtered);
  }, [allBooks, selectedCategories, searchTerm, sortBy, sortOrder]);

  const handleCategorySelection = (categoryIds) => {
    setSelectedCategories(categoryIds);
    console.log("Selected categories:", categoryIds);
  };

  return (
    <div className="home">
      <div className="navbar-container">
        <Navbar />
      </div>
      <div className="search-bar">
        <SearchBar
          placeholder="Enter book title"
          onSearchInput={(value) => setSearchTerm(value)}
        />
      </div>
      <div className="filter-bar">
        <FilterBar
          categories={categories}
          selectedCategories={selectedCategories}
          onCategoryChange={handleCategorySelection}
          sortBy={sortBy}
          onSortChange={setSortBy}
          sortOrder={sortOrder}
          onOrderChange={setSortOrder}
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
              id={book.id}
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
