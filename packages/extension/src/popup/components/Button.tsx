import { ComponentPropsWithoutRef } from 'react';
import { clsx } from 'clsx';
import './Button.css';

export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  isLoading?: boolean;
}

export const Button = (props: ButtonProps) => {
  const {
    isLoading = false,
    className,
    disabled = false,
    children,
    ...buttonProps
  } = props;
  return (
    <button
      {...buttonProps}
      aria-busy={isLoading}
      disabled={isLoading || disabled}
      className={clsx(className, 'button', 'focusable')}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  );
};
