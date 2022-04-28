import { useState } from 'react';
import { Container } from './components/Container';
import { Content } from './components/Content';
import { Header } from './components/Header';
import { Settings } from './components/Settings';

export const App = () => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <Container>
      <Header onSettingsClick={() => setShowSettings((s) => !s)} />
      {showSettings ? <Settings /> : <Content />}
    </Container>
  );
};
