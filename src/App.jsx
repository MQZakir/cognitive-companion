import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import AccessibilityBar from './components/AccessibilityBar';
import AmbientAudio from './components/AmbientAudio';
import SynataChat, { SynataFAB } from './components/SynataChat';

// Pages
import Home from './pages/Home';
import Companion from './pages/Companion';
import QuranDhikr from './pages/QuranDhikr';
import SalahTracker from './pages/Salahtracker.jsx';
import { MoodTracker } from './pages/OtherPages';
import { Insights } from './pages/OtherPages';
import { Journal } from './pages/OtherPages';
import { Community } from './pages/OtherPages';
import { Profile } from './pages/OtherPages';
import { Settings } from './pages/OtherPages';
import { Focus } from './pages/FocusExercises';
import { Exercises } from './pages/FocusExercises';

import './index.css';

function AppShell() {
  const { chatOpen } = useApp();

  return (
    <div className="app-layout">
      {/* Islamic geometric background */}
      <div className="bg-layer" aria-hidden="true">
        <div className="bg-geo" />
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div className="bg-orb bg-orb-3" />
      </div>

      <Sidebar />

      <div className="main-content">
        <AccessibilityBar />

        <div className="main-content-inner" id="main-content">
          <Routes>
            <Route path="/"          element={<Home />} />
            <Route path="/companion" element={<Companion />} />
            <Route path="/quran"     element={<QuranDhikr />} />
            <Route path="/salah"     element={<SalahTracker />} />
            <Route path="/mood"      element={<MoodTracker />} />
            <Route path="/insights"  element={<Insights />} />
            <Route path="/focus"     element={<Focus />} />
            <Route path="/journal"   element={<Journal />} />
            <Route path="/exercises" element={<Exercises />} />
            <Route path="/community" element={<Community />} />
            <Route path="/profile"   element={<Profile />} />
            <Route path="/settings"  element={<Settings />} />
          </Routes>
        </div>
      </div>

      {/* Ambient sound */}
      <AmbientAudio />

      {/* Synata floating chat */}
      <SynataFAB />
      {chatOpen && <SynataChat embedded={false} />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppShell />
      </AppProvider>
    </BrowserRouter>
  );
}