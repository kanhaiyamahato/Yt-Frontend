import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaHome, FaCompass, FaBookmark, FaHeart, FaHistory,
  FaDumbbell, FaMoon, FaPlus, FaMusic
} from 'react-icons/fa';
import { usePlayer } from '../context/PlayerContext';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const { likedSongs, recentlyPlayed } = usePlayer();

  const mainLinks = [
    { path: '/', icon: <FaHome />, label: 'Home' },
    { path: '/explore', icon: <FaCompass />, label: 'Explore' },
    { path: '/library', icon: <FaBookmark />, label: 'Library' },
  ];

  const collectionLinks = [
    { path: '/liked', icon: <FaHeart />, label: 'Liked Songs', count: likedSongs.length, color: '#ec4899' },
    { path: '/recent', icon: <FaHistory />, label: 'Recently Played', count: recentlyPlayed.length, color: '#a855f7' },
    { path: '/search?q=gym+workout+songs', icon: <FaDumbbell />, label: 'Workout Mix', color: '#f97316' },
    { path: '/search?q=sleep+sounds+relaxing', icon: <FaMoon />, label: 'Sleep Sounds', color: '#38bdf8' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path.split('?')[0]);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <span className="sidebar-label">MENU</span>
        <nav className="sidebar-nav">
          {mainLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`sidebar-link ${isActive(link.path) ? 'active' : ''}`}
            >
              <span className="sidebar-link-icon">{link.icon}</span>
              <span className="sidebar-link-text">{link.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="sidebar-divider" />

      <div className="sidebar-section">
        <span className="sidebar-label">YOUR COLLECTION</span>
        <nav className="sidebar-nav">
          {collectionLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`sidebar-link ${isActive(link.path) ? 'active' : ''}`}
            >
              <span className="sidebar-link-icon" style={{ color: link.color }}>
                {link.icon}
              </span>
              <span className="sidebar-link-text">{link.label}</span>
              {link.count !== undefined && link.count > 0 && (
                <span className="sidebar-count">{link.count}</span>
              )}
            </Link>
          ))}
        </nav>
      </div>

      <div className="sidebar-bottom">
        <button className="new-playlist-btn">
          <FaPlus />
          <span>New Playlist</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
