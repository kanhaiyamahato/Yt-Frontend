import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  FaPlay, FaPause, FaStepForward, FaStepBackward,
  FaRandom, FaRedo, FaHeart, FaRegHeart, FaVolumeUp,
  FaVolumeMute, FaVolumeDown, FaListUl, FaExpand,
  FaCompress
} from 'react-icons/fa';
import { usePlayer } from '../context/PlayerContext';
import './PlayerBar.css';

const PlayerBar = () => {
  const {
    currentSong, isPlaying, setIsPlaying, progress, setProgress,
    duration, setDuration, currentTime, setCurrentTime, volume, isMuted,
    isShuffle, setIsShuffle, isRepeat, setIsRepeat, isExpanded, setIsExpanded,
    playerRef, progressIntervalRef, toggleLike, isLiked, seekTo, changeVolume,
    toggleMute, playNext, playPrev
  } = usePlayer();

  const iframeContainerRef = useRef(null);
  const [showQueue, setShowQueue] = useState(false);
  const [imageError, setImageError] = useState(false);
  const playerInstanceRef = useRef(null);
  const isReadyRef = useRef(false);

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
  }, []);

  useEffect(() => {
    if (!currentSong) return;
    setImageError(false);

    const initPlayer = () => {
      if (playerInstanceRef.current) {
        try {
          playerInstanceRef.current.loadVideoById(currentSong.videoId);
          playerInstanceRef.current.playVideo();
        } catch (e) {
          createPlayer();
        }
        return;
      }
      createPlayer();
    };

    const createPlayer = () => {
      if (!window.YT || !window.YT.Player) {
        window.onYouTubeIframeAPIReady = initPlayer;
        return;
      }

      const container = document.getElementById('yt-player-container');
      if (!container) return;

      playerInstanceRef.current = new window.YT.Player('yt-player-container', {
        height: '0',
        width: '0',
        videoId: currentSong.videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          enablejsapi: 1,
          iv_load_policy: 3,
          modestbranding: 1,
          origin: window.location.origin,
          playsinline: 1,
          rel: 0
        },
        events: {
          onReady: (event) => {
            isReadyRef.current = true;
            playerRef.current = playerInstanceRef.current;
            playerRef.current.setVolume(volume);
            playerRef.current.playVideo();
            startProgressTracking();
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
              startProgressTracking();
            } else if (event.data === window.YT.PlayerState.PAUSED) {
              setIsPlaying(false);
              stopProgressTracking();
            } else if (event.data === window.YT.PlayerState.ENDED) {
              if (isRepeat) {
                playerRef.current.seekTo(0);
                playerRef.current.playVideo();
              } else {
                playNext();
              }
            }
          },
          onError: (event) => {
            console.error('YouTube player error:', event.data);
          }
        }
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }
  }, [currentSong?.videoId]);

  const startProgressTracking = useCallback(() => {
    stopProgressTracking();
    progressIntervalRef.current = setInterval(() => {
      if (playerRef.current && isReadyRef.current) {
        try {
          const currentT = playerRef.current.getCurrentTime() || 0;
          const totalDuration = playerRef.current.getDuration() || 0;
          if (totalDuration > 0) {
            setCurrentTime(currentT);
            setDuration(totalDuration);
            setProgress((currentT / totalDuration) * 100);
          }
        } catch (e) {}
      }
    }, 500);
  }, []);

  const stopProgressTracking = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => stopProgressTracking();
  }, []);

  const handlePlayPause = () => {
    if (!playerRef.current || !isReadyRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
      startProgressTracking();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressClick = (e) => {
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const percentage = ((e.clientX - rect.left) / rect.width) * 100;
    seekTo(Math.max(0, Math.min(100, percentage)));
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const liked = currentSong ? isLiked(currentSong.videoId) : false;
  const fallbackImg = currentSong ? `https://picsum.photos/seed/${currentSong.videoId}/60/60` : '';

  if (!currentSong) {
    return (
      <div className="player-bar player-bar-empty">
        <div id="yt-player-container" style={{ display: 'none' }} />
        <div className="player-empty-text">
          <span>🎵 Select a song to start playing</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`player-bar ${isExpanded ? 'expanded' : ''}`}>
      <div id="yt-player-container" style={{ display: 'none' }} />
      
      {/* Progress bar at top */}
      <div className="progress-bar-container" onClick={handleProgressClick}>
        <div className="progress-bar-bg">
          <div
            className="progress-bar-fill"
            style={{ width: `${progress}%` }}
          >
            <div className="progress-thumb" />
          </div>
        </div>
      </div>

      <div className="player-inner">
        {/* Left: Song Info */}
        <div className="player-song-info">
          <div className="player-thumb">
            <img
              src={imageError ? fallbackImg : (currentSong.thumbnail || fallbackImg)}
              alt={currentSong.title}
              onError={() => setImageError(true)}
            />
            {isPlaying && (
              <div className="player-thumb-playing">
                <span></span><span></span><span></span>
              </div>
            )}
          </div>
          <div className="player-song-text">
            <p className="player-song-title">{currentSong.title}</p>
            <p className="player-song-artist">{currentSong.channelTitle}</p>
          </div>
          <button className="player-like-btn" onClick={() => currentSong && toggleLike(currentSong)}>
            {liked ? <FaHeart style={{ color: '#ec4899' }} /> : <FaRegHeart />}
          </button>
        </div>

        {/* Center: Controls */}
        <div className="player-controls">
          <button
            className={`ctrl-btn ${isShuffle ? 'active' : ''}`}
            onClick={() => setIsShuffle(!isShuffle)}
            title="Shuffle"
          >
            <FaRandom />
          </button>
          <button className="ctrl-btn" onClick={playPrev} title="Previous">
            <FaStepBackward />
          </button>
          <button className="play-pause-btn" onClick={handlePlayPause}>
            {isPlaying ? <FaPause /> : <FaPlay style={{ paddingLeft: '2px' }} />}
          </button>
          <button className="ctrl-btn" onClick={playNext} title="Next">
            <FaStepForward />
          </button>
          <button
            className={`ctrl-btn ${isRepeat ? 'active' : ''}`}
            onClick={() => setIsRepeat(!isRepeat)}
            title="Repeat"
          >
            <FaRedo />
          </button>
        </div>

        {/* Right: Volume & Extra */}
        <div className="player-right">
          <span className="player-time">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
          
          <div className="volume-wrapper">
            <button className="ctrl-btn-sm" onClick={toggleMute}>
              {isMuted || volume === 0 ? <FaVolumeMute /> : 
               volume < 50 ? <FaVolumeDown /> : <FaVolumeUp />}
            </button>
            <div className="volume-slider-track">
              <div className="volume-fill" style={{ width: `${isMuted ? 0 : volume}%` }} />
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => changeVolume(parseInt(e.target.value))}
                className="volume-input"
              />
            </div>
          </div>
          
          <button
            className={`ctrl-btn-sm ${showQueue ? 'active' : ''}`}
            onClick={() => setShowQueue(!showQueue)}
            title="Queue"
          >
            <FaListUl />
          </button>
          <button
            className="ctrl-btn-sm"
            onClick={() => setIsExpanded(!isExpanded)}
            title="Expand"
          >
            {isExpanded ? <FaCompress /> : <FaExpand />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerBar;
