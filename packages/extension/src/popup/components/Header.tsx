import { styled } from 'goober';
import { useData } from '../hooks/useData';
import LogoSvg from '../assets/Logo.svg';
import SettingsIconSvg from '../assets/SettingsIcon.svg';
import { Button } from './Button';

const HeaderContainer = styled('header')({
  display: 'grid',
  gridTemplateColumns: '1fr auto auto',
  gap: '0.5rem',
  padding: '0.5rem',
  alignItems: 'center',
});

const ClientInfo = styled('p')({
  fontSize: '1.5rem',
});

const logoSize = '2.5rem';

const Logo = styled(LogoSvg)({
  width: logoSize,
  height: logoSize,
});

const SettingsButton = styled(Button)({
  width: '1.8rem',
  height: '1.8rem',
  padding: '0.2rem',
});

export const Header = (props: { onSettingsClick: () => void }) => {
  const { clientId } = useData();

  return (
    <HeaderContainer>
      <Logo />
      <ClientInfo>{clientId ?? 'Loading...'}</ClientInfo>
      <SettingsButton onClick={props.onSettingsClick}>
        <SettingsIconSvg />
      </SettingsButton>
    </HeaderContainer>
  );
};
