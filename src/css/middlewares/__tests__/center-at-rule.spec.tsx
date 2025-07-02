import React, { ReactElement } from 'react';
import { render } from '@testing-library/react';

import { HoneyStyleProvider } from '../../../providers';
import { themeMock } from '../../../__mocks__';
import { styled } from '../../../styled';

const customRender = (element: ReactElement) =>
  render(<HoneyStyleProvider theme={themeMock}>{element}</HoneyStyleProvider>);

describe('@honey-center CSS at-rule', () => {
  it('should center both vertically and horizontally by default', () => {
    const Box = styled('div')`
      @honey-center {
        //
      }
    `;

    const { getByTestId } = customRender(<Box data-testid="center" />);

    expect(getByTestId('center')).toHaveStyle({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    });
  });

  it('should center horizontally when argument is "horizontal"', () => {
    const Box = styled('div')`
      @honey-center (horizontal) {
        //
      }
    `;

    const { getByTestId } = customRender(<Box data-testid="horizontal" />);

    expect(getByTestId('horizontal')).toHaveStyle({
      display: 'flex',
      justifyContent: 'center',
    });
  });

  it('should center horizontally when argument is "x"', () => {
    const Box = styled('div')`
      @honey-center (x) {
        //
      }
    `;

    const { getByTestId } = customRender(<Box data-testid="x" />);

    expect(getByTestId('x')).toHaveStyle({
      display: 'flex',
      justifyContent: 'center',
    });
  });

  it('should center vertically when argument is "vertical"', () => {
    const Box = styled('div')`
      @honey-center (vertical) {
        //
      }
    `;

    const { getByTestId } = customRender(<Box data-testid="vertical" />);

    expect(getByTestId('vertical')).toHaveStyle({
      display: 'flex',
      alignItems: 'center',
    });
  });

  it('should center vertically when argument is "y"', () => {
    const Box = styled('div')`
      @honey-center (y) {
        //
      }
    `;

    const { getByTestId } = customRender(<Box data-testid="y" />);

    expect(getByTestId('y')).toHaveStyle({
      display: 'flex',
      alignItems: 'center',
    });
  });

  it('should center text in block mode when argument is "block"', () => {
    const Box = styled('div')`
      @honey-center (block) {
        //
      }
    `;

    const { getByTestId } = customRender(<Box data-testid="block" />);

    expect(getByTestId('block')).toHaveStyle({
      display: 'block',
      textAlign: 'center',
    });
  });

  it('should center inline flex container when argument is "inline"', () => {
    const Box = styled('div')`
      @honey-center (inline) {
        //
      }
    `;

    const { getByTestId } = customRender(<Box data-testid="inline" />);

    expect(getByTestId('inline')).toHaveStyle({
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
    });
  });
});
