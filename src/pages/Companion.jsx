import React from 'react';
import SynataChat from '../components/SynataChat';
import { useApp } from '../context/AppContext';

export default function Companion() {
  const { user, disabilities } = useApp();
  const disability = disabilities.find(d => d.id === user.disability) || disabilities[0];

  const tips = {
    blind:    '🔊 TTS is your primary interface here. Enable it in the toolbar above.',
    deaf:     '💬 All responses are fully visual. No audio required to use Synata.',
    physical: '♿ Large buttons throughout. You can navigate entirely by keyboard (Tab + Enter).',
    mute:     '🤲 No speaking needed — type or use preset responses. I understand you.',
    default:  '✦ Type freely, use your voice, or share how you feel in any way that works for you.',
  };

  const tip = tips[user.disability] || tips.default;

  return (
    <div className="page-container" style={{ height: 'calc(100vh - 44px)', display: 'flex', flexDirection: 'column', paddingBottom: 16 }}>
      <div style={{ marginBottom: 20 }}>
        <h1 className="page-title">☽ Synata — Your Companion</h1>
        <p className="page-subtitle">An Islamic AI companion — here for your heart, mind, and soul</p>
      </div>

      {/* Accessibility tip */}
      <div style={{
        marginBottom: 16, padding: '10px 18px',
        borderRadius: 'var(--radius-md)',
        background: 'rgba(45,106,79,0.08)',
        border: '1px solid rgba(201,168,76,0.12)',
        fontSize: 'var(--text-sm)', color: 'var(--text-soft)',
      }}>
        {tip}
      </div>

      {/* Chat fills the rest */}
      <div style={{
        flex: 1, minHeight: 0,
        background: 'rgba(8,15,10,0.9)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid rgba(201,168,76,0.15)',
        overflow: 'hidden',
        backdropFilter: 'blur(20px)',
      }}>
        <SynataChat embedded={true} />
      </div>

      {/* Tags */}
      <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
        {['🧠 Mood Detection', '🎤 Voice Input', '📖 Quranic Guidance', '🌊 Crisis Support', '♿ Fully Accessible', '🔊 Text-to-Speech', '💬 Deaf Friendly', '🤲 Islamic Values'].map((tag, i) => (
          <span key={i} className="badge badge-green">{tag}</span>
        ))}
      </div>
    </div>
  );
}