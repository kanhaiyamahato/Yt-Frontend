import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PlayerProvider } from './context/PlayerContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import PlayerBar from './components/PlayerBar';
import Home from './pages/Home';
import Search from './pages/Search';
import Library from './pages/Library';
import './App.css';

const App = () => {
  return (
    <PlayerProvider>
      <Router>
        <div className="app">
          <Navbar />
          <div className="app-body">
            <Sidebar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/explore" element={<Search />} />
                <Route path="/library" element={<Library />} />
                <Route path="/liked" element={<Library />} />
                <Route path="/recent" element={<Library />} />
                <Route path="*" element={<Home />} />
              </Routes>
            </main>
          </div>
          <PlayerBar />
        </div>
      </Router>
    </PlayerProvider>
  );
};

export default App;
