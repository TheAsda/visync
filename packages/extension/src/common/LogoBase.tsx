import { ReactNode } from 'react';
import { theme } from './theme';

export interface LogoBaseProps {
  color?: string;
  children?: ReactNode;
}

export const LogoBase = (props: LogoBaseProps) => {
  const { color = theme.colors.primary, children } = props;

  return (
    <svg
      viewBox="0 0 110 95"
      width="100%"
      height="100%"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M54.37 94.523c26.101 0 47.261-21.16 47.261-47.261C101.631 21.16 80.471 0 54.369 0S7.108 21.16 7.108 47.261c0 26.102 21.16 47.262 47.261 47.262Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M21.878 44.007h11.26l-17.307 17.77-9.448-9.169 5.34-5.346h8.632l1.523-3.255Z"
        fill="#fff"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.4 45.042s-1.146-12.677 8.123-21.78c0 0-6.792 7.189-6.646 21.78H20.4Z"
        fill="#fff"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M.832 45.306 15.7 60.176 30.832 45.04l-30 .265Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M88.153 51.12h-11.26L94.2 33.35l9.447 9.169-5.34 5.346h-8.631l-1.523 3.255Z"
        fill="#fff"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M89.63 50.084s1.147 12.678-8.122 21.781c0 0 6.792-7.189 6.646-21.78h1.477Z"
        fill="#fff"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M109.199 49.821 94.33 34.951 79.2 50.086l30-.265Z"
        fill={color}
      />

      {children}
    </svg>
  );
};
