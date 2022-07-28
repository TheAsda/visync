import { useState } from 'react';
import { Container } from './components/Container';
import { Content } from './components/Content';
import { Header } from './components/Header';
import { Settings } from './components/Settings';

export const App = () => {
  const [showSettings, setShowSettings] = useState(false);

  const toggleSettings = () => {
    setShowSettings((s) => !s);
  };

  return (
    <Container>
      <Header onSettingsClick={toggleSettings} />
      {showSettings ? <Settings /> : <Content />}
    </Container>
  );
};
