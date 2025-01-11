import { useRef, useState, useEffect } from "react";

import "../styles/FilterBar.css";

// eslint-disable-next-line react/prop-types
const FilterBar = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const categories = ["Fiction", "Non-Fiction", "Science", "History"];
  // tutaj zrobić potem branie kategorii z API

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedCategories((prev) => [...prev, value]);
    } else {
      setSelectedCategories((prev) =>
        prev.filter((category) => category !== value)
      );
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const displayText =
    selectedCategories.length === 0 ? "All" : selectedCategories.join(", ");

  return (
    <div className="filter-bar">
      <span>Sort by</span>
      <select defaultValue={"Title"}>
        <option value="Title">Title</option>
        <option value="Author">Author</option>
        <option value="Category">Category</option>
      </select>
      <span>Order</span>
      <select defaultValue={"Ascending"}>
        <option value="Ascending">Ascending</option>
        <option value="Descending">Descending</option>
      </select>
      <span>Category</span>
      <div className="multi-select" ref={dropdownRef}>
        <div className="select-box" onClick={toggleDropdown}>
          <span className="selected-text">{displayText}</span>
          <span className="arrow">{isDropdownOpen ? "▲" : "▼"}</span>
        </div>
        {isDropdownOpen && (
          <div className="options-container">
            <label className="option">
              <input
                type="checkbox"
                value="All"
                checked={selectedCategories.length === 0}
                onChange={() => setSelectedCategories([])}
              />
              All
            </label>
            {categories.map((category) => (
              <label key={category} className="option">
                <input
                  type="checkbox"
                  value={category}
                  checked={selectedCategories.includes(category)}
                  onChange={handleCategoryChange}
                />
                {category}
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
