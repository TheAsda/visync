import { styled } from 'goober';
import { useData } from '../hooks/useData';
import LogoSvg from '../assets/Logo.svg';

const HeaderContainer = styled('header')({
  display: 'flex',
  justifyContent: 'space-between',
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

export const Header = () => {
  const { clientId } = useData();

  return (
    <HeaderContainer>
      <Logo />
      <ClientInfo>{clientId ?? 'Loading...'}</ClientInfo>
    </HeaderContainer>
  );
};
