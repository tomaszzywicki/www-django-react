/* eslint-disable react/prop-types */
import { useRef, useState, useEffect } from "react";
import "../styles/FilterBar.css";

const FilterBar = ({
  categories,
  selectedCategories,
  onCategoryChange,
  sortBy,
  onSortChange,
  sortOrder,
  onOrderChange,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    let updatedCategories = [...selectedCategories];

    if (value === "All") {
      if (checked) {
        updatedCategories = [];
      }
    } else {
      const categoryId = parseInt(value, 10);
      if (checked) {
        updatedCategories.push(categoryId);
      } else {
        updatedCategories = updatedCategories.filter((id) => id !== categoryId);
      }
    }

    onCategoryChange(updatedCategories);
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
    selectedCategories.length === 0
      ? "All"
      : categories
          .filter((cat) => selectedCategories.includes(cat.id))
          .map((cat) => cat.name)
          .join(", ");

  return (
    <div className="filter-bar">
      <span>Sort by</span>
      <select value={sortBy} onChange={(e) => onSortChange(e.target.value)}>
        <option value="Title">Title</option>
        <option value="Author">Author</option>
        <option value="Category">Category</option>
        <option value="Added">Added</option>
      </select>

      <span>Order</span>
      <select value={sortOrder} onChange={(e) => onOrderChange(e.target.value)}>
        <option value="Ascending">Ascending</option>
        <option value="Descending">Descending</option>
      </select>

      <span>Category</span>
      <div className="multi-select" ref={dropdownRef}>
        <div
          className="select-box"
          onClick={toggleDropdown}
          aria-haspopup="listbox"
          aria-expanded={isDropdownOpen}
        >
          <span className="selected-text" title={displayText}>
            {displayText}
          </span>
          <span className="arrow">{isDropdownOpen ? "▲" : "▼"}</span>
        </div>
        {isDropdownOpen && (
          <div className="options-container" role="listbox">
            <label className="option">
              <input
                type="checkbox"
                value="All"
                checked={selectedCategories.length === 0}
                onChange={handleCategoryChange}
              />
              All
            </label>
            {categories.map((category) => (
              <label key={category.id} className="option">
                <input
                  type="checkbox"
                  value={category.id}
                  checked={selectedCategories.includes(category.id)}
                  onChange={handleCategoryChange}
                />
                {category.name}
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
