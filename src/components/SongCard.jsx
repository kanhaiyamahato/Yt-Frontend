import React, { useState } from 'react';
import { FaPlay, FaHeart, FaRegHeart, FaEllipsisH } from 'react-icons/fa';
import { usePlayer } from '../context/PlayerContext';
import './SongCard.css';

const SongCard = ({ song, queue = [], variant = 'default' }) => {
  const { playSong, toggleLike, isLiked, currentSong, isPlaying } = usePlayer();
  const [imageError, setImageError] = useState(false);
  const liked = isLiked(song.videoId);
  const isCurrentSong = currentSong?.videoId === song.videoId;

  const handlePlay = (e) => {
    e.stopPropagation();
    playSong(song, queue.length > 0 ? queue : [song]);
  };

  const handleLike = (e) => {
    e.stopPropagation();
    toggleLike(song);
  };

  const fallbackImage = `https://picsum.photos/seed/${song.videoId}/320/180`;

  if (variant === 'horizontal') {
    return (
      <div className={`song-card-horizontal ${isCurrentSong ? 'playing' : ''}`} onClick={handlePlay}>
        <div className="song-card-h-thumb">
          <img
            src={imageError ? fallbackImage : (song.thumbnail || fallbackImage)}
            alt={song.title}
            onError={() => setImageError(true)}
          />
          <div className="song-card-h-overlay">
            <div className="play-btn-small">
              <FaPlay />
            </div>
          </div>
          {isCurrentSong && isPlaying && (
            <div className="playing-indicator">
              <span></span><span></span><span></span>
            </div>
          )}
        </div>
        <div className="song-card-h-info">
          <p className="song-card-h-title">{song.title}</p>
          <p className="song-card-h-artist">{song.channelTitle}</p>
        </div>
        <div className="song-card-h-duration">{song.duration}</div>
        <button className="song-card-like" onClick={handleLike}>
          {liked ? <FaHeart style={{ color: '#ec4899' }} /> : <FaRegHeart />}
        </button>
      </div>
    );
  }

  return (
    <div className={`song-card ${isCurrentSong ? 'playing' : ''}`}>
      <div className="song-card-thumb">
        <img
          src={imageError ? fallbackImage : (song.thumbnail || fallbackImage)}
          alt={song.title}
          onError={() => setImageError(true)}
        />
        <div className="song-card-overlay">
          <button className="play-btn-overlay" onClick={handlePlay}>
            <FaPlay />
          </button>
        </div>
        {isCurrentSong && isPlaying && (
          <div className="playing-indicator">
            <span></span><span></span><span></span>
          </div>
        )}
        {song.duration && (
          <span className="song-duration-badge">{song.duration}</span>
        )}
      </div>
      <div className="song-card-info">
        <div className="song-card-title-row">
          <p className="song-card-title" title={song.title}>{song.title}</p>
          <button className="song-card-like" onClick={handleLike}>
            {liked ? <FaHeart style={{ color: '#ec4899' }} /> : <FaRegHeart />}
          </button>
        </div>
        <p className="song-card-artist">{song.channelTitle}</p>
      </div>
    </div>
  );
};

export default SongCard;
