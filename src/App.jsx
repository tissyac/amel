import { useState } from 'react';
import IntroScreen from './components/IntroScreen.jsx';
import MatrixCelebration from './components/MatrixCelebration.jsx';
import RomanticCard from './components/RomanticCard.jsx';

export default function App() {
  const [chapter, setChapter] = useState('welcome');

  return (
    <main className="app-shell">
      {chapter === 'welcome' && <IntroScreen onOpen={() => setChapter('matrix')} />}
      {chapter === 'matrix' && <MatrixCelebration onCandlesBlown={() => setChapter('memories')} />}
      {chapter === 'memories' && <RomanticCard />}
    </main>
  );
}
