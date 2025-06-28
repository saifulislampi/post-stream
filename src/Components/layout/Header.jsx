import React from "react";
import Logo from "./Logo";
import Search from "../shared/Search";

export default function Header({ onHome, onSearch }) {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Logo width={120} height={48} onClick={onHome} />
          <Search onSearch={onSearch} />
        </div>
      </div>
    </header>
  );
}