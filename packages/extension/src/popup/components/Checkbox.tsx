import { ComponentPropsWithoutRef } from 'react';

export const Checkbox = (props: ComponentPropsWithoutRef<'input'>) => {
  return <input type="checkbox" {...props} />;
};
