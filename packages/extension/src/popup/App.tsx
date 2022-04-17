import { Container } from './components/Container';
import { Content } from './components/Content';
import { Header } from './components/Header';
import { Loader } from './components/Loader';
import { GlobalStyles } from './globalStyles';
import { useClient } from './hooks/useClient';

export const App = () => {
  const { clientId, isLoading } = useClient();

  return (
    <Container>
      <GlobalStyles />
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Header clientId={clientId} />
          <Content />
        </>
      )}
    </Container>
  );
};
