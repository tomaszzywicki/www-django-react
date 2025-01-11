import "../styles/SearchBar.css";

// eslint-disable-next-line react/prop-types
const SearchBar = ({ placeholder }) => {
  return (
    <div className="search-bar">
      <input className="search-input" type="text" placeholder={placeholder} />
      <button className="serach-button" type="submit">
        Search
      </button>
    </div>
  );
};

export default SearchBar;
