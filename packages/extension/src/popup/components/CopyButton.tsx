import { ComponentPropsWithoutRef, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import CheckIcon from '../assets/CheckIcon.svg';
import CopyIcon from '../assets/CopyIcon.svg';
import { Button } from './Button';

export const CopyButton = (
  props: Omit<ComponentPropsWithoutRef<'button'>, 'children'>
) => {
  const [showCheck, setShowCheck] = useState(false);
  const timeoutRef = useRef<number>();

  useEffect(() => {
    if (showCheck) {
      timeoutRef.current = setTimeout(
        () => setShowCheck(false),
        2000
      ) as unknown as number;
    }

    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [showCheck]);

  return (
    <Button
      {...props}
      className={clsx(props.className, 'copy-button')}
      onClick={(e) => {
        props.onClick?.(e);
        setShowCheck(true);
      }}
    >
      {showCheck ? <CheckIcon /> : <CopyIcon />}
    </Button>
  );
};
