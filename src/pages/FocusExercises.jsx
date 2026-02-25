import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

// ═══════════════════════════════════════════
// FOCUS TOOLS
// ═══════════════════════════════════════════
function PomodoroTimer() {
  const { speak } = useApp();
  const modes = {
    focus: { label: 'Focus', minutes: 25, color: 'var(--green-bright)' },
    short: { label: 'Short Break', minutes: 5, color: 'var(--gold-mid)' },
    long:  { label: 'Long Break', minutes: 15, color: 'var(--gold-bright)' },
  };
  const [mode, setMode] = useState('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            if (mode === 'focus') setSessions(s => s + 1);
            speak('Session complete. Alhamdulillah!');
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else clearInterval(intervalRef.current);
    return () => clearInterval(intervalRef.current);
  }, [running, mode, speak]);

  const changeMode = (m) => { setMode(m); setTimeLeft(modes[m].minutes * 60); setRunning(false); };
  const reset = () => { setTimeLeft(modes[mode].minutes * 60); setRunning(false); };

  const mins = Math.floor(timeLeft / 60).toString().padStart(2,'0');
  const secs = (timeLeft % 60).toString().padStart(2,'0');
  const progress = 1 - timeLeft / (modes[mode].minutes * 60);
  const C = 2 * Math.PI * 90;
  const col = modes[mode].color;

  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <h3 className="section-title" style={{ justifyContent: 'center' }}>⏱️ Pomodoro Timer</h3>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 28 }}>
        {Object.entries(modes).map(([key, val]) => (
          <button key={key} onClick={() => changeMode(key)} className={`tab-btn${mode === key ? ' active' : ''}`} style={{ minHeight: 36 }}>
            {val.label}
          </button>
        ))}
      </div>

      <div style={{ position: 'relative', width: 220, height: 220, margin: '0 auto 24px' }}>
        <svg width="220" height="220" style={{ transform: 'rotate(-90deg)' }} aria-hidden="true">
          <circle cx="110" cy="110" r="90" fill="none" stroke="rgba(201,168,76,0.06)" strokeWidth="8" />
          <circle cx="110" cy="110" r="90" fill="none" stroke={col} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={C} strokeDashoffset={C * (1 - progress)}
            style={{ transition: 'stroke-dashoffset 1s linear', filter: `drop-shadow(0 0 6px ${col})` }} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 50, fontWeight: 500, color: col, lineHeight: 1, letterSpacing: '-2px' }}
            aria-live="polite" aria-label={`${mins} minutes ${secs} seconds remaining`}>
            {mins}:{secs}
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6, textTransform: 'uppercase', letterSpacing: '2px' }}>{modes[mode].label}</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 20 }}>
        <button onClick={reset} className="btn btn-ghost btn-icon" aria-label="Reset timer">↺</button>
        <button onClick={() => { setRunning(!running); speak(running ? 'Timer paused' : 'Timer started. Bismillah.'); }} style={{ width: 64, height: 64, borderRadius: '50%', background: `linear-gradient(135deg, var(--green-mid), var(--green-deep))`, border: `2px solid rgba(201,168,76,0.25)`, color: 'var(--gold-pale)', fontSize: 22, cursor: 'pointer', boxShadow: '0 6px 20px rgba(45,106,79,0.4)', transition: 'transform 0.2s' }} aria-label={running ? 'Pause timer' : 'Start timer'}>
          {running ? '⏸' : '▶'}
        </button>
        <button onClick={() => setSessions(0)} className="btn btn-ghost btn-icon" aria-label="Reset sessions">✕</button>
      </div>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 16, alignItems: 'center' }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: i < sessions % 4 ? 'var(--gold-mid)' : 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)' }} aria-hidden="true" />
        ))}
        <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 4 }}>{sessions} sessions · BismAllah</span>
      </div>

      <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.1)' }}>
        <p style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-arabic)', textAlign: 'center' }}>
          "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ" — And whoever relies on Allah, He is sufficient for him.
        </p>
      </div>
    </div>
  );
}

function TaskManager() {
  const { speak } = useApp();
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Reply to 3 emails only', done: false, priority: 'high' },
    { id: 2, text: 'Take medication 💊', done: true, priority: 'high' },
    { id: 3, text: '10-min walk outside', done: false, priority: 'medium' },
    { id: 4, text: 'Read 1 page of Quran', done: true, priority: 'medium' },
    { id: 5, text: 'Journal reflection', done: false, priority: 'low' },
  ]);
  const [newTask, setNewTask] = useState('');

  const add = () => {
    if (!newTask.trim()) return;
    setTasks(t => [...t, { id: Date.now(), text: newTask, done: false, priority: 'medium' }]);
    setNewTask('');
    speak(`Task added: ${newTask}`);
  };

  const toggle = (id) => setTasks(t => t.map(x => x.id === id ? { ...x, done: !x.done } : x));
  const remove = (id) => setTasks(t => t.filter(x => x.id !== id));

  const priorities = { high: 'var(--gold-bright)', medium: 'var(--green-light)', low: 'var(--text-muted)' };

  return (
    <div className="card">
      <h3 className="section-title">📋 Task Breakdown</h3>
      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 14, fontStyle: 'italic' }}>
        ☽ Synata has broken your tasks into small, manageable steps
      </p>

      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <input className="input" value={newTask} onChange={e => setNewTask(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()} placeholder="Add a task..." aria-label="New task input" />
        <button onClick={add} className="btn btn-primary" style={{ flexShrink: 0 }} aria-label="Add task">+ Add</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {tasks.map(task => (
          <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 'var(--radius-md)', background: task.done ? 'rgba(8,15,10,0.4)' : 'rgba(13,31,19,0.6)', border: `1px solid ${task.done ? 'rgba(201,168,76,0.04)' : 'rgba(201,168,76,0.1)'}`, opacity: task.done ? 0.55 : 1, transition: 'all 0.2s' }}
            onMouseEnter={() => speak(`${task.text}. ${task.done ? 'Completed' : 'Pending'}`)}>
            <button onClick={() => toggle(task.id)} style={{ width: 22, height: 22, borderRadius: '50%', flexShrink: 0, background: task.done ? 'rgba(64,145,108,0.2)' : 'transparent', border: `2px solid ${task.done ? 'var(--green-light)' : 'rgba(201,168,76,0.25)'}`, color: 'var(--green-light)', cursor: 'pointer', fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-pressed={task.done} aria-label={`Mark "${task.text}" as ${task.done ? 'incomplete' : 'complete'}`}>
              {task.done ? '✓' : ''}
            </button>
            <span style={{ flex: 1, fontSize: 'var(--text-sm)', color: 'var(--text-soft)', textDecoration: task.done ? 'line-through' : 'none' }}>{task.text}</span>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: priorities[task.priority], flexShrink: 0 }} aria-hidden="true" />
            <button onClick={() => remove(task.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 14, minHeight: 36, minWidth: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label={`Remove task: ${task.text}`}>✕</button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 14, padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.08)' }}>
        <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          {tasks.filter(t => t.done).length}/{tasks.length} done ·{' '}
          <span style={{ color: 'var(--green-light)' }}>{Math.round(tasks.filter(t => t.done).length / Math.max(tasks.length,1) * 100)}% complete</span>
        </p>
      </div>
    </div>
  );
}

export function Focus() {
  const { user, disabilities } = useApp();
  const disability = disabilities.find(d => d.id === user.disability) || disabilities[0];

  const tips = {
    adhd: ['⏱️ Body Doubling — work alongside someone (even virtually)', '🧩 Break tasks into 5-10 minute micro-steps', '🧎 Salah times are natural brain reset points — use them', '📿 Dhikr between tasks resets the nervous system'],
    autism: ['♾️ Use salah times as daily structure anchors', '🌊 Honor your sensory needs — this is not weakness', '📋 Written visual schedules reduce decision fatigue', '🌿 Special interests are legitimate deep-focus activities'],
    default: ['🎯 Set one clear intention before starting', '🧎 Pray Dhuhr before afternoon work — it resets focus', '🌿 Breaks should be restful, not stimulating', '📿 Dhikr is a proven cognitive anchor'],
  };

  const tipList = tips[user.disability] || tips.default;

  return (
    <div className="page-container">
      <div style={{ marginBottom: 28 }}>
        <h1 className="page-title">⚡ Focus Tools</h1>
        <p className="page-subtitle">Neurodivergent-friendly tools — blessed with Islamic intention</p>
      </div>

      <div className="grid-2" style={{ marginBottom: 28 }}>
        <PomodoroTimer />
        <TaskManager />
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <h3 className="section-title">✦ Synata's Focus Tips for {disability.label}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
          {tipList.map((tip, i) => (
            <div key={i} style={{ padding: '14px 16px', borderRadius: 'var(--radius-md)', background: 'rgba(8,15,10,0.6)', border: '1px solid rgba(201,168,76,0.08)', display: 'flex', gap: 12 }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>{tip.split(' ')[0]}</span>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)', lineHeight: 1.6 }}>{tip.substring(tip.indexOf(' ') + 1)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid-3">
        {[
          { l: 'Sessions Today', v: '3', sub: 'Goal: 5', c: 'var(--green-light)' },
          { l: 'Total Focus Time', v: '1h 15m', sub: 'Best: 45 min', c: 'var(--gold-bright)' },
          { l: 'Tasks Completed', v: '2/5', sub: 'Keep going 💚', c: 'var(--green-bright)' },
        ].map((s, i) => (
          <div key={i} className="card" style={{ textAlign: 'center', padding: '28px 16px' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', color: s.c, marginBottom: 4 }}>{s.v}</p>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)', marginBottom: 4 }}>{s.l}</p>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{s.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// EXERCISES
// ═══════════════════════════════════════════
function BreathingExercise({ name, pattern, description, color, arabic }) {
  const { speak } = useApp();
  const [active, setActive] = useState(false);
  const [phase, setPhase] = useState('ready');
  const [count, setCount] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [scale, setScale] = useState(1);
  const phaseRef = useRef(null);

  const phases = [
    { key: 'inhale', label: 'Breathe In', duration: pattern[0], scale: 1.3 },
    pattern[1] ? { key: 'hold1', label: 'Hold', duration: pattern[1], scale: 1.3 } : null,
    { key: 'exhale', label: 'Breathe Out', duration: pattern[2], scale: 1 },
    pattern[3] ? { key: 'hold2', label: 'Hold', duration: pattern[3], scale: 1 } : null,
  ].filter(Boolean);

  useEffect(() => {
    if (!active) { setPhase('ready'); setCount(0); setScale(1); return; }
    let idx = 0;
    const runPhase = () => {
      const p = phases[idx % phases.length];
      setPhase(p.key);
      setScale(p.scale);
      speak(p.label);
      let rem = p.duration;
      setCount(rem);
      phaseRef.current = setInterval(() => {
        rem -= 1;
        setCount(rem);
        if (rem <= 0) {
          clearInterval(phaseRef.current);
          idx++;
          if (idx % phases.length === 0) setCycles(c => c + 1);
          runPhase();
        }
      }, 1000);
    };
    runPhase();
    return () => clearInterval(phaseRef.current);
  }, [active]);

  const phaseLabels = { ready: 'Tap to begin', inhale: 'Breathe In', hold1: 'Hold', hold2: 'Hold', exhale: 'Breathe Out' };
  const dur = phases.find(p => p.key === phase) || { duration: 4 };

  return (
    <div className="card" style={{ textAlign: 'center', padding: '32px 20px' }}>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', marginBottom: 4, color: 'var(--text-primary)' }}>{name}</h3>
      {arabic && <p style={{ fontFamily: 'var(--font-arabic)', fontSize: 16, color: 'var(--gold-mid)', marginBottom: 8 }}>{arabic}</p>}
      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 24, lineHeight: 1.5 }}>{description}</p>

      <div onClick={() => setActive(!active)} style={{ width: 160, height: 160, borderRadius: '50%', margin: '0 auto 24px', background: `radial-gradient(circle, ${color}15 0%, ${color}05 100%)`, border: `2px solid ${color}33`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transform: `scale(${scale})`, transition: `transform ${dur.duration}s ease-in-out`, boxShadow: active ? `0 0 40px ${color}20` : 'none' }}
        role="button" aria-label={`${name} breathing exercise. ${active ? 'Click to stop' : 'Click to start'}`} tabIndex={0} onKeyDown={e => e.key === 'Enter' && setActive(!active)}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 44, color, lineHeight: 1 }}>{active ? count : '☽'}</span>
        <p style={{ fontSize: 11, color: 'var(--text-soft)', marginTop: 6 }}>{phaseLabels[phase]}</p>
      </div>

      <p style={{ fontSize: 'var(--text-sm)', color, marginBottom: 6 }}>{pattern.filter(Boolean).join('-')} pattern</p>
      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 16 }}>{cycles} cycles completed</p>
      <button onClick={() => { setActive(false); setCycles(0); }} className="btn btn-ghost" style={{ fontSize: 12 }}>Reset</button>
    </div>
  );
}

function GroundingExercise() {
  const { speak } = useApp();
  const steps = [
    { n: 5, sense: 'See',   emoji: '👁️', prompt: 'Name 5 things you can see right now', color: 'var(--green-bright)' },
    { n: 4, sense: 'Touch', emoji: '✋', prompt: 'Name 4 things you can physically feel', color: 'var(--gold-mid)' },
    { n: 3, sense: 'Hear',  emoji: '👂', prompt: 'Name 3 things you can hear around you', color: 'var(--green-light)' },
    { n: 2, sense: 'Smell', emoji: '👃', prompt: 'Name 2 things you can smell', color: 'var(--gold-bright)' },
    { n: 1, sense: 'Taste', emoji: '👅', prompt: 'Name 1 thing you can taste', color: 'var(--green-mid)' },
  ];
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [started, setStarted] = useState(false);
  const [inputs, setInputs] = useState({});

  if (!started) return (
    <div className="card" style={{ textAlign: 'center', padding: '40px 28px' }}>
      <div style={{ fontSize: 48, marginBottom: 14 }}>🌿</div>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', marginBottom: 10, color: 'var(--text-primary)' }}>5-4-3-2-1 Grounding</h3>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 20, maxWidth: 320, margin: '0 auto 20px' }}>Anchors you to the present moment through your senses. Excellent for anxiety, dissociation, and overwhelm.</p>
      <button className="btn btn-primary" onClick={() => { setStarted(true); speak('Starting grounding exercise. Bismillah.'); }}>Begin — بِسْمِ اللَّهِ</button>
    </div>
  );

  if (done) return (
    <div className="card" style={{ textAlign: 'center', padding: '40px 28px' }}>
      <div style={{ fontSize: 48, marginBottom: 14 }}>🤲</div>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', marginBottom: 10, color: 'var(--text-primary)' }}>You are grounded ✦</h3>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)', lineHeight: 1.7, marginBottom: 10 }}>MashaAllah. You guided your nervous system back to the present moment. That took real courage.</p>
      <p className="arabic-text" style={{ fontSize: 18, marginBottom: 20 }}>الْحَمْدُ لِلَّهِ</p>
      <button className="btn btn-outline" onClick={() => { setStep(0); setDone(false); setStarted(false); setInputs({}); }}>Do again</button>
    </div>
  );

  const curr = steps[step];
  return (
    <div className="card" style={{ padding: '28px 24px' }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
        {steps.map((s, i) => <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= step ? s.color : 'rgba(201,168,76,0.08)', transition: 'background 0.3s' }} />)}
      </div>
      <div style={{ width: 70, height: 70, borderRadius: '50%', background: `${curr.color}12`, border: `2px solid ${curr.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, margin: '0 auto 16px' }} aria-hidden="true">{curr.emoji}</div>
      <p style={{ textAlign: 'center', fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 4 }}>Step {step + 1} of 5</p>
      <h3 style={{ textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', color: curr.color, marginBottom: 8 }}>{curr.n} things you can {curr.sense.toLowerCase()}</h3>
      <p style={{ textAlign: 'center', fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: 16, fontStyle: 'italic' }}>{curr.prompt}</p>
      <textarea className="textarea" value={inputs[step] || ''} onChange={e => setInputs(i => ({ ...i, [step]: e.target.value }))} placeholder="Write or just think them in your mind..." style={{ height: 90, marginBottom: 14 }} aria-label={curr.prompt} />
      <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => { if (step < steps.length - 1) { setStep(s => s + 1); speak(steps[step + 1].prompt); } else setDone(true); }}>
        {step < steps.length - 1 ? `Next → ${steps[step+1].n} things to ${steps[step+1].sense}` : 'Complete ✓'}
      </button>
    </div>
  );
}

export function Exercises() {
  const [tab, setTab] = useState('breathing');

  return (
    <div className="page-container">
      <div style={{ marginBottom: 28 }}>
        <h1 className="page-title">🌿 Therapeutic Exercises</h1>
        <p className="page-subtitle">Evidence-based healing — grounded in faith</p>
      </div>

      <div className="tab-bar">
        {[
          { id: 'breathing', l: '🌬️ Breathing' },
          { id: 'grounding', l: '🌿 Grounding' },
          { id: 'sensory',   l: '🌊 Sensory' },
        ].map(t => <button key={t.id} className={`tab-btn${tab === t.id ? ' active' : ''}`} onClick={() => setTab(t.id)}>{t.l}</button>)}
      </div>

      {tab === 'breathing' && (
        <>
          <div style={{ marginBottom: 20, padding: '12px 18px', borderRadius: 'var(--radius-md)', background: 'rgba(45,106,79,0.08)', border: '1px solid rgba(201,168,76,0.12)' }}>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)', fontStyle: 'italic' }}>
              ☽ Synata recommends: Box Breathing for ADHD focus · 4-7-8 for anxiety · Deep Breathing for sadness
            </p>
          </div>
          <div className="grid-3">
            <BreathingExercise name="Box Breathing" pattern={[4,4,4,4]} description="Used by warriors and healers alike. Excellent for ADHD focus and acute anxiety." color="#40916c" arabic="بِسْمِ اللَّهِ" />
            <BreathingExercise name="4-7-8 Breathing" pattern={[4,7,8,0]} description="Activates the parasympathetic nervous system. Best for panic and racing thoughts." color="#c9a84c" arabic="سُبْحَانَ اللَّهِ" />
            <BreathingExercise name="Deep Belly" pattern={[5,0,5,0]} description="Simple diaphragmatic breathing. Reduces cortisol and grounds you in your body." color="#74c69d" arabic="الْحَمْدُ لِلَّهِ" />
          </div>
        </>
      )}

      {tab === 'grounding' && (
        <div className="grid-2" style={{ alignItems: 'start' }}>
          <GroundingExercise />
          <div>
            <div className="card" style={{ marginBottom: 14 }}>
              <h3 className="section-title" style={{ fontSize: 'var(--text-base)' }}>What is grounding?</h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)', lineHeight: 1.7 }}>Grounding techniques interrupt anxiety and dissociation by refocusing attention on the present physical environment. Effective for PTSD, autism overwhelm, and panic attacks.</p>
            </div>
            <div className="card">
              <p style={{ fontSize: 12, color: 'var(--gold-mid)', marginBottom: 6 }}>☽ Synata says</p>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)', lineHeight: 1.7, fontStyle: 'italic', fontFamily: 'var(--font-display)' }}>
                "When your nervous system fires, your thinking brain goes offline. Grounding brings it back online — one sense at a time. Allah put these senses in you as anchors. Use them. 🌿"
              </p>
            </div>
          </div>
        </div>
      )}

      {tab === 'sensory' && (
        <div className="grid-2">
          {[
            { icon: '💧', title: 'Cold Water / Wudu', desc: 'Performing wudu with cold water activates the dive reflex, rapidly slowing heart rate. The Prophet ﷺ encouraged this. It is both sunnah and scientifically sound.', tag: 'Islamic + Science', color: 'var(--green-bright)' },
            { icon: '📿', title: 'Dhikr Beads (Misbaha)', desc: 'Repetitive tactile stimulation of running beads through fingers regulates the nervous system. A beautiful form of halal stimming.', tag: 'Stimming-Safe', color: 'var(--gold-mid)' },
            { icon: '🌿', title: 'Progressive Muscle Relaxation', desc: 'Tense and release each muscle group from toes to head. Releases stored anxiety and physical tension accumulated throughout the day.', tag: 'Body-Based', color: 'var(--green-light)' },
            { icon: '🎵', title: 'Healing Tones', desc: 'Use the ambient player (bottom left) — solfeggio frequencies tuned to calm the limbic system. No music, no instruments — pure tones.', tag: 'Auditory', color: 'var(--gold-bright)' },
            { icon: '🌸', title: 'Scent & Aromatherapy', desc: 'Oud, musk, and rose are Sunnah scents. Lavender reduces anxiety by 45% in studies. The olfactory system connects directly to the emotional brain.', tag: 'Olfactory', color: 'var(--green-mid)' },
            { icon: '☀️', title: 'Sunlight Exposure', desc: 'Morning sunlight for 10 minutes after Fajr regulates circadian rhythm and boosts serotonin. This is sunnah-aligned — the Prophet ﷺ loved the morning.', tag: 'Light Therapy', color: 'var(--gold-mid)' },
          ].map((card, i) => (
            <div key={i} className="card" style={{ display: 'flex', gap: 14 }}>
              <div style={{ width: 50, height: 50, borderRadius: 'var(--radius-md)', background: `${card.color}10`, border: `1px solid ${card.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{card.icon}</div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5, flexWrap: 'wrap' }}>
                  <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 500, color: 'var(--text-primary)' }}>{card.title}</h3>
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 100, background: `${card.color}10`, color: card.color, border: `1px solid ${card.color}25` }}>{card.tag}</span>
                </div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', lineHeight: 1.6 }}>{card.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}