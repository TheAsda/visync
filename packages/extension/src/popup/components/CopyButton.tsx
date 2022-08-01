import { ComponentPropsWithoutRef, useEffect, useRef, useState } from 'react';
import { Button } from './Button';
import CopyIcon from '../assets/CopyIcon.svg';
import CheckIcon from '../assets/CheckIcon.svg';
import clsx from 'clsx';

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
