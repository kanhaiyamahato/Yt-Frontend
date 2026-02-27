import React from 'react';
import { FaHeart, FaPlay, FaRandom, FaMusic } from 'react-icons/fa';
import SongCard from '../components/SongCard';
import { usePlayer } from '../context/PlayerContext';
import './Library.css';

const Library = () => {
  const { likedSongs, recentlyPlayed, playSong } = usePlayer();

  const handlePlayAll = (songs) => {
    if (songs.length > 0) {
      playSong(songs[0], songs);
    }
  };

  const handleShuffle = (songs) => {
    if (songs.length > 0) {
      const shuffled = [...songs].sort(() => Math.random() - 0.5);
      playSong(shuffled[0], shuffled);
    }
  };

  return (
    <div className="library-page">
      <div className="library-header">
        <h1 className="library-title">Your Library</h1>
        <p className="library-sub">{likedSongs.length + recentlyPlayed.length} songs total</p>
      </div>

      {/* Liked Songs */}
      <section className="library-section">
        <div className="library-section-header">
          <div className="lib-title-row">
            <div className="lib-icon-box" style={{ background: 'linear-gradient(135deg, #ec4899, #be185d)' }}>
              <FaHeart />
            </div>
            <div>
              <h2 className="lib-section-title">Liked Songs</h2>
              <p className="lib-section-count">{likedSongs.length} songs</p>
            </div>
          </div>
          {likedSongs.length > 0 && (
            <div className="lib-actions">
              <button className="lib-action-btn" onClick={() => handlePlayAll(likedSongs)}>
                <FaPlay /> Play
              </button>
              <button className="lib-action-btn secondary" onClick={() => handleShuffle(likedSongs)}>
                <FaRandom /> Shuffle
              </button>
            </div>
          )}
        </div>

        {likedSongs.length === 0 ? (
          <div className="lib-empty">
            <FaHeart className="lib-empty-icon" />
            <p>No liked songs yet</p>
            <span>Heart songs while listening to add them here</span>
          </div>
        ) : (
          <div className="songs-grid">
            {likedSongs.map(song => (
              <SongCard key={song.videoId} song={song} queue={likedSongs} />
            ))}
          </div>
        )}
      </section>

      {/* Recently Played */}
      <section className="library-section">
        <div className="library-section-header">
          <div className="lib-title-row">
            <div className="lib-icon-box" style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
              <FaMusic />
            </div>
            <div>
              <h2 className="lib-section-title">Recently Played</h2>
              <p className="lib-section-count">{recentlyPlayed.length} songs</p>
            </div>
          </div>
          {recentlyPlayed.length > 0 && (
            <div className="lib-actions">
              <button className="lib-action-btn" onClick={() => handlePlayAll(recentlyPlayed)}>
                <FaPlay /> Play
              </button>
              <button className="lib-action-btn secondary" onClick={() => handleShuffle(recentlyPlayed)}>
                <FaRandom /> Shuffle
              </button>
            </div>
          )}
        </div>

        {recentlyPlayed.length === 0 ? (
          <div className="lib-empty">
            <FaMusic className="lib-empty-icon" />
            <p>No recently played songs</p>
            <span>Start listening to fill this section</span>
          </div>
        ) : (
          <div className="songs-grid">
            {recentlyPlayed.map(song => (
              <SongCard key={song.videoId} song={song} queue={recentlyPlayed} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Library;
