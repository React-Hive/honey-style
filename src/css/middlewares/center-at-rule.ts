import { createAtRuleMiddleware } from './factory';

export const createCenterAtRuleMiddleware = () =>
  createAtRuleMiddleware({
    name: 'center',
    transform: () => 'display:flex;align-items:center;justify-content:center;',
  });
