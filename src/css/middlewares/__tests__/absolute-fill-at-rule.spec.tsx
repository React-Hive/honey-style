import React, { ReactElement } from 'react';
import { render } from '@testing-library/react';

import { HoneyStyleProvider } from '../../../providers';
import { themeMock } from '../../../__mocks__';
import { styled } from '../../../styled';

const customRender = (element: ReactElement) =>
  render(<HoneyStyleProvider theme={themeMock}>{element}</HoneyStyleProvider>);

describe('@honey-absolute-fill CSS at-rule', () => {
  it('should convert @honey-absolute-fill block to absolute positioning with full inset', () => {
    const Box = styled('div')`
      @honey-absolute-fill {
        //
      }
    `;

    const { getByTestId } = customRender(<Box data-testid="absolute-fill" />);

    expect(getByTestId('absolute-fill')).toHaveStyle({
      position: 'absolute',
      inset: '0px',
    });
  });
});
