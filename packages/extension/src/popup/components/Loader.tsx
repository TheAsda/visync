import LogoLoader from '../assets/LogoLoader.svg';
import './Loader.css';

export const Loader = () => {
  return (
    <div className="loader">
      <LogoLoader className="loader__spinner" />
    </div>
  );
};
