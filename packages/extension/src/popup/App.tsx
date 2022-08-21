import { Subscribe } from '@react-rxjs/core';
import { useEffect } from 'react';
import { sendCommand } from '../messageStreams/command';
import './App.css';
import { Content } from './components/Content';
import { Header } from './components/Header';
import { Loader } from './components/Loader';

export const App = () => {
  return (
    <div className="app">
      <Subscribe fallback={<Loader />}>
        <Header />
        <main>
          <Content />
        </main>
      </Subscribe>
    </div>
  );
};
