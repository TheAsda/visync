import { bind } from '@react-rxjs/core';
import { map } from 'rxjs';
import useSwr from 'swr';
import { getClientId } from '../../messageStreams/clientId';
import { sendCommand } from '../../messageStreams/command';
import LogoSvg from '../assets/Logo.svg';
import { callOnSubscribe } from '../lib/callOnSubscribe';
import './Header.css';

export const Header = () => {
  const { data: clientId } = useSwr('client-id', () => getClientId(), {
    suspense: true,
  });

  return (
    <header className="header">
      <LogoSvg className="header__logo" />
      <p className="header__client-id">{clientId}</p>
    </header>
  );
};
