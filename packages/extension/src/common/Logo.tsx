import { ReactNode } from 'react';
import { LogoBase } from './LogoBase';
import { theme } from './theme';

export interface LogoProps {
  variant?: 'default' | 'start' | 'stop';
  shape?: 'none' | 'triangle' | 'square';
}

export const Logo = (props: LogoProps) => {
  const { variant = 'default', shape = 'none' } = props;

  let color = theme.colors.primary;
  switch (variant) {
    case 'start':
      color = theme.colors.green;
      break;
    case 'stop':
      color = theme.colors.red;
      break;
  }

  let children: ReactNode = null;
  switch (props.shape) {
    case 'triangle':
      children = (
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M70.689 47.261 41.742 65.907V28.615l28.947 18.646Z"
          fill="#fff"
        />
      );
      break;
    case 'square':
      children = <path fill="#fff" d="M39 32h30v30H39z" />;
      break;
  }

  return <LogoBase color={color}>{children}</LogoBase>;
};
