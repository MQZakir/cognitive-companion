import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const prayerInfo = {
  Fajr:    { arabic: 'الفجر',   time: 'Before sunrise',    rakaat: 2, virtue: 'Better than the world and all it contains', emoji: '🌅' },
  Dhuhr:   { arabic: 'الظهر',   time: 'After midday',      rakaat: 4, virtue: 'The gates of heaven open at midday', emoji: '☀️' },
  Asr:     { arabic: 'العصر',   time: 'Afternoon',         rakaat: 4, virtue: 'Whoever misses Asr, it is as if he lost his family and wealth', emoji: '🌤️' },
  Maghrib: { arabic: 'المغرب',  time: 'After sunset',      rakaat: 3, virtue: 'The dua between adhan and iqamah is not rejected', emoji: '🌅' },
  Isha:    { arabic: 'العشاء',  time: 'Night',             rakaat: 4, virtue: 'Whoever prays Isha in congregation has prayed half the night', emoji: '🌙' },
};

const weeklyData = [
  { day: 'Sat', prayers: 3 },
  { day: 'Sun', prayers: 5 },
  { day: 'Mon', prayers: 4 },
  { day: 'Tue', prayers: 5 },
  { day: 'Wed', prayers: 3 },
  { day: 'Thu', prayers: 4 },
  { day: 'Fri', prayers: 5 },
];

export default function SalahTracker() {
  const { prayerLog, togglePrayer, prayers, prayerTimes, speak } = useApp();
  const [now, setNow] = useState(new Date());
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const done = Object.values(prayerLog).filter(Boolean).length;

  const getNextPrayer = () => {
    const timeStr = now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0');
    const upcoming = prayers.find(p => prayerTimes[p] > timeStr);
    return upcoming || 'Fajr';
  };

  const nextPrayer = getNextPrayer();

  return (
    <div className="page-container">
      <div style={{ marginBottom: 28 }}>
        <h1 className="page-title">🧎 Salah Tracker</h1>
        <p className="page-subtitle">The pillar of your day — track, reflect, grow closer to Allah</p>
      </div>

      {/* Today overview */}
      <div className="quran-card" style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 6, letterSpacing: '1px', textTransform: 'uppercase' }}>Today's Progress</p>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 56, color: 'var(--gold-bright)', lineHeight: 1, marginBottom: 8 }}>
              {done}<span style={{ fontSize: 28, color: 'var(--text-muted)' }}>/5</span>
            </p>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>
              {done === 5 ? 'MashaAllah! All 5 prayers completed today 🌟' :
               done === 0 ? 'The day has just begun — Bismillah 🤲' :
               `${5 - done} prayer${5-done > 1 ? 's' : ''} remaining — keep going 💚`}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 4 }}>Next Prayer</p>
            <p style={{ fontFamily: 'var(--font-arabic)', fontSize: 24, color: 'var(--gold-bright)', marginBottom: 2 }}>
              {prayerInfo[nextPrayer]?.arabic}
            </p>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>{nextPrayer} · {prayerTimes[nextPrayer]}</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
          {prayers.map(p => (
            <div key={p} style={{ flex: 1, height: 6, borderRadius: 3, background: prayerLog[p] ? 'var(--gold-mid)' : 'rgba(201,168,76,0.1)', transition: 'background 0.3s' }} title={`${p}: ${prayerLog[p] ? 'Prayed' : 'Not yet'}`} />
          ))}
        </div>
      </div>

      {/* Prayer cards */}
      <div className="grid-3" style={{ marginBottom: 28 }}>
        {prayers.map(prayer => {
          const info = prayerInfo[prayer];
          const done = prayerLog[prayer];
          const isNext = prayer === nextPrayer;
          return (
            <div
              key={prayer}
              className={`prayer-card${isNext ? ' active' : ''}`}
              style={{ cursor: 'pointer' }}
              onClick={() => { setSelected(selected === prayer ? null : prayer); speak(`${prayer} prayer. ${info.time}. ${info.rakaat} rakaat.`); }}
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && setSelected(selected === prayer ? null : prayer)}
              aria-label={`${prayer} prayer, ${done ? 'completed' : 'not yet prayed'}. ${info.time}.`}
            >
              <p style={{ fontSize: 24, marginBottom: 4 }}>{info.emoji}</p>
              <p className="arabic-text" style={{ fontSize: 20, marginBottom: 4 }}>{info.arabic}</p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', color: isNext ? 'var(--gold-bright)' : 'var(--text-primary)', fontWeight: 500, marginBottom: 2 }}>{prayer}</p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 12 }}>{prayerTimes[prayer]} · {info.rakaat} rakaat</p>

              <button
                onClick={(e) => { e.stopPropagation(); togglePrayer(prayer); speak(done ? `${prayer} marked as not prayed` : `${prayer} marked as prayed. MashaAllah!`); }}
                className={done ? 'btn btn-ghost' : 'btn btn-gold'}
                style={{ width: '100%', fontSize: 13 }}
                aria-label={done ? `Mark ${prayer} as not prayed` : `Mark ${prayer} as prayed`}
              >
                {done ? '✓ Prayed' : 'Mark as Prayed'}
              </button>

              {selected === prayer && (
                <div style={{ marginTop: 12, textAlign: 'left', padding: '10px 12px', borderRadius: 'var(--radius-sm)', background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.12)' }}>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 4 }}>Virtue:</p>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-soft)', lineHeight: 1.5, fontStyle: 'italic' }}>"{info.virtue}"</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Synata */}
      <div className="card" style={{ marginBottom: 24, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        <span style={{ fontSize: 22 }}>☽</span>
        <div>
          <p style={{ fontSize: 12, color: 'var(--gold-mid)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 6 }}>Synata</p>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)', lineHeight: 1.7 }}>
            {done === 0
              ? "No prayers logged yet today — and that's okay. Wherever you are, whenever you're ready, Allah is closer to you than your jugular vein. 🤲"
              : done < 3
              ? `You've prayed ${done} so far — that's real. Each salah is a conversation with Allah. Let's keep the connection alive. 💚`
              : done < 5
              ? `SubhanAllah, ${done} prayers done! You're almost there. The next one is ${nextPrayer} at ${prayerTimes[nextPrayer]}. 🌙`
              : "MashaAllah! All 5 prayers completed. You've spoken to Allah 5 times today. That is a beautiful, beautiful thing. 🌟"}
          </p>
        </div>
      </div>

      {/* Weekly chart */}
      <div className="card">
        <h3 className="section-title">📊 Weekly Salah Consistency</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,0.06)" />
            <XAxis dataKey="day" stroke="#2d6a4f" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
            <YAxis domain={[0,5]} ticks={[0,1,2,3,4,5]} stroke="#2d6a4f" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
            <Tooltip
              contentStyle={{ background: '#0d1f13', border: '1px solid rgba(201,168,76,0.25)', borderRadius: 10, fontSize: 12 }}
              formatter={(v) => [`${v}/5 prayers`, 'Prayers']}
            />
            <Bar dataKey="prayers" fill="var(--gold-mid)" radius={[6,6,0,0]} maxBarSize={48} />
          </BarChart>
        </ResponsiveContainer>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 10, textAlign: 'center', fontStyle: 'italic' }}>
          Your average this week: {(weeklyData.reduce((a,b) => a + b.prayers, 0) / 7).toFixed(1)}/5 prayers per day
        </p>
      </div>
    </div>
  );
}