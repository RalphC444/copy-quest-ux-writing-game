import { useEffect, useState } from 'react';
import { api } from './lib/api.js';
import { audio } from './audio/chiptune.js';
import { loadProgress, loadPlayer } from './lib/progress.js';
import RankBadge from './components/RankBadge.jsx';
import TitleScreen from './components/TitleScreen.jsx';
import LevelSelect from './components/LevelSelect.jsx';
import Briefing from './components/Briefing.jsx';
import LevelMap from './components/LevelMap.jsx';
import Countdown from './components/Countdown.jsx';
import ScreenPlay from './components/ScreenPlay.jsx';
import ScreenResult from './components/ScreenResult.jsx';

// Flow: title → select (worlds A–H) → briefing → map (levels A-1, A-2, A-3) → countdown → play → result
export default function App() {
  const [phase, setPhase] = useState('title');
  const [levels, setLevels] = useState([]);
  const [level, setLevel] = useState(null);
  const [difficulty, setDifficulty] = useState('normal');
  const [screenIdx, setScreenIdx] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timing, setTiming] = useState({});
  const [progress, setProgress] = useState(loadProgress);
  const [player, setPlayer] = useState(loadPlayer);
  const [muted, setMuted] = useState(false);
  const [aiOn, setAiOn] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.levels().then(setLevels).catch(() => setError('Cannot reach the game server. Start it with "npm run dev" from the project folder.'));
    api.health().then((h) => setAiOn(Boolean(h.ai))).catch(() => {});
  }, []);

  useEffect(() => { audio.setMuted(muted); }, [muted]);

  const pickWorld = async (id) => {
    try {
      const full = await api.level(id);
      setLevel(full);
      setPhase('briefing');
    } catch (e) {
      setError(e.message);
    }
  };

  const play = (idx) => {
    setScreenIdx(idx);
    setAttempt((a) => a + 1);
    setPhase('countdown');
  };

  const finishScreen = (screenAnswers, screenTiming) => {
    setAnswers(screenAnswers);
    setTiming(screenTiming);
    setPhase('result');
  };

  const toSelect = () => { audio.stopMusic(); setPhase('select'); };

  return (
    <div className="shell">
      <div className="scanlines" aria-hidden="true" />
      <header className="topbar">
        <button className="wordmark" onClick={toSelect} disabled={phase === 'title'}>
          COPY<span>QUEST</span>
        </button>
        <div className="topbar-right">
          <RankBadge xp={player.xp} />
          <button
            className="mute"
            onClick={() => setMuted((m) => !m)}
            aria-pressed={muted}
            aria-label={muted ? 'Turn sound on' : 'Mute sound'}
          >
            {muted ? 'SOUND OFF' : 'SOUND ON'}
          </button>
        </div>
      </header>

      {error && (
        <div className="error-banner" role="alert">
          {error}
          <button onClick={() => setError('')}>Dismiss</button>
        </div>
      )}

      <main className="stage">
        {phase === 'title' && <TitleScreen onStart={() => { audio.play('go'); setPhase('select'); }} />}

        {phase === 'select' && <LevelSelect levels={levels} progress={progress} onPick={pickWorld} />}

        {phase === 'briefing' && level && (
          <Briefing level={level} onDone={() => setPhase('map')} onBack={toSelect} />
        )}

        {phase === 'map' && level && (
          <LevelMap
            level={level}
            progress={progress}
            difficulty={difficulty}
            onDifficulty={setDifficulty}
            onPlay={play}
            onBriefing={() => setPhase('briefing')}
            onBack={toSelect}
          />
        )}

        {phase === 'countdown' && (
          <Countdown label={`Level ${level.id}-${screenIdx + 1}`} sub={level.rounds[screenIdx].title} onDone={() => setPhase('play')} />
        )}

        {phase === 'play' && (
          <ScreenPlay
            key={`${level.id}-${screenIdx}-${attempt}`}
            level={level}
            screenIdx={screenIdx}
            difficulty={difficulty}
            onSubmit={finishScreen}
          />
        )}

        {phase === 'result' && (
          <ScreenResult
            key={`r-${level.id}-${screenIdx}-${attempt}`}
            level={level}
            screenIdx={screenIdx}
            difficulty={difficulty}
            answers={answers}
            timing={timing}
            aiOn={aiOn}
            onProgress={setProgress}
            onPlayer={setPlayer}
            onNext={() => play(screenIdx + 1)}
            onRetry={() => play(screenIdx)}
            onMap={() => setPhase('map')}
          />
        )}
      </main>
    </div>
  );
}
