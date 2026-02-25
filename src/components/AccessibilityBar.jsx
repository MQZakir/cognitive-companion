import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function AccessibilityBar() {
  const { accessibility, updateAccessibility, speak } = useApp();
  const [open, setOpen] = useState(false);

  const tools = [
    { key: 'largeText',     icon: '🔠', label: 'Large Text',       desc: 'Increase all text sizes' },
    { key: 'highContrast',  icon: '⬛', label: 'High Contrast',    desc: 'Stronger color contrast' },
    { key: 'reducedMotion', icon: '🧘', label: 'Reduce Motion',     desc: 'Minimize animations' },
    { key: 'tts',           icon: '🔊', label: 'Read Aloud (TTS)',  desc: 'Text-to-speech on hover' },
    { key: 'captionsMode',  icon: '💬', label: 'Visual Cues',       desc: 'Extra visual indicators for deaf users' },
  ];

  return (
    <div className="a11y-bar" role="toolbar" aria-label="Accessibility tools">
      {/* Quick toggles visible always */}
      <button
        className="btn btn-ghost"
        style={{ padding: '4px 12px', minHeight: 32, fontSize: 12 }}
        onClick={() => updateAccessibility('largeText', !accessibility.largeText)}
        aria-pressed={accessibility.largeText}
        title="Toggle large text"
      >
        🔠 {accessibility.largeText ? 'Normal Text' : 'Large Text'}
      </button>

      <button
        className="btn btn-ghost"
        style={{ padding: '4px 12px', minHeight: 32, fontSize: 12 }}
        onClick={() => {
          const next = !accessibility.tts;
          updateAccessibility('tts', next);
          if (next) speak('Text to speech is now enabled. I will read content aloud for you.');
        }}
        aria-pressed={accessibility.tts}
        title="Toggle text-to-speech"
      >
        🔊 {accessibility.tts ? 'TTS On' : 'TTS Off'}
      </button>

      <button
        className="btn btn-ghost"
        style={{ padding: '4px 12px', minHeight: 32, fontSize: 12 }}
        onClick={() => updateAccessibility('captionsMode', !accessibility.captionsMode)}
        aria-pressed={accessibility.captionsMode}
        title="Visual cues mode for deaf users"
      >
        💬 {accessibility.captionsMode ? 'Captions On' : 'Captions'}
      </button>

      {/* More options */}
      <div style={{ position: 'relative' }}>
        <button
          className="btn btn-ghost"
          style={{ padding: '4px 12px', minHeight: 32, fontSize: 12 }}
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-haspopup="true"
        >
          ♿ More
        </button>

        {open && (
          <div style={{
            position: 'absolute', top: 40, right: 0,
            width: 280,
            background: 'rgba(8,15,10,0.98)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: 16,
            zIndex: 600,
            backdropFilter: 'blur(20px)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
          }}
            role="menu"
          >
            <p style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 12 }}>
              Accessibility Options
            </p>
            {tools.map(tool => (
              <div
                key={tool.key}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                }}
              >
                <span style={{ fontSize: 18, width: 24, textAlign: 'center' }}>{tool.icon}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{tool.label}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{tool.desc}</p>
                </div>
                <button
                  onClick={() => updateAccessibility(tool.key, !accessibility[tool.key])}
                  className="toggle"
                  style={{ background: accessibility[tool.key] ? 'var(--green-mid)' : 'rgba(255,255,255,0.08)' }}
                  aria-pressed={accessibility[tool.key]}
                  aria-label={`Toggle ${tool.label}`}
                  role="switch"
                >
                  <div className="toggle-thumb" style={{ left: accessibility[tool.key] ? 26 : 4 }} />
                </button>
              </div>
            ))}

            <div style={{ marginTop: 12, padding: '10px 12px', borderRadius: 10, background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.12)' }}>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                🤲 Synata is built for every ability. All features support screen readers, voice navigation, and motor accessibility.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}