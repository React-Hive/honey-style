import { useContext } from 'react';

import { HoneyStyleContext } from '../contexts';
import { assert } from '../helpers';

export const useHoneyStyle = () => {
  const context = useContext(HoneyStyleContext);
  assert(
    context,
    'The `useHoneyStyle()` hook must be used inside <HoneyStyleProvider/> component!',
  );

  return context;
};
