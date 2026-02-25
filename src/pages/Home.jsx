import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

const moods = [
  { id: 'calm',        emoji: '😌', label: 'Calm',        color: '#74c69d' },
  { id: 'grateful',    emoji: '🤲', label: 'Grateful',    color: '#c9a84c' },
  { id: 'anxious',     emoji: '😰', label: 'Anxious',     color: '#e8a87c' },
  { id: 'sad',         emoji: '😔', label: 'Sad',         color: '#7c9fa8' },
  { id: 'hopeful',     emoji: '🌿', label: 'Hopeful',     color: '#40916c' },
  { id: 'overwhelmed', emoji: '😵', label: 'Overwhelmed', color: '#a87c7c' },
];

const quickActions = [
  { icon: '📖', label: 'Quran & Dhikr',  to: '/quran',    color: '#c9a84c' },
  { icon: '🧎', label: 'Salah Tracker',  to: '/salah',    color: '#40916c' },
  { icon: '🌿', label: 'Exercises',      to: '/exercises', color: '#74c69d' },
  { icon: '⚡', label: 'Focus Tools',    to: '/focus',    color: '#e8c96d' },
];

const synataGreetings = {
  adhd:       'SubhanAllah for showing up today ⚡ Your beautiful mind is a gift from Allah. Let\'s take it one step at a time.',
  autism:     'Assalamu alaykum 🌊 Your space is calm and ready. Allah created you uniquely — that is a blessing, not a burden.',
  anxiety:    'You are safe here 🌙 "Verily, with hardship comes ease." Allah has not forgotten you. Take a breath.',
  depression: 'I\'m glad you opened this today 🌿 Even this small step matters. Allah sees your effort.',
  ptsd:       'Welcome, dear 🌺 No rush, no pressure. You\'re in control here. Allah is with the patient.',
  blind:      '🔊 Please enable Text-to-Speech in the toolbar above so I can guide you through everything by voice.',
  deaf:       '💬 All content here is fully visual — captions, icons, and text. You won\'t miss anything.',
  physical:   '♿ Everything here is designed for ease. Large buttons, voice control, and minimal effort navigation.',
  mute:       '🤲 You never need to speak here. Type, tap, or use pre-set responses. I understand you.',
  ocd:        'Your structured, consistent presence is mashAllah ♾️ Let\'s build a calm, predictable routine together.',
};

export default function Home() {
  const { user, currentMood, updateMood, moodHistory, prayerLog, prayers, quranVerses, disabilities, speak } = useApp();
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  const [moodLogged, setMoodLogged] = useState(false);
  const [verseIdx] = useState(Math.floor(Math.random() * quranVerses.length));

  const disability = disabilities.find(d => d.id === user.disability) || disabilities[0];
  const currentMoodObj = moods.find(m => m.id === currentMood) || moods[0];
  const verse = quranVerses[verseIdx];
  const prayersDone = Object.values(prayerLog).filter(Boolean).length;

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const greeting = () => {
    const h = time.getHours();
    if (h < 12) return 'Sabah al-Khair';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleMood = (mood) => {
    updateMood(mood.id);
    setMoodLogged(true);
    speak(`Mood logged: ${mood.label}`);
  };

  return (
    <div className="page-container" id="main-content">
      {/* Hero */}
      <div style={{
        marginBottom: 32, padding: '36px 44px',
        borderRadius: 'var(--radius-xl)',
        background: 'linear-gradient(135deg, rgba(27,67,50,0.5) 0%, rgba(13,31,19,0.8) 100%)',
        border: '1px solid rgba(201,168,76,0.18)',
        position: 'relative', overflow: 'hidden',
        backdropFilter: 'blur(20px)',
      }}>
        {/* Islamic crescent decoration */}
        <div style={{ position: 'absolute', right: -30, top: -30, fontSize: 200, color: 'rgba(201,168,76,0.04)', pointerEvents: 'none', lineHeight: 1, fontFamily: 'serif' }}>☽</div>

        <p style={{ fontFamily: 'var(--font-arabic)', fontSize: 14, color: 'var(--text-muted)', marginBottom: 8 }}>
          {time.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: 500, color: 'var(--text-primary)', marginBottom: 4, lineHeight: 1.2 }}>
          {greeting()},
        </h1>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: 500, marginBottom: 20, lineHeight: 1.2 }}
          style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: 500, marginBottom: 20, lineHeight: 1.2, background: 'linear-gradient(135deg, var(--gold-bright), var(--gold-mid))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {user.name} 🤲
        </h2>

        {/* Synata message */}
        <div style={{
          padding: '16px 20px',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(8,15,10,0.6)',
          border: '1px solid rgba(201,168,76,0.15)',
          maxWidth: 500, marginBottom: 24,
        }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 6, alignItems: 'center' }}>
            <span style={{ fontSize: 14, color: 'var(--gold-mid)' }}>☽</span>
            <span style={{ fontSize: 11, color: 'var(--gold-mid)', letterSpacing: '1px', textTransform: 'uppercase' }}>Synata</span>
          </div>
          <p
            style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', color: 'var(--text-soft)', lineHeight: 1.65, fontStyle: 'italic' }}
            onMouseEnter={() => speak(synataGreetings[user.disability] || synataGreetings.adhd)}
          >
            {synataGreetings[user.disability] || synataGreetings.adhd}
          </p>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
          {[
            { label: 'Day Streak',       value: `${user.streak} 🔥`,     color: 'var(--gold-bright)' },
            { label: 'Prayers Today',    value: `${prayersDone}/5 🧎`,   color: 'var(--green-light)' },
            { label: 'Dhikr Sessions',   value: '3 📿',                  color: 'var(--gold-mid)'    },
            { label: 'Journal Entries',  value: '22 📓',                 color: 'var(--text-soft)'   },
          ].map((s, i) => (
            <div key={i} onMouseEnter={() => speak(`${s.label}: ${s.value}`)}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 500, color: s.color }}>{s.value}</p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Verse of the Day */}
      <div className="quran-card" style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <span className="badge badge-gold">📖 Verse of the Day</span>
        </div>
        <p className="arabic-text-lg" style={{ marginBottom: 12 }} onMouseEnter={() => speak(verse.translation)}>
          {verse.arabic}
        </p>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', color: 'var(--text-soft)', fontStyle: 'italic', lineHeight: 1.7, marginBottom: 8 }}>
          "{verse.translation}"
        </p>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{verse.reference}</p>
      </div>

      {/* Mood check-in */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h2 className="section-title">🌙 How are you feeling right now?</h2>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: 18 }}>
          Synata adjusts your experience based on your mood. Allah knows what's in your heart — share it here freely.
        </p>

        {!moodLogged ? (
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {moods.map(mood => (
              <button
                key={mood.id}
                onClick={() => handleMood(mood)}
                className="btn"
                style={{
                  padding: '10px 18px',
                  background: `${mood.color}12`,
                  border: `2px solid ${mood.color}33`,
                  color: mood.color,
                  gap: 8,
                }}
                aria-label={`Set mood to ${mood.label}`}
              >
                <span style={{ fontSize: 20 }}>{mood.emoji}</span>
                {mood.label}
              </button>
            ))}
          </div>
        ) : (
          <div style={{
            padding: '14px 20px', borderRadius: 'var(--radius-md)',
            background: `${currentMoodObj.color}10`,
            border: `1px solid ${currentMoodObj.color}30`,
            display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <span style={{ fontSize: 28 }}>{currentMoodObj.emoji}</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', fontWeight: 500 }}>
                Feeling <span style={{ color: currentMoodObj.color }}>{currentMoodObj.label}</span> — logged ✓
              </p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 2 }}>
                Synata has noted this. May Allah ease whatever you're carrying. 🤲
              </p>
            </div>
            <button onClick={() => setMoodLogged(false)} className="btn btn-ghost" style={{ fontSize: 12, padding: '6px 12px', minHeight: 36 }}>Change</button>
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        {quickActions.map((a, i) => (
          <div
            key={i}
            onClick={() => { navigate(a.to); speak(a.label); }}
            className="card card-clickable"
            style={{ textAlign: 'center', padding: '28px 16px' }}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && navigate(a.to)}
            aria-label={`Go to ${a.label}`}
            onMouseEnter={() => speak(a.label)}
          >
            <div style={{
              width: 58, height: 58, borderRadius: '50%', margin: '0 auto 14px',
              background: `${a.color}12`, border: `1px solid ${a.color}33`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 26,
            }} aria-hidden="true">{a.icon}</div>
            <p style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-primary)' }}>{a.label}</p>
          </div>
        ))}
      </div>

      {/* Chart + Today's plan */}
      <div className="grid-2">
        <div className="card">
          <h3 className="section-title">📈 Mood & Prayer — 7 Days</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={moodHistory}>
              <XAxis dataKey="day" stroke="#2d6a4f" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
              <YAxis domain={[0,100]} stroke="#2d6a4f" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#0d1f13', border: '1px solid rgba(201,168,76,0.25)', borderRadius: 10, fontSize: 12 }} />
              <defs>
                <linearGradient id="moodGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#40916c" />
                  <stop offset="100%" stopColor="#c9a84c" />
                </linearGradient>
              </defs>
              <Line type="monotone" dataKey="score" stroke="url(#moodGrad)" strokeWidth={2.5} dot={{ fill: '#40916c', r: 4 }} name="Mood" />
              <Line type="monotone" dataKey="prayer" stroke="#c9a84c" strokeWidth={1.5} strokeDasharray="4 2" dot={false} name="Prayers" />
            </LineChart>
          </ResponsiveContainer>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 8, textAlign: 'center', fontStyle: 'italic' }}>
            Solid line: mood · Dashed: prayers done that day
          </p>
        </div>

        <div className="card">
          <h3 className="section-title">🌿 Today's Gentle Plan</h3>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 14, fontStyle: 'italic' }}>
            Crafted by Synata for your {disability.label} journey
          </p>
          {[
            { done: prayersDone >= 1, task: 'Fajr prayer', type: 'salah' },
            { done: moodLogged,       task: 'Morning mood check-in', type: 'wellness' },
            { done: false,            task: 'Read 1 page of Quran', type: 'quran' },
            { done: false,            task: 'Dhikr — 33x SubhanAllah', type: 'dhikr' },
            { done: false,            task: 'Focus session (25 min)', type: 'focus' },
            { done: false,            task: 'Journal reflection', type: 'journal' },
          ].map((t, i) => (
            <div
              key={i}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '9px 0',
                borderBottom: i < 5 ? '1px solid rgba(201,168,76,0.06)' : 'none',
              }}
              onMouseEnter={() => speak(`${t.task}: ${t.done ? 'done' : 'pending'}`)}
            >
              <div style={{
                width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                background: t.done ? 'rgba(64,145,108,0.2)' : 'transparent',
                border: `2px solid ${t.done ? 'var(--green-light)' : 'rgba(201,168,76,0.2)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, color: 'var(--green-light)',
              }} aria-hidden="true">
                {t.done ? '✓' : ''}
              </div>
              <span style={{ flex: 1, fontSize: 'var(--text-sm)', color: t.done ? 'var(--text-muted)' : 'var(--text-soft)', textDecoration: t.done ? 'line-through' : 'none' }}>
                {t.task}
              </span>
              <span className="badge badge-soft" style={{ fontSize: 10 }}>{t.type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}