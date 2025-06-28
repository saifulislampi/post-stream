import React from "react";

export default function Search({ onSearch, placeholder = "Search posts..." }) {
  return (
    <div className="search-container">
      <input
        type="text"
        placeholder={placeholder}
        className="search-input"
        onChange={e => onSearch(e.target.value)}
      />
    </div>
  );
}