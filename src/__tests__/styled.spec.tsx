import React from 'react';
import { render } from '@testing-library/react';
import type { ReactElement } from 'react';

import { themeMock } from '../__mocks__';
import { HoneyStyleProvider } from '../providers';
import { styled } from '../styled';

const customRender = (element: ReactElement) =>
  render(<HoneyStyleProvider theme={themeMock}>{element}</HoneyStyleProvider>);

describe('[styled]: basic behavior', () => {
  it('should render styled component with passed children and props', () => {
    const Box = styled('div')``;

    const { getByTestId } = customRender(<Box data-testid="test">content</Box>);

    expect(getByTestId('test')).toHaveTextContent('content');
  });
});
