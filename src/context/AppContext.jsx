import React, { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext();

export const disabilities = [
  { id: 'adhd',       label: 'ADHD',              emoji: '⚡', color: '#e8c96d' },
  { id: 'autism',     label: 'Autism Spectrum',    emoji: '🌊', color: '#74c69d' },
  { id: 'anxiety',    label: 'Anxiety',            emoji: '🌙', color: '#a8d5ba' },
  { id: 'depression', label: 'Depression',         emoji: '🌿', color: '#40916c' },
  { id: 'ptsd',       label: 'PTSD',               emoji: '🌺', color: '#c9a84c' },
  { id: 'ocd',        label: 'OCD',                emoji: '♾️', color: '#74c69d' },
  { id: 'blind',      label: 'Visual Impairment',  emoji: '👁️', color: '#e8c96d' },
  { id: 'deaf',       label: 'Deaf / Hard of Hearing', emoji: '👂', color: '#40916c' },
  { id: 'physical',   label: 'Physical Disability', emoji: '♿', color: '#c9a84c' },
  { id: 'mute',       label: 'Non-verbal / Mute',  emoji: '🤲', color: '#74c69d' },
];

export const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

export const prayerTimes = {
  Fajr: '05:23', Dhuhr: '12:30', Asr: '15:45', Maghrib: '18:12', Isha: '19:40'
};

export const quranVerses = [
  {
    arabic:      'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
    translation: 'Verily, in the remembrance of Allah do hearts find rest.',
    reference:   'Surah Ar-Ra\'d 13:28',
    theme:       'peace',
  },
  {
    arabic:      'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ۝ إِنَّ مَعَ الْعُسْرِ يُسْرًا',
    translation: 'For indeed, with hardship will be ease. Indeed, with hardship will be ease.',
    reference:   'Surah Ash-Sharh 94:5-6',
    theme:       'hope',
  },
  {
    arabic:      'وَلَا تَيْأَسُوا مِن رَّوْحِ اللَّهِ',
    translation: 'And do not despair of relief from Allah.',
    reference:   'Surah Yusuf 12:87',
    theme:       'hope',
  },
  {
    arabic:      'وَاللَّهُ مَعَ الصَّابِرِينَ',
    translation: 'And Allah is with the patient.',
    reference:   'Surah Al-Baqarah 2:153',
    theme:       'sabr',
  },
  {
    arabic:      'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
    translation: 'Allah is sufficient for us, and He is the best disposer of affairs.',
    reference:   'Surah Al-Imran 3:173',
    theme:       'tawakkul',
  },
  {
    arabic:      'وَلَنَبْلُوَنَّكُم بِشَيْءٍ مِّنَ الْخَوْفِ وَالْجُوعِ وَنَقْصٍ مِّنَ الْأَمْوَالِ وَالْأَنفُسِ وَالثَّمَرَاتِ ۗ وَبَشِّرِ الصَّابِرِينَ',
    translation: 'And We will surely test you with something of fear and hunger and a loss of wealth and lives and fruits, but give good tidings to the patient.',
    reference:   'Surah Al-Baqarah 2:155',
    theme:       'sabr',
  },
  {
    arabic:      'رَبَّنَا لَا تُؤَاخِذْنَا إِن نَّسِينَا أَوْ أَخْطَأْنَا',
    translation: 'Our Lord, do not impose blame upon us if we forget or make an error.',
    reference:   'Surah Al-Baqarah 2:286',
    theme:       'dua',
  },
  {
    arabic:      'وَإِذَا مَرِضْتُ فَهُوَ يَشْفِينِ',
    translation: 'And when I am ill, it is He who cures me.',
    reference:   'Surah Ash-Shu\'ara 26:80',
    theme:       'healing',
  },
];

export const dhikrList = [
  { arabic: 'سُبْحَانَ اللَّهِ',          transliteration: 'Subhan Allah',          translation: 'Glory be to Allah',              recommended: 33 },
  { arabic: 'الْحَمْدُ لِلَّهِ',          transliteration: 'Alhamdulillah',         translation: 'All praise is due to Allah',      recommended: 33 },
  { arabic: 'اللَّهُ أَكْبَرُ',            transliteration: 'Allahu Akbar',          translation: 'Allah is the Greatest',           recommended: 34 },
  { arabic: 'لَا إِلَهَ إِلَّا اللَّهُ',  transliteration: 'La ilaha illallah',     translation: 'There is no god but Allah',       recommended: 100 },
  { arabic: 'أَسْتَغْفِرُ اللَّهَ',       transliteration: 'Astaghfirullah',        translation: 'I seek forgiveness from Allah',   recommended: 100 },
  { arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', transliteration: 'La hawla wa la quwwata illa billah', translation: 'There is no power except with Allah', recommended: 10 },
];

export const duas = [
  { title: 'For Anxiety & Worry', arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ', translation: 'O Allah, I seek refuge in You from grief and sadness.', when: 'When feeling anxious or overwhelmed' },
  { title: 'For Healing', arabic: 'اللَّهُمَّ رَبَّ النَّاسِ أَذْهِبِ الْبَأْسَ اشْفِ أَنْتَ الشَّافِي', translation: 'O Allah, Lord of mankind, remove the harm and heal. You are the Healer.', when: 'During illness or pain' },
  { title: 'For Strength', arabic: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي', translation: 'My Lord, expand my chest and ease my task for me.', when: 'Before a difficult task' },
  { title: 'For Sleep', arabic: 'اللَّهُمَّ بِاسْمِكَ أَمُوتُ وَأَحْيَا', translation: 'O Allah, in Your name I die and I live.', when: 'Before sleeping' },
  { title: 'Upon Waking', arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ', translation: 'Praise be to Allah who gave us life after death, and to Him is the resurrection.', when: 'Upon waking' },
];

export function AppProvider({ children }) {
  const [user, setUser] = useState({
    name: 'Friend',
    disability: 'adhd',
    mood: 'calm',
    streak: 7,
    prayerStreak: 5,
  });

  const [accessibility, setAccessibility] = useState({
    largeText:      false,
    highContrast:   false,
    reducedMotion:  false,
    screenReader:   false,
    tts:            false,        // text-to-speech
    signLanguage:   false,
    captionsMode:   false,        // visual cues for deaf users
    voiceNav:       false,
  });

  const [chatOpen, setChatOpen]     = useState(false);
  const [currentMood, setCurrentMood] = useState('calm');
  const [prayerLog, setPrayerLog]   = useState({ Fajr: true, Dhuhr: true, Asr: false, Maghrib: false, Isha: false });

  const [moodHistory] = useState([
    { day: 'Sat', score: 60, prayer: 3 },
    { day: 'Sun', score: 75, prayer: 4 },
    { day: 'Mon', score: 55, prayer: 3 },
    { day: 'Tue', score: 80, prayer: 5 },
    { day: 'Wed', score: 65, prayer: 4 },
    { day: 'Thu', score: 70, prayer: 4 },
    { day: 'Fri', score: 90, prayer: 5 },
  ]);

  const updateMood = (mood) => setCurrentMood(mood);

  const togglePrayer = (prayer) => {
    setPrayerLog(prev => ({ ...prev, [prayer]: !prev[prayer] }));
  };

  const speak = useCallback((text) => {
    if (!accessibility.tts) return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utt = new SpeechSynthesisUtterance(text);
      utt.rate = 0.9;
      utt.pitch = 1;
      window.speechSynthesis.speak(utt);
    }
  }, [accessibility.tts]);

  const updateAccessibility = (key, value) => {
    setAccessibility(prev => {
      const next = { ...prev, [key]: value };
      // Apply body classes
      document.body.classList.toggle('large-text',      next.largeText);
      document.body.classList.toggle('high-contrast',   next.highContrast);
      document.body.classList.toggle('reduced-motion',  next.reducedMotion);
      return next;
    });
  };

  return (
    <AppContext.Provider value={{
      user, setUser,
      accessibility, updateAccessibility,
      chatOpen, setChatOpen,
      currentMood, updateMood,
      moodHistory,
      prayerLog, togglePrayer,
      disabilities, prayers, prayerTimes,
      quranVerses, dhikrList, duas,
      speak,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);