import clsx from 'clsx';
import { ComponentPropsWithoutRef } from 'react';
import './Input.css';

export const Input = (props: ComponentPropsWithoutRef<'input'>) => {
  return (
    <input {...props} className={clsx(props.className, 'input', 'focusable')} />
  );
};
