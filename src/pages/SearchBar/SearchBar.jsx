
import React from "react";

const SearchBar = ({ searchTerm, setSearchTerm, placeholder }) => {
  return (
    <input
      type="text"
      className="input input-bordered w-full max-w-sm mb-4"
      placeholder={placeholder || "Search..."}
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      autoComplete="off"
    />
  );
};

export default SearchBar;
