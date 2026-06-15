import React, { ReactElement } from 'react';
import { render } from '@testing-library/react';

import { HoneyStyleProvider } from '../../providers';
import { themeMock } from '../../__mocks__';
import { styled } from '../../styled';

const customRender = (element: ReactElement) =>
  render(<HoneyStyleProvider theme={themeMock}>{element}</HoneyStyleProvider>);

describe('@honey-if CSS at-rule', () => {
  it('should apply declarations when condition is true', () => {
    const Box = styled('div')`
      @honey-if (true) {
        border-radius: 8px;
        background-color: red;
      }
    `;

    const { getByTestId } = customRender(<Box data-testid="box" />);

    expect(getByTestId('box')).toHaveStyle({
      borderRadius: '8px',
      backgroundColor: 'rgb(255, 0, 0)',
    });
  });

  it('should not apply declarations when condition is false', () => {
    const Box = styled('div')`
      @honey-if (false) {
        border-radius: 8px;
        background-color: red;
      }
    `;

    const { getByTestId } = customRender(<Box data-testid="box" />);

    expect(getByTestId('box')).not.toHaveStyle({
      borderRadius: '8px',
      backgroundColor: 'rgb(255, 0, 0)',
    });
  });

  it('should work with dynamic boolean props', () => {
    interface BoxProps {
      active: boolean;
    }

    const Box = styled('div')<BoxProps>`
      ${({ active }) => `
        @honey-if (${!active}) {
          border-radius: 8px;
          background-color: red;
        }
      `}
    `;

    const { getByTestId, rerender } = customRender(<Box active={false} data-testid="box" />);

    expect(getByTestId('box')).toHaveStyle({
      borderRadius: '8px',
      backgroundColor: 'rgb(255, 0, 0)',
    });

    rerender(
      <HoneyStyleProvider theme={themeMock}>
        <Box active data-testid="box" />
      </HoneyStyleProvider>,
    );

    expect(getByTestId('box')).not.toHaveStyle({
      borderRadius: '8px',
      backgroundColor: 'rgb(255, 0, 0)',
    });
  });

  it.each(['0', 'false'])('should treat "%s" as false', condition => {
    const Box = styled('div')`
      @honey-if (${condition}) {
        color: red;
      }
    `;

    const { getByTestId } = customRender(<Box data-testid="box" />);

    expect(getByTestId('box')).not.toHaveStyle({
      color: 'rgb(255, 0, 0)',
    });
  });

  it('should treat empty params as false', () => {
    const Box = styled('div')`
      @honey-if() {
        color: red;
      }
    `;

    const { getByTestId } = customRender(<Box data-testid="box" />);

    expect(getByTestId('box')).not.toHaveStyle({
      color: 'rgb(255, 0, 0)',
    });
  });

  it.each(['1', 'true', 'hello'])('should treat "%s" as true', condition => {
    const Box = styled('div')`
      @honey-if (${condition}) {
        color: red;
      }
    `;

    const { getByTestId } = customRender(<Box data-testid="box" />);

    expect(getByTestId('box')).toHaveStyle({
      color: 'rgb(255, 0, 0)',
    });
  });

  it('should preserve declarations before and after @honey-if', () => {
    const Box = styled('div')`
      display: block;

      @honey-if (true) {
        color: red;
      }

      max-width: 120px;
    `;

    const { getByTestId } = customRender(<Box data-testid="box" />);

    expect(getByTestId('box')).toHaveStyle({
      display: 'block',
      color: 'rgb(255, 0, 0)',
      maxWidth: '120px',
    });
  });

  it('should not break nested selectors after @honey-if', () => {
    const Box = styled('div')`
      @honey-if (true) {
        color: red;
      }

      .child {
        color: blue;
      }
    `;

    const { getByTestId } = customRender(
      <Box data-testid="parent">
        <div className="child" data-testid="child" />
      </Box>,
    );

    expect(getByTestId('parent')).toHaveStyle({
      color: 'rgb(255, 0, 0)',
    });

    expect(getByTestId('child')).toHaveStyle({
      color: 'rgb(0, 0, 255)',
    });
  });

  it('should work correctly when nested inside another rule', () => {
    const Box = styled('div')`
      .child {
        @honey-if (true) {
          color: red;
          font-weight: bold;
        }
      }
    `;

    const { getByTestId } = customRender(
      <Box data-testid="parent">
        <div className="child" data-testid="child" />
      </Box>,
    );

    expect(getByTestId('child')).toHaveStyle({
      color: 'rgb(255, 0, 0)',
      fontWeight: 'bold',
    });
  });

  it('should apply declarations and nested class selectors inside @honey-if when condition is true', () => {
    const Box = styled('div')`
      @honey-if (true) {
        color: blue;

        .child {
          color: red;
          font-weight: bold;
        }
      }
    `;

    const { getByTestId } = customRender(
      <Box data-testid="parent">
        <div className="child" data-testid="child" />
      </Box>,
    );

    expect(getByTestId('parent')).toHaveStyle({
      color: 'rgb(0, 0, 255)',
    });

    expect(getByTestId('child')).toHaveStyle({
      color: 'rgb(255, 0, 0)',
      fontWeight: 'bold',
    });
  });

  it('should remove nested class selectors declared inside @honey-if when condition is false', () => {
    const Box = styled('div')`
      @honey-if (false) {
        .child {
          color: red;
          font-weight: bold;
        }
      }
    `;

    const { getByTestId } = customRender(
      <Box data-testid="parent">
        <div className="child" data-testid="child" />
      </Box>,
    );

    expect(getByTestId('child')).not.toHaveStyle({
      color: 'rgb(255, 0, 0)',
      fontWeight: 'bold',
    });
  });
});
