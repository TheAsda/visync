import { useData } from '../hooks/useData';
import LogoSvg from '../assets/Logo.svg';
import SettingsIconSvg from '../assets/SettingsIcon.svg';
import { Button } from './Button';
import './Header.css';

export const Header = (props: { onSettingsClick: () => void }) => {
  const { clientId } = useData();

  return (
    <header className="header">
      <LogoSvg className="header__logo" />
      <p className="header__client-id">{clientId ?? 'Loading...'}</p>
      <Button
        className="header__settings-button"
        onClick={props.onSettingsClick}
      >
        <SettingsIconSvg />
      </Button>
    </header>
  );
};
