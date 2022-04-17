import { styled } from 'goober';
import { Logo } from '../../common/Logo';

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

export interface HeaderProps {
  clientId: string;
}

export const Header = (props: HeaderProps) => {
  const { clientId } = props;

  return (
    <HeaderContainer>
      <LogoContainer>
        <Logo variant="default" shape="triangle" />
      </LogoContainer>
      <ClientInfo>{clientId}</ClientInfo>
    </HeaderContainer>
  );
};
