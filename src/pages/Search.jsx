import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaSearch, FaFilter, FaPlay, FaHeart, FaRegHeart } from 'react-icons/fa';
import SongCard from '../components/SongCard';
import { searchSongs } from '../services/api';
import { usePlayer } from '../context/PlayerContext';
import './Search.css';

const TABS = ['All', 'Songs', 'Videos', 'Albums', 'Playlists'];

const Search = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  const moodParam = searchParams.get('mood') || '';
  
  const [activeTab, setActiveTab] = useState('All');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState(query);
  const { playSong } = usePlayer();

  useEffect(() => {
    setSearchInput(query);
    if (query) {
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (q) => {
    if (!q.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await searchSongs(q, 20);
      setResults(data.results || []);
    } catch (err) {
      setError('Failed to fetch results. Check your API key or network.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  const handlePlayAll = () => {
    if (results.length > 0) {
      playSong(results[0], results);
    }
  };

  return (
    <div className="search-page">
      {/* Inline search bar */}
      <div className="search-page-header">
        <form onSubmit={handleSearchSubmit} className="search-page-form">
          <FaSearch className="sp-search-icon" />
          <input
            type="text"
            className="sp-search-input"
            placeholder="Search songs, artists, albums..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
          />
          {searchInput && (
            <button type="button" className="sp-clear-btn" onClick={() => { setSearchInput(''); setResults([]); }}>
              ✕
            </button>
          )}
        </form>
      </div>

      {query && (
        <>
          {/* Tabs */}
          <div className="search-tabs">
            {TABS.map(tab => (
              <button
                key={tab}
                className={`search-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Results header */}
          <div className="search-results-header">
            <h2 className="search-results-title">
              Search Results for <span className="search-query-highlight">"{query}"</span>
              {moodParam && <span className="mood-badge">{moodParam}</span>}
            </h2>
            {results.length > 0 && (
              <button className="play-all-btn" onClick={handlePlayAll}>
                <FaPlay /> Play All
              </button>
            )}
          </div>

          {/* Error state */}
          {error && (
            <div className="search-error">
              <p>{error}</p>
              <button onClick={() => performSearch(query)}>Retry</button>
            </div>
          )}

          {/* Loading skeleton */}
          {loading && (
            <div className="search-grid">
              {Array(12).fill(0).map((_, i) => (
                <div key={i} className="song-card-skeleton">
                  <div className="skeleton-thumb" />
                  <div className="skeleton-info">
                    <div className="skeleton-title" />
                    <div className="skeleton-artist" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Results grid */}
          {!loading && results.length > 0 && (
            <div className="search-grid">
              {results.map((song, i) => (
                <SongCard
                  key={song.videoId || i}
                  song={song}
                  queue={results}
                />
              ))}
            </div>
          )}

          {/* No results */}
          {!loading && !error && results.length === 0 && query && (
            <div className="no-results">
              <div className="no-results-icon">🎵</div>
              <h3>No results found</h3>
              <p>Try searching with different keywords</p>
            </div>
          )}
        </>
      )}

      {/* Empty state */}
      {!query && (
        <div className="search-empty">
          <div className="search-empty-icon">🔍</div>
          <h3>Search for music</h3>
          <p>Find your favorite songs, artists, and playlists</p>
          <div className="trending-tags">
            {['Synthwave', 'Lo-fi', 'Hip Hop', 'Pop', 'Electronic', 'Jazz', 'Classical'].map(tag => (
              <button
                key={tag}
                className="trending-tag"
                onClick={() => navigate(`/search?q=${tag}`)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
