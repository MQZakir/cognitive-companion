import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, Radar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// ═══════════════════════════════════════════
// MOOD TRACKER
// ═══════════════════════════════════════════
const moodOptions = [
  { id: 'calm',        emoji: '😌', label: 'Calm',        color: '#74c69d' },
  { id: 'grateful',    emoji: '🤲', label: 'Grateful',    color: '#c9a84c' },
  { id: 'anxious',     emoji: '😰', label: 'Anxious',     color: '#e8a87c' },
  { id: 'sad',         emoji: '😔', label: 'Sad',         color: '#7c9fa8' },
  { id: 'hopeful',     emoji: '🌿', label: 'Hopeful',     color: '#40916c' },
  { id: 'overwhelmed', emoji: '😵', label: 'Overwhelmed', color: '#a87c7c' },
];

const moodLogs = [
  { time: '06:10 AM', mood: 'calm',     note: 'After Fajr — felt at peace',    trigger: 'Prayer' },
  { time: '09:30 AM', mood: 'hopeful',  note: 'Good start to work',            trigger: 'Productivity' },
  { time: '12:45 PM', mood: 'anxious',  note: 'Deadline pressure',             trigger: 'Work' },
  { time: '02:00 PM', mood: 'calm',     note: 'Dhikr session helped a lot',    trigger: 'Dhikr' },
  { time: '06:30 PM', mood: 'grateful', note: 'Maghrib prayer — felt grateful', trigger: 'Prayer' },
];

export function MoodTracker() {
  const { currentMood, updateMood, moodHistory, speak } = useApp();
  const [tab, setTab] = useState('today');
  const [note, setNote] = useState('');
  const [logged, setLogged] = useState(false);

  return (
    <div className="page-container">
      <div style={{ marginBottom: 28 }}>
        <h1 className="page-title">🌙 Mood Tracker</h1>
        <p className="page-subtitle">Understanding your heart — one moment at a time</p>
      </div>

      {/* Log mood */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h3 className="section-title">How are you feeling right now?</h3>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
          {moodOptions.map(m => (
            <button
              key={m.id}
              onClick={() => { updateMood(m.id); speak(`${m.label} selected`); }}
              className="btn"
              style={{
                background: currentMood === m.id ? `${m.color}20` : 'rgba(13,31,19,0.6)',
                border: `2px solid ${currentMood === m.id ? `${m.color}66` : 'rgba(201,168,76,0.1)'}`,
                color: currentMood === m.id ? m.color : 'var(--text-muted)',
                gap: 8, padding: '10px 16px',
              }}
              aria-pressed={currentMood === m.id}
              aria-label={m.label}
            >
              <span style={{ fontSize: 20 }}>{m.emoji}</span> {m.label}
            </button>
          ))}
        </div>
        {!logged ? (
          <div style={{ display: 'flex', gap: 10 }}>
            <input className="input" value={note} onChange={e => setNote(e.target.value)} placeholder="Add a note about how you feel... (optional)" aria-label="Mood note" />
            <button className="btn btn-primary" onClick={() => setLogged(true)} aria-label="Log mood">Log Mood</button>
          </div>
        ) : (
          <div style={{ padding: '12px 18px', borderRadius: 'var(--radius-md)', background: 'rgba(64,145,108,0.1)', border: '1px solid rgba(64,145,108,0.3)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: 'var(--green-light)' }}>✓</span>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--green-light)' }}>Mood logged. Synata has noted this. 🌙</p>
            <button onClick={() => setLogged(false)} className="btn btn-ghost" style={{ marginLeft: 'auto', fontSize: 12, minHeight: 32, padding: '4px 10px' }}>Edit</button>
          </div>
        )}
      </div>

      <div className="tab-bar">
        {['today', 'week', 'patterns'].map(t => (
          <button key={t} className={`tab-btn${tab === t ? ' active' : ''}`} onClick={() => setTab(t)} style={{ textTransform: 'capitalize' }}>{t === 'today' ? "Today's Log" : t === 'week' ? 'This Week' : 'Patterns'}</button>
        ))}
      </div>

      {tab === 'today' && (
        <div className="grid-2">
          <div className="card">
            <h3 className="section-title">🕐 Today's Mood Timeline</h3>
            {moodLogs.map((log, i) => {
              const m = moodOptions.find(x => x.id === log.mood) || moodOptions[0];
              return (
                <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: i < moodLogs.length-1 ? '1px solid rgba(201,168,76,0.06)' : 'none' }} onMouseEnter={() => speak(`${log.time}: ${log.mood}. ${log.note}`)}>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', width: 70, flexShrink: 0 }}>{log.time}</p>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: m.color, marginTop: 4, flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: 'var(--text-sm)', color: m.color, textTransform: 'capitalize', fontWeight: 500 }}>{log.mood}</p>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{log.note}</p>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Trigger: {log.trigger}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="card">
            <h3 className="section-title">📈 7-Day Mood</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={moodHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,0.06)" />
                <XAxis dataKey="day" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} stroke="#2d6a4f" />
                <YAxis domain={[0,100]} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} stroke="#2d6a4f" />
                <Tooltip contentStyle={{ background: '#0d1f13', border: '1px solid rgba(201,168,76,0.25)', borderRadius: 10, fontSize: 12 }} />
                <defs><linearGradient id="areaG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#40916c" stopOpacity={0.3}/><stop offset="100%" stopColor="#40916c" stopOpacity={0}/></linearGradient></defs>
                <Area type="monotone" dataKey="score" stroke="var(--green-bright)" strokeWidth={2.5} fill="url(#areaG)" dot={{ fill: 'var(--green-bright)', r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
            <div style={{ marginTop: 16, padding: '12px 16px', borderRadius: 'var(--radius-md)', background: 'rgba(45,106,79,0.08)', border: '1px solid rgba(201,168,76,0.1)' }}>
              <p style={{ fontSize: 11, color: 'var(--gold-mid)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '1px' }}>☽ Synata's Insight</p>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)', lineHeight: 1.6, fontStyle: 'italic' }}>Your mood is highest on days with 4-5 prayers. SubhanAllah — the data confirms what Allah promised. 🌙</p>
            </div>
          </div>
        </div>
      )}

      {tab === 'week' && (
        <div className="card">
          <h3 className="section-title">📊 Weekly Mood Overview</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={moodHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,0.06)" />
              <XAxis dataKey="day" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} stroke="#2d6a4f" />
              <YAxis domain={[0,100]} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} stroke="#2d6a4f" />
              <Tooltip contentStyle={{ background: '#0d1f13', border: '1px solid rgba(201,168,76,0.25)', borderRadius: 10, fontSize: 12 }} />
              <Bar dataKey="score" name="Mood Score" fill="var(--green-mid)" radius={[6,6,0,0]} maxBarSize={48} />
              <Bar dataKey="prayer" name="Prayers" fill="var(--gold-mid)" radius={[6,6,0,0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {tab === 'patterns' && (
        <div className="grid-2">
          {[
            { title: '🧎 Prayer & Mood Correlation', text: 'Your mood score averages 82 on days with 5 prayers, and 51 on days with 2 or fewer. The Quran was right — in Allah\'s remembrance, hearts do find rest.' },
            { title: '⏰ Best Time of Day', text: 'Your calmest moments are after Fajr (6-7 AM) and after Maghrib (6:30-7 PM). Anxiety peaks midday — likely before Dhuhr.' },
            { title: '🌿 Dhikr Effect', text: 'On days you completed a dhikr session, your average mood was 18% higher. SubhanAllah.' },
            { title: '📓 Journal Correlation', text: 'Writing in your journal on difficult days reduces recorded distress by 31% over the following 2 hours.' },
          ].map((card, i) => (
            <div key={i} className="card" onMouseEnter={() => speak(`${card.title}. ${card.text}`)}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', marginBottom: 10, color: 'var(--text-primary)' }}>{card.title}</h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)', lineHeight: 1.7 }}>{card.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// INSIGHTS
// ═══════════════════════════════════════════
const disabilityInsights = {
  adhd: {
    metrics: [
      { label: 'Focus Score',        value: '72%',   icon: '🎯', color: '#e8c96d' },
      { label: 'Task Completion',    value: '14/20', icon: '✅', color: '#74c69d' },
      { label: 'Hyperfocus Episodes',value: '4',     icon: '⚡', color: '#c9a84c' },
      { label: 'Recovery Time',      value: '3.2 min',icon:'🔄', color: '#40916c' },
    ],
    radar: [
      { s: 'Task Init', v: 55 }, { s: 'Sustained Focus', v: 62 },
      { s: 'Impulse Control', v: 48 }, { s: 'Working Memory', v: 70 },
      { s: 'Time Sense', v: 45 }, { s: 'Emotional Reg', v: 68 },
    ],
    insights: ['Best focus window is 9-11 AM — protect this for deep work', 'Body doubling sessions improved completion by 40%', 'Post-Fajr routine sets the tone for your whole day', 'Pomodoro technique: your average recovery is improving'],
  },
  autism: {
    metrics: [
      { label: 'Sensory Load',       value: '42%',   icon: '🌊', color: '#74c69d' },
      { label: 'Routine Adherence',  value: '87%',   icon: '♾️', color: '#c9a84c' },
      { label: 'Social Energy',      value: '65%',   icon: '💫', color: '#40916c' },
      { label: 'Stim Episodes',      value: '8',     icon: '🌿', color: '#e8c96d' },
    ],
    radar: [
      { s: 'Sensory Threshold', v: 58 }, { s: 'Social Comfort', v: 52 },
      { s: 'Routine Stability', v: 87 }, { s: 'Special Interest', v: 95 },
      { s: 'Communication', v: 60 }, { s: 'Flexibility', v: 42 },
    ],
    insights: ['Routine consistency is your superpower — 87% adherence', 'Sensory load peaks 12-2 PM — schedule quiet time here', 'Islamic structure (salah times) naturally supports your routines', 'Your special interests are a healthy anchor — lean into them'],
  },
  anxiety: {
    metrics: [
      { label: 'Anxiety Level',      value: '38%',   icon: '🌙', color: '#c9a84c' },
      { label: 'Coping Success',     value: '78%',   icon: '💪', color: '#74c69d' },
      { label: 'Panic Episodes',     value: '2',     icon: '⚠️', color: '#e8a87c' },
      { label: 'Recovery Time',      value: '18 min',icon: '⏱️', color: '#40916c' },
    ],
    radar: [
      { s: 'Social Anxiety', v: 45 }, { s: 'Health Anxiety', v: 30 },
      { s: 'Performance', v: 55 }, { s: 'Generalized', v: 38 },
      { s: 'Grounding', v: 72 }, { s: 'Breathing', v: 80 },
    ],
    insights: ['Anxiety episodes down 42% since starting Synata', 'Morning routine (Fajr + dhikr) significantly lowers baseline anxiety', 'Breathing exercises: 78% success rate for you', 'Reciting Ayat al-Kursi reduces self-reported anxiety 65% of the time'],
  },
  depression: {
    metrics: [
      { label: 'Energy Level',       value: '54%',   icon: '🌿', color: '#74c69d' },
      { label: 'Activity Score',     value: '6/10',  icon: '🏃', color: '#40916c' },
      { label: 'Positive Moments',   value: '12',    icon: '✨', color: '#c9a84c' },
      { label: 'Sleep Quality',      value: '7.2h',  icon: '🌙', color: '#e8c96d' },
    ],
    radar: [
      { s: 'Energy', v: 54 }, { s: 'Motivation', v: 45 },
      { s: 'Social Connect', v: 40 }, { s: 'Self-Care', v: 62 },
      { s: 'Sleep', v: 70 }, { s: 'Hope', v: 58 },
    ],
    insights: ['You\'ve had 3 consecutive manageable days — that is real progress', 'Morning light + Fajr prayer correlates with better energy', 'Small acts of ibadah (even one ayah) lifts your mood by 25%', 'Your language is becoming 34% more self-compassionate'],
  },
};

const defaultInsights = disabilityInsights.adhd;

export function Insights() {
  const { user, moodHistory } = useApp();
  const stats = disabilityInsights[user.disability] || defaultInsights;
  const pieData = [
    { name: 'Good', value: 40, color: '#40916c' },
    { name: 'Manageable', value: 35, color: '#c9a84c' },
    { name: 'Difficult', value: 20, color: '#7c9fa8' },
    { name: 'Crisis', value: 5,  color: '#a87c7c' },
  ];

  return (
    <div className="page-container">
      <div style={{ marginBottom: 28 }}>
        <h1 className="page-title">📊 Insights & Analytics</h1>
        <p className="page-subtitle">Synata-powered insights tailored to your journey</p>
      </div>

      <div className="grid-4" style={{ marginBottom: 28 }}>
        {stats.metrics.map((m, i) => (
          <div key={i} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>{m.icon}</div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', color: m.color, marginBottom: 4 }}>{m.value}</p>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{m.label}</p>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <h3 className="section-title">📈 Daily Mood Trend</h3>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={moodHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,0.06)" />
            <XAxis dataKey="day" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} stroke="#2d6a4f" />
            <YAxis domain={[0,100]} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} stroke="#2d6a4f" />
            <Tooltip contentStyle={{ background: '#0d1f13', border: '1px solid rgba(201,168,76,0.25)', borderRadius: 10, fontSize: 12 }} />
            <defs><linearGradient id="aG2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#40916c" stopOpacity={0.35}/><stop offset="100%" stopColor="#40916c" stopOpacity={0}/></linearGradient></defs>
            <Area type="monotone" dataKey="score" stroke="var(--green-bright)" fill="url(#aG2)" strokeWidth={2.5} dot={{ fill: 'var(--green-bright)', r: 4 }} name="Mood" />
            <Area type="monotone" dataKey="prayer" stroke="var(--gold-mid)" fill="none" strokeWidth={1.5} strokeDasharray="4 2" dot={false} name="Prayers" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="card">
          <h3 className="section-title">🧠 Cognitive Profile</h3>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={stats.radar.map(d => ({ subject: d.s, value: d.v }))}>
              <PolarGrid stroke="rgba(201,168,76,0.12)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
              <Radar dataKey="value" stroke="var(--green-bright)" fill="var(--green-bright)" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <h3 className="section-title">🌈 Day Quality Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" paddingAngle={3}>
                {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#0d1f13', border: '1px solid rgba(201,168,76,0.25)', borderRadius: 10, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
            {pieData.map((d,i) => <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5 }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: d.color }}/><span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{d.name} {d.value}%</span></div>)}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="section-title">✦ Synata's Personal Insights</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
          {stats.insights.map((insight, i) => (
            <div key={i} style={{ padding: '14px 16px', borderRadius: 'var(--radius-md)', background: 'rgba(8,15,10,0.6)', border: '1px solid rgba(201,168,76,0.08)', display: 'flex', gap: 10 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gold-mid)', marginTop: 6, flexShrink: 0 }} />
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)', lineHeight: 1.65 }}>{insight}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// JOURNAL
// ═══════════════════════════════════════════
const islamicPrompts = [
  "What am I grateful to Allah for today? (Shukr)",
  "Where did I show patience (Sabr) today, even in a small way?",
  "What is one thing I'm trusting Allah with right now? (Tawakkul)",
  "How did today's prayers make me feel?",
  "What challenge am I facing that I want to make dua about?",
  "Describe a moment today where you felt Allah's mercy.",
  "What would you say to yourself with the compassion Allah shows you?",
  "Write about something you're struggling to accept — and then write 'wa alaykum assalam' to it.",
];

export function Journal() {
  const { speak } = useApp();
  const [tab, setTab] = useState('write');
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [mood, setMood] = useState('🤲');
  const [saved, setSaved] = useState(false);
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  const entries = [
    { id: 1, title: 'After Fajr', date: 'Feb 22', mood: '😌', preview: 'The silence after Fajr is unlike any other...', tags: ['peace', 'prayer'] },
    { id: 2, title: 'Struggling today', date: 'Feb 21', mood: '😔', preview: 'Made dua and felt a little lighter...', tags: ['sabr', 'dua'] },
    { id: 3, title: 'A grateful heart', date: 'Feb 20', mood: '🤲', preview: 'Alhamdulillah for the small things...', tags: ['shukr', 'gratitude'] },
  ];

  return (
    <div className="page-container">
      <div style={{ marginBottom: 28 }}>
        <h1 className="page-title">📓 Islamic Journal</h1>
        <p className="page-subtitle">A private space for sabr, shukr, tawakkul — and everything in between</p>
      </div>

      <div className="tab-bar">
        {['write', 'entries', 'insights'].map(t => (
          <button key={t} className={`tab-btn${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
            {t === 'write' ? '✏️ Write' : t === 'entries' ? '📚 Entries' : '✦ Reflections'}
          </button>
        ))}
      </div>

      {tab === 'write' && (
        <div className="grid-2" style={{ alignItems: 'start' }}>
          <div>
            <div style={{ marginBottom: 14, padding: '12px 16px', borderRadius: 'var(--radius-md)', background: 'rgba(45,106,79,0.08)', border: '1px solid rgba(201,168,76,0.12)' }}>
              <p style={{ fontSize: 12, color: 'var(--gold-mid)', marginBottom: 4 }}>☽ Synata suggests:</p>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)', fontStyle: 'italic' }}>"{islamicPrompts[Math.floor(Math.random() * islamicPrompts.length)]}"</p>
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
              {['😌','🤲','😰','😔','🌿','✨'].map(e => (
                <button key={e} onClick={() => setMood(e)} className="btn btn-ghost" style={{ width: 42, minWidth: 42, padding: 0, fontSize: 20, background: mood === e ? 'rgba(201,168,76,0.1)' : 'transparent', borderColor: mood === e ? 'rgba(201,168,76,0.4)' : undefined }} aria-pressed={mood === e}>{e}</button>
              ))}
            </div>
            <input className="input" value={title} onChange={e => setTitle(e.target.value)} placeholder="Entry title..." style={{ marginBottom: 10, fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)' }} aria-label="Journal entry title" />
            {selectedPrompt && <div style={{ marginBottom: 8, padding: '8px 12px', borderRadius: 8, background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.12)' }}><p style={{ fontSize: 12, color: 'var(--gold-mid)', fontStyle: 'italic' }}>{selectedPrompt}</p></div>}
            <textarea className="textarea" value={content} onChange={e => setContent(e.target.value)} placeholder="Begin writing... this is your space. بِسْمِ اللَّهِ..." style={{ height: 280, fontFamily: 'var(--font-display)', lineHeight: 1.8 }} aria-label="Journal entry content" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{wordCount} words</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-ghost" onClick={() => { setContent(''); setTitle(''); }} style={{ fontSize: 13 }}>Clear</button>
                <button className="btn btn-primary" onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2500); }} style={{ fontSize: 13 }}>{saved ? '✓ Saved!' : 'Save Entry'}</button>
              </div>
            </div>
          </div>
          <div>
            <div className="card" style={{ marginBottom: 14 }}>
              <h3 className="section-title" style={{ fontSize: 'var(--text-base)' }}>🌿 Islamic Prompts</h3>
              {islamicPrompts.map((p, i) => (
                <button key={i} onClick={() => { setSelectedPrompt(p); speak(p); }} style={{ display: 'block', width: '100%', padding: '9px 12px', marginBottom: 6, borderRadius: 'var(--radius-sm)', background: selectedPrompt === p ? 'rgba(201,168,76,0.08)' : 'transparent', border: `1px solid ${selectedPrompt === p ? 'rgba(201,168,76,0.3)' : 'rgba(201,168,76,0.06)'}`, color: selectedPrompt === p ? 'var(--gold-mid)' : 'var(--text-muted)', cursor: 'pointer', textAlign: 'left', fontSize: 12, lineHeight: 1.5, fontFamily: 'var(--font-display)', fontStyle: 'italic', transition: 'all 0.2s', minHeight: 40 }}>{p}</button>
              ))}
            </div>
            <div className="card">
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Writing Streak</p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', color: 'var(--gold-bright)' }}>7 🔥</p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 4 }}>Days in a row — MashaAllah!</p>
            </div>
          </div>
        </div>
      )}

      {tab === 'entries' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {entries.map(e => (
            <div key={e.id} className="card card-clickable" style={{ display: 'flex', gap: 16 }} onMouseEnter={() => speak(`${e.date}: ${e.title}. ${e.preview}`)}>
              <div style={{ fontSize: 32, flexShrink: 0 }}>{e.mood}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', color: 'var(--text-primary)' }}>{e.title}</h3>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{e.date}</p>
                </div>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: 8 }}>{e.preview}</p>
                <div style={{ display: 'flex', gap: 6 }}>{e.tags.map(t => <span key={t} className="badge badge-gold">{t}</span>)}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'insights' && (
        <div className="grid-2">
          {[
            { title: '🌿 Dominant Themes', text: 'Gratitude (shukr): 45% · Patience (sabr): 38% · Prayer reflections: 30% · Dua requests: 25%' },
            { title: '😌 Mood After Writing', text: 'Your mood improves by an average of 22% after journaling. Entries written during anxious moments show the greatest shift.' },
            { title: '⏰ Best Writing Times', text: 'You write most consistently after Maghrib (7-8 PM). Post-Fajr entries are shorter but more spiritually focused.' },
            { title: '✦ Synata\'s Reading', text: 'The word "alhamdulillah" appears in 78% of your entries. Your self-compassion language has increased 34% this month.' },
          ].map((c, i) => (
            <div key={i} className="card" onMouseEnter={() => speak(`${c.title}. ${c.text}`)}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', marginBottom: 10, color: 'var(--text-primary)' }}>{c.title}</h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)', lineHeight: 1.7 }}>{c.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// COMMUNITY
// ═══════════════════════════════════════════
const posts = [
  { id: 1, name: 'Noor', badge: 'Autism Spectrum', time: '2h ago', likes: 34, text: 'Had my first calm grocery trip without noise-cancelling headphones in 6 months. Made dua before going in. It helped so much. 🌊', tags: ['autism', 'milestone', 'dua'] },
  { id: 2, name: 'Bilal', badge: 'ADHD', time: '4h ago', likes: 67, text: 'The body doubling feature genuinely saved me this week. Finished 4 tasks I\'ve been postponing for months. Alhamdulillah! ⚡', tags: ['adhd', 'win', 'alhamdulillah'] },
  { id: 3, name: 'Mariam', badge: 'Anxiety', time: '6h ago', likes: 89, text: 'Had a panic attack at 2am. Instead of spiraling, I recited Ayat al-Kursi, opened Synata, and did 4-7-8 breathing. Back asleep in 20 min. Alhamdulillah 🌙', tags: ['anxiety', 'quran', 'progress'] },
  { id: 4, name: 'Yusuf', badge: 'Depression', time: '12h ago', likes: 112, text: 'Day 14 of using the journal. Synata showed me I\'ve been saying \'alhamdulillah\' more than \'I can\'t\'. Small shift, big meaning. 💚', tags: ['depression', 'journal', 'shukr'] },
];

export function Community() {
  const { speak } = useApp();
  const [liked, setLiked] = useState({});
  const [tab, setTab] = useState('feed');

  const rooms = [
    { name: 'ADHD Muslim Support', emoji: '⚡', members: 234, color: '#e8c96d' },
    { name: 'Autism & Islam', emoji: '🌊', members: 189, color: '#74c69d' },
    { name: 'Anxiety & Tawakkul', emoji: '🌙', members: 302, color: '#c9a84c' },
    { name: 'Depression Recovery', emoji: '🌿', members: 278, color: '#40916c' },
    { name: 'Physical Disability', emoji: '♿', members: 143, color: '#c9a84c' },
    { name: 'Deaf Muslim Space', emoji: '👂', members: 98, color: '#74c69d' },
  ];

  return (
    <div className="page-container">
      <div style={{ marginBottom: 28 }}>
        <h1 className="page-title">💫 Community</h1>
        <p className="page-subtitle">You are not alone — we are all walking back to Allah together</p>
      </div>

      <div style={{ marginBottom: 20, padding: '12px 18px', borderRadius: 'var(--radius-md)', background: 'rgba(64,145,108,0.08)', border: '1px solid rgba(64,145,108,0.2)', display: 'flex', gap: 12, alignItems: 'center' }}>
        <span>🛡️</span>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', flex: 1 }}>
          <span style={{ color: 'var(--green-light)' }}>Safe, Islamic-moderated space.</span> Synata monitors all content 24/7. Crisis support is always available. No hate, no judgment — only mercy (rahma).
        </p>
        <button className="btn btn-danger" style={{ fontSize: 12, padding: '6px 14px', minHeight: 36 }}>🆘 Crisis Help</button>
      </div>

      <div className="tab-bar">
        {[{ id: 'feed', l: '📰 Feed' }, { id: 'rooms', l: '💬 Rooms' }, { id: 'events', l: '📅 Events' }].map(t => (
          <button key={t.id} className={`tab-btn${tab === t.id ? ' active' : ''}`} onClick={() => setTab(t.id)}>{t.l}</button>
        ))}
      </div>

      {tab === 'feed' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {posts.map(post => (
            <div key={post.id} className="card" onMouseEnter={() => speak(`${post.name}: ${post.text}`)}>
              <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(45,106,79,0.2)', border: '1px solid rgba(201,168,76,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                  {post.name[0]}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <p style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-primary)' }}>{post.name}</p>
                    <span className="badge badge-green" style={{ fontSize: 10 }}>{post.badge}</span>
                  </div>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{post.time}</p>
                </div>
              </div>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)', lineHeight: 1.7, marginBottom: 12 }}>{post.text}</p>
              <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
                {post.tags.map(t => <span key={t} className="badge badge-gold" style={{ fontSize: 10 }}>#{t}</span>)}
              </div>
              <div style={{ display: 'flex', gap: 14 }}>
                <button onClick={() => setLiked(l => ({ ...l, [post.id]: !l[post.id] }))} style={{ background: 'none', border: 'none', color: liked[post.id] ? 'var(--gold-bright)' : 'var(--text-muted)', cursor: 'pointer', fontSize: 'var(--text-sm)', display: 'flex', alignItems: 'center', gap: 5, minHeight: 36, padding: '0 8px' }} aria-pressed={liked[post.id]} aria-label={`Like post by ${post.name}`}>
                  {liked[post.id] ? '💛' : '🤍'} {post.likes + (liked[post.id] ? 1 : 0)}
                </button>
                <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 'var(--text-sm)', minHeight: 36, padding: '0 8px' }}>💬 Reply</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'rooms' && (
        <div className="grid-3">
          {rooms.map((r, i) => (
            <div key={i} className="card card-clickable" style={{ textAlign: 'center', padding: '28px 16px' }} onMouseEnter={() => speak(`${r.name}. ${r.members} members.`)}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', margin: '0 auto 14px', background: `${r.color}12`, border: `1px solid ${r.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>{r.emoji}</div>
              <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-primary)', marginBottom: 4 }}>{r.name}</h3>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 14 }}>{r.members} members</p>
              <button className="btn btn-outline" style={{ width: '100%', fontSize: 13 }}>Join Room</button>
            </div>
          ))}
        </div>
      )}

      {tab === 'events' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { title: 'Group Dhikr Session', date: 'Tomorrow · 7:00 PM', type: 'Spiritual', icon: '📿', color: '#c9a84c' },
            { title: 'ADHD Focus Sprint (Body Doubling)', date: 'Feb 25 · 10:00 AM', type: 'Productivity', icon: '⚡', color: '#e8c96d' },
            { title: 'Anxiety & Tawakkul Workshop', date: 'Feb 26 · 6:00 PM', type: 'Workshop', icon: '🌙', color: '#74c69d' },
            { title: 'Deaf Muslim Community Meetup', date: 'Feb 28 · 4:00 PM', type: 'Community', icon: '👂', color: '#40916c' },
          ].map((ev, i) => (
            <div key={i} className="card" style={{ display: 'flex', gap: 16, alignItems: 'center' }} onMouseEnter={() => speak(`${ev.title}. ${ev.date}`)}>
              <div style={{ width: 52, height: 52, borderRadius: 'var(--radius-md)', background: `${ev.color}12`, border: `1px solid ${ev.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{ev.icon}</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 500, color: 'var(--text-primary)', marginBottom: 3 }}>{ev.title}</h3>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{ev.date}</p>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span className="badge badge-gold" style={{ fontSize: 10 }}>{ev.type}</span>
                <button className="btn btn-primary" style={{ fontSize: 13, padding: '8px 16px' }}>RSVP</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// PROFILE
// ═══════════════════════════════════════════
const achievements = [
  { icon: '🔥', title: '7-Day Streak', unlocked: true },
  { icon: '🧎', title: 'Full Prayer Day', unlocked: true },
  { icon: '📖', title: 'Quran Reader', unlocked: true },
  { icon: '📿', title: 'Dhikr Master', unlocked: false },
  { icon: '💫', title: '30-Day Journey', unlocked: false },
  { icon: '🌟', title: 'Community Star', unlocked: false },
];

export function Profile() {
  const { user, setUser, disabilities, prayerLog, speak } = useApp();
  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState(user.name);
  const disability = disabilities.find(d => d.id === user.disability) || disabilities[0];
  const prayersDone = Object.values(prayerLog).filter(Boolean).length;

  return (
    <div className="page-container">
      <div style={{ marginBottom: 28 }}>
        <h1 className="page-title">👤 Your Profile</h1>
        <p className="page-subtitle">Your journey back to Allah — beautifully tracked</p>
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        <div>
          <div className="card" style={{ textAlign: 'center', padding: '36px 28px', marginBottom: 20 }}>
            <div style={{ width: 90, height: 90, borderRadius: '50%', background: `linear-gradient(135deg, ${disability.color}22, ${disability.color}44)`, border: `3px solid ${disability.color}44`, margin: '0 auto 18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, animation: 'breathe 4s ease-in-out infinite' }}>{disability.emoji}</div>

            {editing ? (
              <div style={{ marginBottom: 14 }}>
                <input className="input" value={nameInput} onChange={e => setNameInput(e.target.value)} style={{ textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', marginBottom: 10 }} aria-label="Edit your name" />
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                  <button className="btn btn-primary" onClick={() => { setUser(u => ({ ...u, name: nameInput })); setEditing(false); }}>Save</button>
                  <button className="btn btn-ghost" onClick={() => setEditing(false)}>Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', marginBottom: 4, color: 'var(--text-primary)' }}>{user.name}</h2>
                <button onClick={() => setEditing(true)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 12, marginBottom: 12 }}>✏️ Edit name</button>
              </>
            )}

            <span className="badge badge-gold" style={{ marginBottom: 18, display: 'inline-flex' }}>{disability.emoji} {disability.label}</span>

            <div style={{ display: 'flex', justifyContent: 'space-around', borderTop: '1px solid rgba(201,168,76,0.1)', paddingTop: 18 }}>
              {[
                { l: 'Streak', v: `${user.streak}🔥` },
                { l: 'Prayers', v: `${prayersDone}/5` },
                { l: 'Entries', v: '22' },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: 'center' }} onMouseEnter={() => speak(`${s.l}: ${s.v}`)}>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', color: 'var(--gold-bright)' }}>{s.v}</p>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="section-title" style={{ fontSize: 'var(--text-base)' }}>Update Profile</h3>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 12 }}>Synata adapts completely to your profile</p>
            {disabilities.map(d => (
              <button key={d.id} onClick={() => { setUser(u => ({ ...u, disability: d.id })); speak(`Profile updated to ${d.label}`); }} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 14px', marginBottom: 6, borderRadius: 'var(--radius-md)', background: user.disability === d.id ? `${d.color}10` : 'transparent', border: `1px solid ${user.disability === d.id ? `${d.color}40` : 'rgba(201,168,76,0.08)'}`, color: user.disability === d.id ? d.color : 'var(--text-muted)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', minHeight: 46, transition: 'all 0.2s' }}>
                <span style={{ fontSize: 18 }}>{d.emoji}</span>
                {d.label}
                {user.disability === d.id && <span style={{ marginLeft: 'auto', fontSize: 11 }}>✓</span>}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="card" style={{ marginBottom: 20 }}>
            <h3 className="section-title">📈 Growth</h3>
            {[
              { l: 'Mood Stability', v: 78, c: '#40916c' },
              { l: 'Prayer Consistency', v: 82, c: '#c9a84c' },
              { l: 'Journaling', v: 85, c: '#74c69d' },
              { l: 'Dhikr Sessions', v: 60, c: '#e8c96d' },
              { l: 'Community', v: 40, c: '#40916c' },
            ].map((item, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>{item.l}</span>
                  <span style={{ fontSize: 'var(--text-sm)', color: item.c, fontWeight: 500 }}>{item.v}%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${item.v}%`, background: `linear-gradient(90deg, ${item.c}80, ${item.c})` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="card">
            <h3 className="section-title">🏆 Achievements</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
              {achievements.map((a, i) => (
                <div key={i} style={{ padding: '14px 8px', borderRadius: 'var(--radius-md)', textAlign: 'center', background: a.unlocked ? 'rgba(201,168,76,0.06)' : 'rgba(8,15,10,0.6)', border: `1px solid ${a.unlocked ? 'rgba(201,168,76,0.2)' : 'rgba(201,168,76,0.04)'}`, opacity: a.unlocked ? 1 : 0.35, filter: a.unlocked ? 'none' : 'grayscale(1)' }} aria-label={`${a.title}: ${a.unlocked ? 'unlocked' : 'locked'}`}>
                  <div style={{ fontSize: 26, marginBottom: 6 }}>{a.icon}</div>
                  <p style={{ fontSize: 10, color: 'var(--text-muted)', lineHeight: 1.3 }}>{a.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// SETTINGS
// ═══════════════════════════════════════════
function Toggle({ value, onChange, label }) {
  return (
    <button
      className="toggle"
      onClick={() => onChange(!value)}
      style={{ background: value ? 'var(--green-mid)' : 'rgba(255,255,255,0.08)' }}
      aria-pressed={value}
      aria-label={label}
      role="switch"
    >
      <div className="toggle-thumb" style={{ left: value ? 26 : 4 }} />
    </button>
  );
}

function SettingRow({ icon, title, desc, children }) {
  const { speak } = useApp();
  return (
    <div style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '14px 0', borderBottom: '1px solid rgba(201,168,76,0.05)' }} onMouseEnter={() => speak(`${title}. ${desc}`)}>
      <span style={{ fontSize: 20, flexShrink: 0, width: 26 }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', fontWeight: 500, marginBottom: 2 }}>{title}</p>
        {desc && <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5 }}>{desc}</p>}
      </div>
      {children}
    </div>
  );
}

export function Settings() {
  const { speak } = useApp();
  const [s, setS] = useState({
    notifications: true, moodReminders: true, prayerReminders: true,
    tts: false, voiceNav: false, captionsMode: false,
    largeText: false, highContrast: false, reducedMotion: false,
    anonymous: true, dataSharing: false, soundscape: true,
  });
  const toggle = (key) => setS(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="page-container">
      <div style={{ marginBottom: 28 }}>
        <h1 className="page-title">⚙️ Settings</h1>
        <p className="page-subtitle">Customize Synata to serve you perfectly — every ability, every need</p>
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        <div>
          <div className="card" style={{ marginBottom: 20 }}>
            <h3 className="section-title">🔔 Notifications</h3>
            <SettingRow icon="🔔" title="Push Notifications" desc="Daily check-ins and milestone alerts"><Toggle value={s.notifications} onChange={() => toggle('notifications')} label="Toggle notifications" /></SettingRow>
            <SettingRow icon="🌙" title="Mood Reminders" desc="3x daily gentle prompts to log your mood"><Toggle value={s.moodReminders} onChange={() => toggle('moodReminders')} label="Toggle mood reminders" /></SettingRow>
            <SettingRow icon="🧎" title="Salah Reminders" desc="Reminder before each prayer time"><Toggle value={s.prayerReminders} onChange={() => toggle('prayerReminders')} label="Toggle prayer reminders" /></SettingRow>
          </div>

          <div className="card" style={{ marginBottom: 20 }}>
            <h3 className="section-title">♿ Accessibility</h3>
            <SettingRow icon="🔊" title="Text-to-Speech" desc="Synata reads all content aloud on hover"><Toggle value={s.tts} onChange={() => { toggle('tts'); speak(s.tts ? 'Text to speech disabled' : 'Text to speech enabled'); }} label="Toggle text to speech" /></SettingRow>
            <SettingRow icon="🎤" title="Voice Navigation" desc="Navigate the app entirely by voice"><Toggle value={s.voiceNav} onChange={() => toggle('voiceNav')} label="Toggle voice navigation" /></SettingRow>
            <SettingRow icon="💬" title="Visual Captions Mode" desc="Extra visual cues — no audio dependency (for deaf users)"><Toggle value={s.captionsMode} onChange={() => toggle('captionsMode')} label="Toggle captions mode" /></SettingRow>
            <SettingRow icon="🔠" title="Large Text" desc="Increases all text sizes across the app"><Toggle value={s.largeText} onChange={() => { toggle('largeText'); document.body.classList.toggle('large-text', !s.largeText); }} label="Toggle large text" /></SettingRow>
            <SettingRow icon="⬛" title="High Contrast" desc="Stronger color contrast for visual clarity"><Toggle value={s.highContrast} onChange={() => { toggle('highContrast'); document.body.classList.toggle('high-contrast', !s.highContrast); }} label="Toggle high contrast" /></SettingRow>
            <SettingRow icon="🧘" title="Reduce Motion" desc="Minimizes all animations (for motion sensitivity)"><Toggle value={s.reducedMotion} onChange={() => { toggle('reducedMotion'); document.body.classList.toggle('reduced-motion', !s.reducedMotion); }} label="Toggle reduce motion" /></SettingRow>
          </div>
        </div>

        <div>
          <div className="card" style={{ marginBottom: 20 }}>
            <h3 className="section-title">🔒 Privacy</h3>
            <SettingRow icon="👤" title="Anonymous in Community" desc="Your real name is never shown"><Toggle value={s.anonymous} onChange={() => toggle('anonymous')} label="Toggle anonymity" /></SettingRow>
            <SettingRow icon="📊" title="Anonymous Research Data" desc="Contribute anonymized data to Islamic mental health research"><Toggle value={s.dataSharing} onChange={() => toggle('dataSharing')} label="Toggle data sharing" /></SettingRow>
            <div style={{ marginTop: 14, padding: '12px 14px', borderRadius: 'var(--radius-sm)', background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.1)' }}>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.6 }}>🛡️ All your data is stored locally and encrypted. Synata never sells your data. Delete everything anytime. Amana (trust) is sacred to us.</p>
            </div>
          </div>

          <div className="card" style={{ marginBottom: 20 }}>
            <h3 className="section-title">🎵 Sound</h3>
            <SettingRow icon="🎵" title="Healing Tones" desc="Ambient healing frequencies during sessions"><Toggle value={s.soundscape} onChange={() => toggle('soundscape')} label="Toggle healing tones" /></SettingRow>
            {s.soundscape && (
              <div style={{ marginTop: 10 }}>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>Volume</p>
                <input type="range" min="0" max="1" step="0.05" defaultValue="0.5" style={{ width: '100%', accentColor: 'var(--gold-mid)' }} aria-label="Healing tones volume" />
              </div>
            )}
          </div>

          <div className="card">
            <h3 className="section-title">⚠️ Data</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>📥 Export My Data</button>
              <button className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>📋 View Journal Archive</button>
              <button className="btn btn-danger" style={{ justifyContent: 'flex-start' }}>🗑️ Delete All Data</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}