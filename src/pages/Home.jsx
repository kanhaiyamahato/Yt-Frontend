import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaFire, FaClock, FaMusic } from 'react-icons/fa';
import MoodButtons from '../components/MoodButtons';
import SongCard from '../components/SongCard';
import { searchSongs } from '../services/api';
import { usePlayer } from '../context/PlayerContext';
import './Home.css';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  if (hour < 21) return 'Good Evening';
  return 'Good Night';
};

const FEATURED_PLAYLISTS = [
  { id: 'pl1', title: 'My Supermix', subtitle: 'Based on your history', color: '#7c3aed', img: 'https://picsum.photos/seed/mix1/80/80' },
  { id: 'pl2', title: 'Discover Mix', subtitle: 'New songs for you', color: '#ec4899', img: 'https://picsum.photos/seed/mix2/80/80' },
  { id: 'pl3', title: 'Replay Mix', subtitle: 'Your favorites', color: '#f97316', img: 'https://picsum.photos/seed/mix3/80/80' },
];

const Home = () => {
  const navigate = useNavigate();
  const { recentlyPlayed, playSong } = usePlayer();
  const [trendingSongs, setTrendingSongs] = useState([]);
  const [featuredSongs, setFeaturedSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrollRef] = useState(React.createRef());

  useEffect(() => {
    loadInitialSongs();
  }, []);

  const loadInitialSongs = async () => {
    setLoading(true);
    try {
      const [res1, res2] = await Promise.allSettled([
        searchSongs('synthwave mix 2024', 12),
        searchSongs('chill vibes playlist', 8)
      ]);
      
      if (res1.status === 'fulfilled') {
        setTrendingSongs(res1.value.results || []);
      }
      if (res2.status === 'fulfilled') {
        setFeaturedSongs(res2.value.results || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="home-page">
      {/* Header */}
      <div className="home-header">
        <h1 className="greeting">{getGreeting()}</h1>
        <MoodButtons />
      </div>

      {/* Recently Played */}
      <section className="home-section">
        <div className="section-header">
          <div className="section-title-row">
            <FaClock className="section-icon" />
            <h2 className="section-title">Recently Played</h2>
          </div>
          <div className="section-scroll-btns">
            <button className="scroll-btn" onClick={scrollLeft}><FaChevronLeft /></button>
            <button className="scroll-btn" onClick={scrollRight}><FaChevronRight /></button>
          </div>
        </div>

        {recentlyPlayed.length === 0 ? (
          <div className="recently-played-grid" ref={scrollRef}>
            {/* Skeleton / placeholder cards */}
            {trendingSongs.slice(0, 5).map((song, i) => (
              <div key={song.videoId || i} className="recently-card" onClick={() => playSong(song, trendingSongs)}>
                <div className="recently-card-thumb">
                  <img src={song.thumbnail} alt={song.title} onError={e => e.target.src = `https://picsum.photos/seed/${i}/320/180`} />
                  <div className="recently-card-overlay">▶</div>
                </div>
                <p className="recently-card-title">{song.title}</p>
                <p className="recently-card-artist">{song.channelTitle}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="recently-played-grid" ref={scrollRef}>
            {recentlyPlayed.map((song, i) => (
              <div key={song.videoId || i} className="recently-card" onClick={() => playSong(song, recentlyPlayed)}>
                <div className="recently-card-thumb">
                  <img src={song.thumbnail} alt={song.title} onError={e => e.target.src = `https://picsum.photos/seed/${i}/320/180`} />
                  <div className="recently-card-overlay">▶</div>
                </div>
                <p className="recently-card-title">{song.title}</p>
                <p className="recently-card-artist">{song.channelTitle}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Mixed For You */}
      <section className="home-section">
        <div className="section-header">
          <div className="section-title-row">
            <FaFire className="section-icon" style={{ color: '#f97316' }} />
            <h2 className="section-title">Mixed for You</h2>
          </div>
          <button className="see-all-btn" onClick={() => navigate('/search?q=popular+music+2024')}>
            See all
          </button>
        </div>
        <div className="mixed-grid">
          {FEATURED_PLAYLISTS.map((pl) => (
            <div
              key={pl.id}
              className="mixed-card"
              style={{ '--card-color': pl.color }}
              onClick={() => navigate(`/search?q=${pl.title}`)}
            >
              <img src={pl.img} alt={pl.title} className="mixed-card-img" />
              <div className="mixed-card-info">
                <p className="mixed-card-title">{pl.title}</p>
                <p className="mixed-card-sub">{pl.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Songs Grid */}
      <section className="home-section">
        <div className="section-header">
          <div className="section-title-row">
            <FaMusic className="section-icon" style={{ color: '#a855f7' }} />
            <h2 className="section-title">Trending Now</h2>
          </div>
          <button className="see-all-btn" onClick={() => navigate('/search?q=trending+songs+2024')}>
            See all
          </button>
        </div>
        {loading ? (
          <div className="songs-grid">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="song-card-skeleton">
                <div className="skeleton-thumb" />
                <div className="skeleton-info">
                  <div className="skeleton-title" />
                  <div className="skeleton-artist" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="songs-grid">
            {trendingSongs.map(song => (
              <SongCard key={song.videoId} song={song} queue={trendingSongs} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
