import React, { ReactElement } from 'react';
import { render } from '@testing-library/react';

import { HoneyStyleProvider } from '../../providers';
import { themeMock } from '../../__mocks__';
import { styled } from '../../styled';

const customRender = (element: ReactElement) =>
  render(<HoneyStyleProvider theme={themeMock}>{element}</HoneyStyleProvider>);

describe('@honey-ellipsis CSS at-rule', () => {
  it('should convert @honey-ellipsis block into single-line text truncation styles', () => {
    const Box = styled('div')`
      @honey-ellipsis {
        //
      }
    `;

    const { getByTestId } = customRender(<Box data-testid="ellipsis" />);

    expect(getByTestId('ellipsis')).toHaveStyle({
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    });
  });

  it('should preserve additional declarations inside @honey-ellipsis block', () => {
    const Box = styled('div')`
      @honey-ellipsis {
        color: red;
      }
    `;

    const { getByTestId } = customRender(<Box data-testid="ellipsis" />);

    expect(getByTestId('ellipsis')).toHaveStyle({
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      color: 'rgb(255, 0, 0)',
    });
  });

  it('should work when using @honey-ellipsis without braces', () => {
    const Box = styled('div')`
      @honey-ellipsis;
    `;

    const { getByTestId } = customRender(<Box data-testid="ellipsis" />);

    expect(getByTestId('ellipsis')).toHaveStyle({
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    });
  });

  it('should allow declarations after @honey-ellipsis; and keep them applied', () => {
    const Box = styled('div')`
      @honey-ellipsis;

      color: red;
      max-width: 120px;
    `;

    const { getByTestId } = customRender(<Box data-testid="ellipsis" />);

    expect(getByTestId('ellipsis')).toHaveStyle({
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      color: 'rgb(255, 0, 0)',
      maxWidth: '120px',
    });
  });

  it('should allow nested selectors after @honey-ellipsis; and not break parsing', () => {
    const Box = styled('div')`
      @honey-ellipsis;

      .child {
        color: red;
      }
    `;

    const { getByTestId } = customRender(
      <Box data-testid="parent">
        <div className="child" data-testid="child" />
      </Box>,
    );

    // Ensure parent got ellipsis styles
    expect(getByTestId('parent')).toHaveStyle({
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    });

    // Ensure nested selector still worked
    expect(getByTestId('child')).toHaveStyle({
      color: 'rgb(255, 0, 0)',
    });
  });

  it('should work correctly when nested inside another rule', () => {
    const Box = styled('div')`
      .child {
        @honey-ellipsis {
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
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      fontWeight: 'bold',
    });
  });

  it('should not override unrelated styles outside the at-rule', () => {
    const Box = styled('div')`
      background: blue;

      @honey-ellipsis {
        //
      }
    `;

    const { getByTestId } = customRender(<Box data-testid="ellipsis" />);

    expect(getByTestId('ellipsis')).toHaveStyle({
      background: 'blue',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    });
  });
});
