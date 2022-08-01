import { useQuery } from '@tanstack/react-query';
import LogoSvg from '../assets/Logo.svg';
import SettingsIconSvg from '../assets/SettingsIcon.svg';
import { queryKeys } from '../lib/queryKeys';
import { getStatus } from '../lib/runtime/getStatus';
import { Button } from './Button';
import './Header.css';

export const Header = (props: { onSettingsClick: () => void }) => {
  const { data, isLoading } = useQuery(queryKeys.status, getStatus);

  return (
    <header className="header">
      <LogoSvg className="header__logo" />
      <p className="header__client-id">
        {isLoading ? 'Loading...' : data?.clientId}
      </p>
      <Button
        className="header__settings-button"
        onClick={props.onSettingsClick}
      >
        <SettingsIconSvg />
      </Button>
    </header>
  );
};
