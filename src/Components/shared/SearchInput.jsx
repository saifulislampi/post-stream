import React, { useState, useEffect, useRef } from "react";

export default function SearchInput({ onSearch, placeholder = "Search posts..." }) {
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleClear = () => {
    setSearchTerm("");
    inputRef.current?.focus();
  };

  return (
    <div className="position-relative w-100">
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        className="form-control"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ paddingRight: searchTerm ? "30px" : "12px" }}
      />
      {searchTerm && (
        <button
          onClick={handleClear}
          style={{
            position: "absolute",
            right: "8px",
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#6b7280",
            fontSize: "16px",
            padding: 0,
            width: "20px",
            height: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          title="Clear search"
        >
          ×
        </button>
      )}
    </div>
  );
}