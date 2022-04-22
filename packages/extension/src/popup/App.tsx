import { Container } from './components/Container';
import { Content } from './components/Content';
import { Header } from './components/Header';

export const App = () => {
  return (
    <Container>
      <Header />
      <Content />
    </Container>
  );
};
