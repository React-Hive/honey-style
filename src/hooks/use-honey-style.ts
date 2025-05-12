import { useContext } from 'react';

import { assert } from '../utils';
import { HoneyStyleContext } from '../contexts';

export const useHoneyStyle = () => {
  const context = useContext(HoneyStyleContext);
  assert(
    context,
    'The `useHoneyStyle()` hook must be used inside <HoneyStyleProvider/> component!',
  );

  return context;
};
