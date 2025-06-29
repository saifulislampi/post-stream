import React from "react";
import Logo from "./Logo";
import SearchInput from "../shared/SearchInput";

export default function Header({ onHome, onSearch }) {
  return (
    <header className="header">
      <div className="container flex items-center gap-4 py-2">
        <Logo width={120} height={48} onClick={onHome} />
        <SearchInput onSearch={onSearch} />
      </div>
    </header>
  );
}
