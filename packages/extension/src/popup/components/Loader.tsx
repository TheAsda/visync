import LogoLoader from '../assets/LogoLoader.svg';
import './Loader.css';

export interface LoaderProps {
  loadingText?: string;
}

export const Loader = (props: LoaderProps) => {
  const { loadingText = 'Loading..' } = props;

  return (
    <div className="loader">
      <div className="loader__container">
        <LogoLoader className="loader__spinner" />
        <p className="loader__text">{loadingText}</p>
      </div>
    </div>
  );
};
