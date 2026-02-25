import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const navItems = [
  { to: '/',          icon: '🕌', label: 'Home' },
  { to: '/companion', icon: '✦',  label: 'Synata' },
  { to: '/quran',     icon: '📖', label: 'Quran & Dhikr' },
  { to: '/salah',     icon: '🧎', label: 'Salah Tracker' },
  { to: '/mood',      icon: '🌙', label: 'Mood Tracker' },
  { to: '/insights',  icon: '📊', label: 'Insights' },
  { to: '/focus',     icon: '⚡', label: 'Focus Tools' },
  { to: '/journal',   icon: '📓', label: 'Journal' },
  { to: '/exercises', icon: '🌿', label: 'Exercises' },
  { to: '/community', icon: '💫', label: 'Community' },
  { to: '/profile',   icon: '👤', label: 'Profile' },
  { to: '/settings',  icon: '⚙️', label: 'Settings' },
];

export default function Sidebar() {
  const { user, disabilities, prayerLog, prayers, speak } = useApp();
  const disability = disabilities.find(d => d.id === user.disability) || disabilities[0];
  const prayersDone = Object.values(prayerLog).filter(Boolean).length;

  return (
    <aside className="sidebar" role="navigation" aria-label="Main navigation">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-mark" aria-hidden="true">☽</div>
        <div className="logo-text-wrap">
          <span className="logo-name">Synata</span>
          <span className="logo-tagline">سيناتا — رفيق الشفاء</span>
        </div>
      </div>

      {/* User card */}
      <div style={{
        margin: '0 12px 8px',
        padding: '12px 14px',
        borderRadius: 'var(--radius-md)',
        background: 'rgba(45,106,79,0.08)',
        border: '1px solid var(--border-green)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: '50%',
            background: `linear-gradient(135deg, ${disability.color}22, ${disability.color}44)`,
            border: `2px solid ${disability.color}44`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, flexShrink: 0,
          }} aria-hidden="true">
            {disability.emoji}
          </div>
          <div>
            <p style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-primary)' }}>{user.name}</p>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{disability.label}</p>
          </div>
        </div>

        {/* Prayer progress */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Today's Prayers</span>
            <span style={{ fontSize: 11, color: 'var(--gold-bright)', fontWeight: 500 }}>{prayersDone}/5</span>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {prayers.map((p, i) => (
              <div
                key={p}
                title={p}
                style={{
                  flex: 1, height: 5, borderRadius: 3,
                  background: prayerLog[p] ? 'var(--gold-mid)' : 'rgba(201,168,76,0.1)',
                  transition: 'background 0.3s',
                }}
                aria-label={`${p}: ${prayerLog[p] ? 'prayed' : 'not yet prayed'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '8px 0' }}>
        <p className="nav-section">Main</p>
        {navItems.slice(0, 2).map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            onMouseEnter={() => speak(item.label)}
            aria-label={item.label}
          >
            <span className="nav-icon" aria-hidden="true">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}

        <p className="nav-section">Islamic</p>
        {navItems.slice(2, 4).map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            onMouseEnter={() => speak(item.label)}
            aria-label={item.label}
          >
            <span className="nav-icon" aria-hidden="true">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}

        <p className="nav-section">Wellbeing</p>
        {navItems.slice(4, 10).map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            onMouseEnter={() => speak(item.label)}
            aria-label={item.label}
          >
            <span className="nav-icon" aria-hidden="true">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}

        <p className="nav-section">Account</p>
        {navItems.slice(10).map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            onMouseEnter={() => speak(item.label)}
            aria-label={item.label}
          >
            <span className="nav-icon" aria-hidden="true">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Synata status */}
      <div style={{
        margin: '0 12px 12px',
        padding: '12px 14px',
        borderRadius: 'var(--radius-md)',
        background: 'linear-gradient(135deg, rgba(45,106,79,0.12), rgba(201,168,76,0.06))',
        border: '1px solid rgba(201,168,76,0.15)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <div style={{
            width: 7, height: 7, borderRadius: '50%',
            background: 'var(--green-light)',
            boxShadow: '0 0 6px var(--green-light)',
            animation: 'breathe 2s ease-in-out infinite',
          }} aria-hidden="true" />
          <span style={{ fontSize: 11, color: 'var(--green-light)', fontWeight: 500 }}>Synata is here</span>
        </div>
        <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5, fontFamily: 'var(--font-arabic)' }}>
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>
      </div>
    </aside>
  );
}