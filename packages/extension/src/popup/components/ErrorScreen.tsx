import './ErrorScreen.css';

export interface ErrorScreenProps {
  message: string;
}

export const ErrorScreen = (props: ErrorScreenProps) => {
  const { message } = props;
  if ((message as any) instanceof Error) {
    console.error(message);
  }
  return (
    <div className="error-screen">
      <h1 className="error-screen__error">Error</h1>
      <p className="error-screen__text">{message}</p>
    </div>
  );
};
