import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MOOD_QUERIES } from '../services/api';
import './MoodButtons.css';

const MOODS = [
  { label: 'Romantic', emoji: '💕', color: '#ec4899', bg: 'rgba(236, 72, 153, 0.15)', border: 'rgba(236, 72, 153, 0.35)' },
  { label: 'Workout', emoji: '💪', color: '#f97316', bg: 'rgba(249, 115, 22, 0.15)', border: 'rgba(249, 115, 22, 0.35)' },
  { label: 'Focus', emoji: '🎯', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.15)', border: 'rgba(56, 189, 248, 0.35)' },
  { label: 'Sad', emoji: '😢', color: '#818cf8', bg: 'rgba(129, 140, 248, 0.15)', border: 'rgba(129, 140, 248, 0.35)' },
  { label: 'Party', emoji: '🎉', color: '#a855f7', bg: 'rgba(168, 85, 247, 0.15)', border: 'rgba(168, 85, 247, 0.35)' },
];

const MoodButtons = ({ activeMood, onMoodSelect }) => {
  const navigate = useNavigate();

  const handleMoodClick = (mood) => {
    const query = MOOD_QUERIES[mood.label];
    if (onMoodSelect) {
      onMoodSelect(mood.label, query);
    }
    navigate(`/search?q=${encodeURIComponent(query)}&mood=${mood.label}`);
  };

  return (
    <div className="mood-buttons">
      {MOODS.map(mood => (
        <button
          key={mood.label}
          className={`mood-btn ${activeMood === mood.label ? 'active' : ''}`}
          style={{
            '--mood-color': mood.color,
            '--mood-bg': mood.bg,
            '--mood-border': mood.border
          }}
          onClick={() => handleMoodClick(mood)}
        >
          <span className="mood-emoji">{mood.emoji}</span>
          <span>{mood.label}</span>
        </button>
      ))}
    </div>
  );
};

export default MoodButtons;
