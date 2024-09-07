import { ComponentPropsWithoutRef } from 'react';
import clsx from 'clsx';
import './ErrorMessage.css';

export const ErrorMessage = (props: ComponentPropsWithoutRef<'p'>) => {
  if (!props.children) {
    return null;
  }
  return <p {...props} className={clsx(props.className, 'error-message')} />;
};
