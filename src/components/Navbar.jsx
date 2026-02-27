import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaSearch, FaBell, FaCog, FaUserCircle, FaPlay } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch(e);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo">
          <div className="logo-icon">
            <FaPlay />
          </div>
          <span className="logo-text">MusicPlayer</span>
        </Link>
      </div>

      <div className="navbar-center">
        <div className="search-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search songs, albums, artists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>

      <div className="navbar-right">
        <button className="nav-icon-btn" title="Notifications">
          <FaBell />
          <span className="notification-dot"></span>
        </button>
        <button className="nav-icon-btn" title="Settings">
          <FaCog />
        </button>
        <div className="avatar">
          <FaUserCircle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
