import { ComponentPropsWithoutRef } from 'react';
import clsx from 'clsx';
import './Input.css';

export const Input = (props: ComponentPropsWithoutRef<'input'>) => {
  return (
    <input {...props} className={clsx(props.className, 'input', 'focusable')} />
  );
};
