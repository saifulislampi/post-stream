import React from "react";

export default function SearchInput({ onSearch, placeholder = "Search posts..." }) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      className="search-input"
      onChange={e => onSearch(e.target.value)}
    />
  );
}
