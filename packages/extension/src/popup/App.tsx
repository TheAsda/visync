import { useState } from 'react';
import './App.css';
import { Content } from './components/Content';
import { Header } from './components/Header';
import { Settings } from './components/Settings';

export const App = () => {
  const [showSettings, setShowSettings] = useState(false);

  const toggleSettings = () => {
    setShowSettings((s) => !s);
  };

  return (
    <main className="app">
      <Header onSettingsClick={toggleSettings} />
      {showSettings ? <Settings /> : <Content />}
    </main>
  );
};
