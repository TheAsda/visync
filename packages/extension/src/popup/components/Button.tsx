import { ComponentPropsWithoutRef } from 'react';
import { clsx } from 'clsx';
import './Button.css';

export const Button = (props: ComponentPropsWithoutRef<'button'>) => {
  return (
    <button
      {...props}
      className={clsx(props.className, 'button', 'focusable')}
    />
  );
};
