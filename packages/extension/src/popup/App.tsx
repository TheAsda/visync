import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import './App.css';
import { Content } from './components/Content';
import { Header } from './components/Header';
import { Settings } from './components/Settings';
import { queryKeys } from './lib/queryKeys';
import { subscribe } from './lib/runtime/subscribe';

export const App = () => {
  const queryClient = useQueryClient();
  useEffect(() => {
    const unsubscribe = subscribe((response) => {
      if (response.type === 'status') {
        queryClient.setQueryData(queryKeys.status, response.payload);
      }
    });
    return unsubscribe;
  }, []);

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
