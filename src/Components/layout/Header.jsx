import React from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import SearchInput from "../shared/SearchInput";

export default function Header({ onHome, onSearch, currentUser }) {
  return (
    <header className="header">
      <div className="header-content">
        <Logo width={120} height={48} onClick={onHome} />
        <SearchInput onSearch={onSearch} />
        
        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {currentUser && (
            <Link 
              to={`/user/${currentUser.id}`} 
              style={{ 
                textDecoration: 'none', 
                color: 'var(--accent)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: '500'
              }}
            >
              <div style={{
                width: 24, 
                height: 24, 
                borderRadius: '50%',
                background: 'var(--accent)', 
                color: '#fff',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: 12, 
                fontWeight: 700
              }}>
                {currentUser.firstName?.[0]?.toUpperCase() || '?'}
              </div>
              {currentUser.username ? `@${currentUser.username}` : 'Profile'}
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}