import useSwr from 'swr';
import LogoSvg from '../assets/Logo.svg';
import { getClientId } from '../commands/clientId';
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
