import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';

const PlayerContext = createContext();

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) throw new Error('usePlayer must be used within PlayerProvider');
  return context;
};

export const PlayerProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [likedSongs, setLikedSongs] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const playerRef = useRef(null);
  const progressIntervalRef = useRef(null);

  const addToRecentlyPlayed = useCallback((song) => {
    setRecentlyPlayed(prev => {
      const filtered = prev.filter(s => s.videoId !== song.videoId);
      return [song, ...filtered].slice(0, 10);
    });
  }, []);

  const playSong = useCallback((song, songQueue = []) => {
    setCurrentSong(song);
    setIsPlaying(true);
    setProgress(0);
    setCurrentTime(0);
    if (songQueue.length > 0) {
      setQueue(songQueue);
      const idx = songQueue.findIndex(s => s.videoId === song.videoId);
      setCurrentIndex(idx >= 0 ? idx : 0);
    }
    addToRecentlyPlayed(song);
  }, [addToRecentlyPlayed]);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
    }
  }, [isPlaying]);

  const playNext = useCallback(() => {
    if (queue.length === 0) return;
    let nextIndex;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else {
      nextIndex = (currentIndex + 1) % queue.length;
    }
    setCurrentIndex(nextIndex);
    playSong(queue[nextIndex], queue);
  }, [queue, currentIndex, isShuffle, playSong]);

  const playPrev = useCallback(() => {
    if (queue.length === 0) return;
    const prevIndex = currentIndex === 0 ? queue.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    playSong(queue[prevIndex], queue);
  }, [queue, currentIndex, playSong]);

  const toggleLike = useCallback((song) => {
    setLikedSongs(prev => {
      const isLiked = prev.some(s => s.videoId === song.videoId);
      if (isLiked) {
        return prev.filter(s => s.videoId !== song.videoId);
      } else {
        return [song, ...prev];
      }
    });
  }, []);

  const isLiked = useCallback((videoId) => {
    return likedSongs.some(s => s.videoId === videoId);
  }, [likedSongs]);

  const seekTo = useCallback((percentage) => {
    if (playerRef.current && duration > 0) {
      const time = (percentage / 100) * duration;
      playerRef.current.seekTo(time, true);
      setCurrentTime(time);
      setProgress(percentage);
    }
  }, [duration]);

  const changeVolume = useCallback((vol) => {
    setVolume(vol);
    if (playerRef.current) {
      playerRef.current.setVolume(vol);
    }
    if (vol === 0) setIsMuted(true);
    else setIsMuted(false);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      if (playerRef.current) {
        if (!prev) {
          playerRef.current.mute();
        } else {
          playerRef.current.unMute();
          playerRef.current.setVolume(volume);
        }
      }
      return !prev;
    });
  }, [volume]);

  const value = {
    currentSong,
    isPlaying,
    setIsPlaying,
    queue,
    setQueue,
    currentIndex,
    setCurrentIndex,
    progress,
    setProgress,
    duration,
    setDuration,
    currentTime,
    setCurrentTime,
    volume,
    isMuted,
    isShuffle,
    setIsShuffle,
    isRepeat,
    setIsRepeat,
    isExpanded,
    setIsExpanded,
    likedSongs,
    recentlyPlayed,
    playerRef,
    progressIntervalRef,
    playSong,
    togglePlay,
    playNext,
    playPrev,
    toggleLike,
    isLiked,
    seekTo,
    changeVolume,
    toggleMute,
    addToRecentlyPlayed
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
};

export default PlayerContext;
