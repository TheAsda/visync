import { ComponentPropsWithoutRef } from 'react';
import clsx from 'clsx';
import './ErrorMessage.css';

export const ErrorMessage = (props: ComponentPropsWithoutRef<'p'>) => {
  return <p {...props} className={clsx(props.className, 'error-message')} />;
};
