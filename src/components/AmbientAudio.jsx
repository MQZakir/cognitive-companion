import React, { useState, useRef } from 'react';

function createHealingTones(ctx) {
  const master = ctx.createGain();
  master.gain.setValueAtTime(0.07, ctx.currentTime);
  master.connect(ctx.destination);

  // Solfeggio frequencies used in Islamic healing tradition
  const freqs = [256, 396, 432, 528, 639];
  const oscs = freqs.map((freq, i) => {
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    const pan  = ctx.createStereoPanner();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    // Gentle tremolo
    const lfo     = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(0.08 + i * 0.03, ctx.currentTime);
    lfoGain.gain.setValueAtTime(freq * 0.003, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    lfo.start();

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.12 / freqs.length, ctx.currentTime + 4 + i * 0.5);
    pan.pan.setValueAtTime((i % 3 - 1) * 0.3, ctx.currentTime);

    osc.connect(gain);
    gain.connect(pan);
    pan.connect(master);
    osc.start();

    return { osc, lfo, gain };
  });

  // Soft rain-like noise
  const bufSz  = ctx.sampleRate * 3;
  const buf    = ctx.createBuffer(1, bufSz, ctx.sampleRate);
  const data   = buf.getChannelData(0);
  for (let i = 0; i < bufSz; i++) data[i] = (Math.random() * 2 - 1) * 0.25;
  const noise  = ctx.createBufferSource();
  noise.buffer = buf;
  noise.loop   = true;
  const nFilt  = ctx.createBiquadFilter();
  nFilt.type   = 'lowpass';
  nFilt.frequency.setValueAtTime(180, ctx.currentTime);
  const nGain  = ctx.createGain();
  nGain.gain.setValueAtTime(0.035, ctx.currentTime);
  noise.connect(nFilt);
  nFilt.connect(nGain);
  nGain.connect(master);
  noise.start();

  return { oscs, master, noise };
}

export default function AmbientAudio() {
  const [playing, setPlaying]       = useState(false);
  const [vol, setVol]               = useState(0.5);
  const [open, setOpen]             = useState(false);
  const ctxRef   = useRef(null);
  const soundRef = useRef(null);

  const toggle = () => {
    if (!playing) {
      if (!ctxRef.current) ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      if (ctxRef.current.state === 'suspended') ctxRef.current.resume();
      soundRef.current = createHealingTones(ctxRef.current);
      setPlaying(true);
    } else {
      if (soundRef.current) {
        soundRef.current.master.gain.linearRampToValueAtTime(0, ctxRef.current.currentTime + 1.5);
        setTimeout(() => {
          soundRef.current.oscs.forEach(o => { try { o.osc.stop(); o.lfo.stop(); } catch(e){} });
          try { soundRef.current.noise.stop(); } catch(e){}
        }, 1600);
      }
      setPlaying(false);
    }
  };

  const handleVol = (e) => {
    const v = parseFloat(e.target.value);
    setVol(v);
    if (soundRef.current && ctxRef.current) {
      soundRef.current.master.gain.setValueAtTime(v * 0.14, ctxRef.current.currentTime);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: 28, left: 282, zIndex: 300 }}>
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setOpen(!open)}
          className="btn btn-ghost btn-icon"
          style={{
            background: playing ? 'rgba(64,145,108,0.2)' : 'rgba(13,31,19,0.9)',
            border: `1px solid ${playing ? 'rgba(64,145,108,0.4)' : 'rgba(201,168,76,0.15)'}`,
            color: playing ? 'var(--green-light)' : 'var(--text-muted)',
            fontSize: 20,
          }}
          aria-label={playing ? 'Ambient healing tones playing' : 'Play ambient healing tones'}
          title="Healing tones"
        >
          {playing ? '🎵' : '🔇'}
        </button>

        {open && (
          <div style={{
            position: 'absolute', bottom: 54, left: 0,
            width: 220,
            background: 'rgba(8,15,10,0.98)',
            border: '1px solid rgba(201,168,76,0.18)',
            borderRadius: 'var(--radius-lg)',
            padding: 18,
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          }}>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 12 }}>
              Healing Tones
            </p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12, lineHeight: 1.5, fontStyle: 'italic' }}>
              Solfeggio frequencies to calm the mind and heart 🌿
            </p>
            <button
              onClick={toggle}
              className={playing ? 'btn btn-danger' : 'btn btn-primary'}
              style={{ width: '100%', marginBottom: 12, fontSize: 13 }}
            >
              {playing ? '⏸ Pause' : '▶ Play Healing Tones'}
            </button>
            {playing && (
              <>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>Volume</p>
                <input
                  type="range" min="0" max="1" step="0.05"
                  value={vol} onChange={handleVol}
                  style={{ width: '100%', accentColor: 'var(--gold-mid)' }}
                  aria-label="Volume control"
                />
              </>
            )}
            <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 10, lineHeight: 1.5, textAlign: 'center' }}>
              بِسْمِ اللَّهِ
            </p>
          </div>
        )}
      </div>
    </div>
  );
}