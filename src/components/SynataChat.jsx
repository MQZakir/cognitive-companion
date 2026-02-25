import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';

const RESPONSES = {
  greeting: [
    "Assalamu alaykum 🌙 I'm Synata, your companion on this journey. How are you feeling today, dear?",
    "Wa alaykum assalam ✦ Welcome. Allah has blessed you with another day. What's on your heart?",
    "Bismillah 🤲 I'm here with you. Tell me how you're doing — there's no judgment here, only care.",
  ],
  anxiety: [
    "I hear you. When anxiety comes, remember: 'Verily, with hardship comes ease' (94:5). Let's breathe together — in for 4 counts... hold... out for 6. Allah is with you. 🌿",
    "Your heart is racing and that's okay. Try this dua: أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ — and then take three slow breaths. You are safe. ✦",
  ],
  sad: [
    "It's okay to feel sad, dear. Even the Prophets felt grief. Allah says He is with the patient (2:153). You don't carry this alone — I'm here, and so is He. 💚",
    "Your tears are seen by Allah. Cry if you need to. Then when you're ready, let's make a small dua together. 🤲",
  ],
  adhd: [
    "Your mind is a beautiful, powerful thing — it just works differently. Let's break this into one tiny step. Just one. What is the very smallest thing we can do right now? ⚡",
    "ADHD brains are creative and energetic mashAllah. Let's use that. Set a 5-minute timer and pick ONE thing. I'll be here when it goes off. 🌿",
  ],
  quran: [
    "What a beautiful thing to seek 📖 Here's one that may comfort you: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا' — With every hardship comes ease. SubhanAllah.",
    "Allah's words are healing. 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ' — In the remembrance of Allah, hearts find rest (13:28). 🌙",
  ],
  prayer: [
    "Salah is the anchor of the day 🧎 If you missed one, don't be hard on yourself — make it up with sincerity. Would you like a gentle reminder for the next one?",
    "MashaAllah for praying 🌙 Each salah is a conversation with Allah. How did it feel today?",
  ],
  physical: [
    "Your disability does not diminish your worth — not in my eyes, and certainly not in Allah's. He created you perfectly as you are. How can I help you today? 🤲",
    "Islam honors every form of patient — the Prophet ﷺ said the one who is afflicted with illness and bears it patiently, Allah expiates their sins. You are seen. 💚",
  ],
  deaf: [
    "I'll make sure everything I share has visual representation for you 💬 You can type anything to me — I'm fully here through text.",
    "Your experience matters deeply here. I'll always provide written responses and visual indicators. What would you like support with today? ✦",
  ],
  blind: [
    "I'm here and I'll guide you through voice and clear descriptions 🔊 Please enable Text-to-Speech in the toolbar above so I can read everything to you.",
    "SubhanAllah — your other senses are heightened gifts from Allah. I'll describe everything clearly. What do you need right now? 🤲",
  ],
  general: [
    "I'm listening with my whole heart 🌙 Tell me more — every word matters.",
    "JazakAllah khair for sharing that with me. How does it feel to say it out loud? 🌿",
    "You're showing real courage by opening up. What would feel most helpful right now? ✦",
    "I'm here with you through this. One moment at a time, one breath at a time. 🤲",
    "SubhanAllah, you've come so far. What would you like to focus on today? 💚",
  ],
};

function detectIntent(text) {
  const t = text.toLowerCase();
  if (t.match(/anxious|panic|worry|scared|fear|nervous|stress/)) return 'anxiety';
  if (t.match(/sad|cry|hurt|lonely|depress|hopeless|empty/)) return 'sad';
  if (t.match(/focus|distract|scatter|adhd|forget|task/)) return 'adhd';
  if (t.match(/quran|verse|ayah|surah|allah|islam/)) return 'quran';
  if (t.match(/pray|salah|namaz|fajr|dhuhr|asr|maghrib|isha/)) return 'prayer';
  if (t.match(/deaf|hear|sound|audio|caption/)) return 'deaf';
  if (t.match(/blind|see|vision|visual|screen reader/)) return 'blind';
  if (t.match(/disability|wheelchair|physical|pain|mobility/)) return 'physical';
  return 'general';
}

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

export function SynataFAB() {
  const { chatOpen, setChatOpen, speak } = useApp();
  return (
    <div className="synata-fab">
      <button
        className="synata-fab-btn"
        onClick={() => { setChatOpen(!chatOpen); speak(chatOpen ? 'Closing Synata chat' : 'Opening Synata chat'); }}
        aria-label={chatOpen ? 'Close Synata companion chat' : 'Open Synata companion chat'}
        aria-expanded={chatOpen}
      >
        {chatOpen ? '✕' : '☽'}
      </button>
    </div>
  );
}

export default function SynataChat({ embedded = false }) {
  const { user, accessibility, speak } = useApp();
  const [messages, setMessages] = useState([
    { id: 1, role: 'synata', text: pick(RESPONSES.greeting), time: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [listening, setListening] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);

  const send = async (text) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', text, time: new Date() }]);
    setInput('');
    setIsTyping(true);
    await new Promise(r => setTimeout(r, 1000 + Math.random() * 700));
    const intent = detectIntent(text);
    const pool = RESPONSES[intent] || RESPONSES[user.disability] || RESPONSES.general;
    const reply = pick(pool);
    setIsTyping(false);
    setMessages(prev => [...prev, { id: Date.now() + 1, role: 'synata', text: reply, time: new Date() }]);
    speak(reply);
  };

  const startVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert('Voice input requires Chrome browser.'); return; }
    const r = new SR();
    r.lang = 'en-US';
    r.onresult = e => { setInput(e.results[0][0].transcript); setListening(false); };
    r.onerror = () => setListening(false);
    r.onend = () => setListening(false);
    r.start();
    setListening(true);
    speak('Listening...');
  };

  const containerStyle = embedded
    ? { display: 'flex', flexDirection: 'column', height: '100%' }
    : {
        position: 'fixed',
        bottom: 108, right: 32,
        width: 400, height: 560,
        display: 'flex', flexDirection: 'column',
        background: 'rgba(8,15,10,0.98)',
        border: '1px solid rgba(201,168,76,0.2)',
        borderRadius: 24,
        backdropFilter: 'blur(30px)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        zIndex: 499,
        animation: 'fadeInUp 0.3s ease',
        overflow: 'hidden',
      };

  return (
    <div style={containerStyle} role="region" aria-label="Synata AI Companion Chat">
      {/* Header */}
      <div style={{
        padding: '18px 22px',
        background: 'linear-gradient(135deg, rgba(45,106,79,0.2), rgba(201,168,76,0.06))',
        borderBottom: '1px solid rgba(201,168,76,0.12)',
        display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0,
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, var(--green-mid), var(--green-deep))',
          border: '2px solid rgba(201,168,76,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20, color: 'var(--gold-bright)',
          animation: 'breathe 4s ease-in-out infinite',
        }} aria-hidden="true">☽</div>
        <div>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 500, color: 'var(--text-primary)' }}>
            Synata
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green-light)', animation: 'breathe 2s ease-in-out infinite' }} aria-hidden="true" />
            <span style={{ fontSize: 11, color: 'var(--green-light)' }}>
              {isTyping ? 'Composing with care...' : 'Always here for you'}
            </span>
          </div>
        </div>
        {/* Visual indicator for deaf users */}
        {accessibility.captionsMode && isTyping && (
          <div style={{ marginLeft: 'auto', padding: '4px 10px', borderRadius: 8, background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)' }}>
            <p style={{ fontSize: 10, color: 'var(--gold-bright)' }}>✎ Typing...</p>
          </div>
        )}
      </div>

      {/* Messages */}
      <div
        style={{ flex: 1, overflowY: 'auto', padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        {messages.map(msg => (
          <div
            key={msg.id}
            style={{ display: 'flex', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', gap: 10, alignItems: 'flex-end' }}
          >
            {msg.role === 'synata' && (
              <div style={{
                width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg, var(--green-mid), var(--green-deep))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, color: 'var(--gold-bright)',
              }} aria-hidden="true">☽</div>
            )}
            <div
              style={{
                maxWidth: '76%',
                padding: '11px 15px',
                borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                background: msg.role === 'user'
                  ? 'linear-gradient(135deg, rgba(45,106,79,0.3), rgba(27,67,50,0.3))'
                  : 'rgba(13,31,19,0.9)',
                border: `1px solid ${msg.role === 'user' ? 'rgba(64,145,108,0.3)' : 'rgba(201,168,76,0.1)'}`,
                fontSize: 'var(--text-sm)', lineHeight: 1.65, color: 'var(--text-primary)',
              }}
              onMouseEnter={() => speak(msg.text)}
              tabIndex={0}
              aria-label={`${msg.role === 'synata' ? 'Synata' : 'You'}: ${msg.text}`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg, var(--green-mid), var(--green-deep))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: 'var(--gold-bright)', flexShrink: 0 }} aria-hidden="true">☽</div>
            <div style={{ padding: '12px 16px', borderRadius: '16px 16px 16px 4px', background: 'rgba(13,31,19,0.9)', border: '1px solid rgba(201,168,76,0.1)', display: 'flex', gap: 5, alignItems: 'center' }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green-light)', animation: `breathe 1.2s ease-in-out ${i * 0.2}s infinite` }} aria-hidden="true" />
              ))}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '14px 16px', borderTop: '1px solid rgba(201,168,76,0.1)', display: 'flex', gap: 8, background: 'rgba(8,15,10,0.9)', flexShrink: 0 }}>
        <button
          onClick={startVoice}
          className="btn btn-icon btn-ghost"
          style={{
            background: listening ? 'rgba(201,168,76,0.15)' : 'transparent',
            border: `1px solid ${listening ? 'rgba(201,168,76,0.4)' : 'rgba(64,145,108,0.25)'}`,
            color: listening ? 'var(--gold-bright)' : 'var(--text-muted)',
            animation: listening ? 'breathe 1s ease-in-out infinite' : 'none',
          }}
          aria-label={listening ? 'Listening for voice input' : 'Start voice input'}
          aria-pressed={listening}
        >
          🎤
        </button>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send(input)}
          placeholder={listening ? 'Listening...' : 'Type or speak to Synata...'}
          className="input"
          style={{ flex: 1, minHeight: 44 }}
          aria-label="Message input"
        />
        <button
          onClick={() => send(input)}
          disabled={!input.trim()}
          className="btn btn-primary btn-icon"
          style={{ opacity: input.trim() ? 1 : 0.4 }}
          aria-label="Send message"
        >
          ↑
        </button>
      </div>
    </div>
  );
}