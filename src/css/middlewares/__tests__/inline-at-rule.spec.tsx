import React, { ReactElement } from 'react';
import { render } from '@testing-library/react';

import { HoneyStyleProvider } from '../../../providers';
import { themeMock } from '../../../__mocks__';
import { styled } from '../../../styled';

const customRender = (element: ReactElement) =>
  render(<HoneyStyleProvider theme={themeMock}>{element}</HoneyStyleProvider>);

describe('@honey-inline CSS at-rule', () => {
  it('should convert @honey-inline block to flex container with center alignment', () => {
    const Box = styled('div')`
      @honey-inline {
        //
      }
    `;

    const { getByTestId } = customRender(<Box data-testid="inline" />);

    expect(getByTestId('inline')).toHaveStyle({
      display: 'flex',
      alignItems: 'center',
    });
  });

  it('should convert @honey-inline directive with numeric gap to flex container with calculated spacing', () => {
    const Box = styled('div')`
      @honey-inline (3) {
        //
      }
    `;

    const { getByTestId } = customRender(<Box data-testid="inline" />);

    expect(getByTestId('inline')).toHaveStyle({
      display: 'flex',
      alignItems: 'center',
      gap: '24px',
    });
  });
});
