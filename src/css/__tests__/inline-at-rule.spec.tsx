import React, { ReactElement } from 'react';
import { render } from '@testing-library/react';

import { HoneyStyleProvider } from '../../providers';
import { themeMock } from '../../__mocks__';
import { styled } from '../../styled';

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

  it('should work with semicolon syntax', () => {
    const Box = styled('div')`
      @honey-inline;
    `;

    const { getByTestId } = customRender(<Box data-testid="inline" />);

    expect(getByTestId('inline')).toHaveStyle({
      display: 'flex',
      alignItems: 'center',
    });
  });

  it('should convert numeric gap param using theme spacing multiplier', () => {
    const Box = styled('div')`
      @honey-inline (3);
    `;

    const { getByTestId } = customRender(<Box data-testid="inline" />);

    expect(getByTestId('inline')).toHaveStyle({
      display: 'flex',
      alignItems: 'center',
      gap: '24px', // 3 * base(8)
    });
  });

  it('should preserve explicit unit gap param without modification', () => {
    const Box = styled('div')`
      @honey-inline (12px);
    `;

    const { getByTestId } = customRender(<Box data-testid="inline" />);

    expect(getByTestId('inline')).toHaveStyle({
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    });
  });

  it('should preserve additional declarations inside block', () => {
    const Box = styled('div')`
      @honey-inline {
        justify-content: space-between;
      }
    `;

    const { getByTestId } = customRender(<Box data-testid="inline" />);

    expect(getByTestId('inline')).toHaveStyle({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    });
  });

  it('should work correctly when nested inside another rule', () => {
    const Box = styled('div')`
      .child {
        @honey-inline (2) {
          padding: ${1};
        }
      }
    `;

    const { getByTestId } = customRender(
      <Box data-testid="parent">
        <div className="child" data-testid="child" />
      </Box>,
    );

    expect(getByTestId('child')).toHaveStyle({
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      padding: '8px',
    });
  });
});
