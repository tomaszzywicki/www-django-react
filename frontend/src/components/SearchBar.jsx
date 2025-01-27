import "../styles/SearchBar.css";

// eslint-disable-next-line react/prop-types
const SearchBar = ({ placeholder, onSearchInput }) => {
  return (
    <div className="search-bar">
      <input
        className="search-input"
        type="text"
        placeholder={placeholder}
        onChange={(e) => onSearchInput(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
