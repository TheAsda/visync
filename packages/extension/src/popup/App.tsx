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
    <div className="app">
      <Header onSettingsClick={toggleSettings} />
      <main>{showSettings ? <Settings /> : <Content />}</main>
    </div>
  );
};
