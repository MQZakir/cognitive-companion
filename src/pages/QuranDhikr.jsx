import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function QuranDhikr() {
  const { quranVerses, dhikrList, duas, speak } = useApp();
  const [tab, setTab]           = useState('quran');
  const [dhikrCounts, setDhikrCounts] = useState({});
  const [activeVerse, setActiveVerse] = useState(0);
  const [activeDua, setActiveDua]     = useState(null);

  const incrementDhikr = (idx) => {
    setDhikrCounts(prev => ({ ...prev, [idx]: (prev[idx] || 0) + 1 }));
    speak(dhikrList[idx].transliteration);
  };

  const resetDhikr = (idx) => setDhikrCounts(prev => ({ ...prev, [idx]: 0 }));

  return (
    <div className="page-container">
      <div style={{ marginBottom: 28 }}>
        <h1 className="page-title">📖 Quran & Dhikr</h1>
        <p className="page-subtitle">"In the remembrance of Allah do hearts find rest" — 13:28</p>
      </div>

      <div className="tab-bar">
        {[
          { id: 'quran', label: '📖 Quran Verses' },
          { id: 'dhikr', label: '📿 Dhikr Counter' },
          { id: 'dua',   label: '🤲 Duas' },
        ].map(t => (
          <button key={t.id} className={`tab-btn${tab === t.id ? ' active' : ''}`} onClick={() => { setTab(t.id); speak(t.label); }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'quran' && (
        <div>
          {/* Synata says */}
          <div style={{
            marginBottom: 24, padding: '14px 20px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(45,106,79,0.1)',
            border: '1px solid rgba(201,168,76,0.15)',
            display: 'flex', gap: 12,
          }}>
            <span style={{ fontSize: 18 }}>☽</span>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)', fontStyle: 'italic', lineHeight: 1.6 }}>
              Synata: "These verses were chosen for healing, patience, hope, and tawakkul. Let each one settle in your heart. Hover over any verse and I'll read it to you. 🌙"
            </p>
          </div>

          {/* Verse navigator */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
            {quranVerses.map((v, i) => (
              <button
                key={i}
                onClick={() => { setActiveVerse(i); speak(v.translation); }}
                className="btn btn-ghost"
                style={{
                  padding: '6px 14px', minHeight: 36, fontSize: 12,
                  background: activeVerse === i ? 'rgba(201,168,76,0.12)' : 'transparent',
                  borderColor: activeVerse === i ? 'rgba(201,168,76,0.4)' : undefined,
                  color: activeVerse === i ? 'var(--gold-bright)' : undefined,
                }}
                aria-pressed={activeVerse === i}
              >
                {v.reference.split(' ')[1]}
              </button>
            ))}
          </div>

          {/* Active verse */}
          <div className="quran-card" style={{ marginBottom: 24 }}>
            <span className="badge badge-gold" style={{ marginBottom: 16, display: 'inline-flex' }}>
              {quranVerses[activeVerse].theme}
            </span>
            <p
              className="arabic-text-lg"
              style={{ marginBottom: 20 }}
              onMouseEnter={() => speak(quranVerses[activeVerse].translation)}
              tabIndex={0}
              aria-label={`Arabic verse: ${quranVerses[activeVerse].translation}`}
            >
              {quranVerses[activeVerse].arabic}
            </p>
            <p style={{
              fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)',
              color: 'var(--text-soft)', fontStyle: 'italic', lineHeight: 1.7, marginBottom: 12,
            }}>
              "{quranVerses[activeVerse].translation}"
            </p>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>{quranVerses[activeVerse].reference}</p>

            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button className="btn btn-primary" onClick={() => speak(quranVerses[activeVerse].translation)}>
                🔊 Read Aloud
              </button>
              <button
                className="btn btn-outline"
                onClick={() => setActiveVerse((activeVerse + 1) % quranVerses.length)}
              >
                Next Verse →
              </button>
            </div>
          </div>

          {/* All verses grid */}
          <div className="grid-2">
            {quranVerses.map((v, i) => (
              <div
                key={i}
                className="card card-clickable"
                onClick={() => { setActiveVerse(i); speak(v.translation); }}
                style={{ borderColor: activeVerse === i ? 'rgba(201,168,76,0.35)' : undefined }}
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && setActiveVerse(i)}
                aria-label={`Verse: ${v.translation}. ${v.reference}`}
              >
                <span className="badge badge-gold" style={{ marginBottom: 10, display: 'inline-flex' }}>{v.theme}</span>
                <p className="arabic-text" style={{ fontSize: 20, marginBottom: 10 }}>{v.arabic}</p>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)', fontStyle: 'italic', lineHeight: 1.6 }}>
                  "{v.translation}"
                </p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 8 }}>{v.reference}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'dhikr' && (
        <div>
          <div style={{
            marginBottom: 24, padding: '14px 20px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(45,106,79,0.1)',
            border: '1px solid rgba(201,168,76,0.15)',
          }}>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)', fontStyle: 'italic' }}>
              ☽ Synata: "Tap each dhikr to count. I'll say it aloud for you if TTS is enabled. Large buttons are here for everyone — take your time. 📿"
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {dhikrList.map((d, i) => {
              const count = dhikrCounts[i] || 0;
              const progress = Math.min(count / d.recommended, 1);
              return (
                <div key={i} className="card" style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <p
                      className="arabic-text"
                      style={{ fontSize: 28, marginBottom: 8 }}
                      onMouseEnter={() => speak(d.transliteration)}
                    >
                      {d.arabic}
                    </p>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--gold-mid)', marginBottom: 2 }}>{d.transliteration}</p>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 12 }}>{d.translation}</p>
                    <div className="progress-track" style={{ marginBottom: 4 }}>
                      <div className="progress-fill" style={{ width: `${progress * 100}%`, background: 'linear-gradient(90deg, var(--green-mid), var(--gold-mid))' }} />
                    </div>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{count} / {d.recommended}</p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center', flexShrink: 0 }}>
                    <button
                      onClick={() => incrementDhikr(i)}
                      className="btn btn-gold"
                      style={{
                        width: 72, height: 72, borderRadius: '50%', padding: 0,
                        fontSize: 'var(--text-2xl)', fontFamily: 'var(--font-display)',
                        boxShadow: count > 0 ? '0 0 20px rgba(201,168,76,0.3)' : 'none',
                      }}
                      aria-label={`Count ${d.transliteration}. Current count: ${count}`}
                    >
                      {count >= d.recommended ? '✓' : count}
                    </button>
                    <button onClick={() => resetDhikr(i)} className="btn btn-ghost" style={{ fontSize: 11, padding: '4px 10px', minHeight: 32 }} aria-label={`Reset ${d.transliteration} count`}>
                      Reset
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Total */}
          <div style={{ marginTop: 24, padding: '20px 24px', borderRadius: 'var(--radius-lg)', background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', color: 'var(--gold-bright)', marginBottom: 4 }}>
              {Object.values(dhikrCounts).reduce((a, b) => a + b, 0)} 📿
            </p>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>Total dhikr today — every single one is recorded by Allah</p>
          </div>
        </div>
      )}

      {tab === 'dua' && (
        <div>
          <div style={{ marginBottom: 20, padding: '14px 20px', borderRadius: 'var(--radius-md)', background: 'rgba(45,106,79,0.1)', border: '1px solid rgba(201,168,76,0.15)' }}>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)', fontStyle: 'italic' }}>
              ☽ Synata: "These duas were selected for your wellbeing journey. Click any dua to expand it. I'll read it aloud if TTS is enabled. 🤲"
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {duas.map((dua, i) => (
              <div
                key={i}
                className="card card-clickable"
                onClick={() => { setActiveDua(activeDua === i ? null : i); speak(`${dua.title}. ${dua.translation}`); }}
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && setActiveDua(activeDua === i ? null : i)}
                aria-expanded={activeDua === i}
                aria-label={`${dua.title}: ${dua.translation}`}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', color: 'var(--text-primary)', marginBottom: 4 }}>{dua.title}</h3>
                    <span className="badge badge-soft">{dua.when}</span>
                  </div>
                  <span style={{ color: 'var(--text-muted)', fontSize: 18 }}>{activeDua === i ? '▲' : '▼'}</span>
                </div>

                {activeDua === i && (
                  <div style={{ marginTop: 20 }}>
                    <p className="arabic-text" style={{ fontSize: 22, marginBottom: 14 }}>{dua.arabic}</p>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', color: 'var(--text-soft)', fontStyle: 'italic', lineHeight: 1.7, marginBottom: 12 }}>
                      "{dua.translation}"
                    </p>
                    <button className="btn btn-primary" style={{ fontSize: 13 }} onClick={(e) => { e.stopPropagation(); speak(dua.translation); }}>
                      🔊 Read Aloud
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}