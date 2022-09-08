import { bind } from '@react-rxjs/core';
import { map } from 'rxjs';
import { clientId$ } from '../../messageStreams/clientId';
import LogoSvg from '../assets/Logo.svg';
import { getStatusOnSubscribe } from '../lib/getOnSubscribe';
import './Header.css';

const [useClientId] = bind(
  clientId$.pipe(
    getStatusOnSubscribe,
    map(({ message }) => message)
  )
);

export const Header = () => {
  const clientId = useClientId();

  return (
    <header className="header">
      <LogoSvg className="header__logo" />
      <p className="header__client-id">{clientId}</p>
    </header>
  );
};
