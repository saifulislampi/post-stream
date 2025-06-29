import React, { useState, useEffect, useRef } from "react";

export default function SearchInput({ onSearch, placeholder = "Search posts..." }) {
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef(null);

  // Debounce search to avoid too many calls
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, 300); // Wait 300ms after user stops typing

    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  // Keyboard shortcut to focus search (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClear = () => {
    setSearchTerm("");
    inputRef.current?.focus();
  };

  return (
    <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
      <input
        ref={inputRef}
        type="text"
        placeholder={`${placeholder}`}
        className="search-input"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        style={{ width: '100%', paddingRight: searchTerm ? '30px' : '12px' }}
      />
      {searchTerm && (
        <button
          onClick={handleClear}
          style={{
            position: 'absolute',
            right: '8px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#6b7280',
            fontSize: '16px',
            padding: '0',
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Clear search"
        >
          ×
        </button>
      )}
    </div>
  );
}
