import { styled } from 'goober';
import { useData } from '../hooks/useData';

const HeaderContainer = styled('header')({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '0.5rem',
  alignItems: 'center',
});

const logoSize = '2.5rem';

const LogoContainer = styled('div')({
  width: logoSize,
  height: logoSize,
  aspectRatio: '1/1',
});

const ClientInfo = styled('p')({
  fontSize: '1.5rem',
});

export const Header = () => {
  const { clientId } = useData();

  return (
    <HeaderContainer>
      <LogoContainer>
        {/* <Logo variant="default" shape="triangle" /> */}
      </LogoContainer>
      <ClientInfo>{clientId ?? 'Loading...'}</ClientInfo>
    </HeaderContainer>
  );
};
