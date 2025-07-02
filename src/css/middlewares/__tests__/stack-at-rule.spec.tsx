import React, { ReactElement } from 'react';
import { render } from '@testing-library/react';

import { HoneyStyleProvider } from '../../../providers';
import { themeMock } from '../../../__mocks__';
import { styled } from '../../../styled';

const customRender = (element: ReactElement) =>
  render(<HoneyStyleProvider theme={themeMock}>{element}</HoneyStyleProvider>);

describe('@honey-stack CSS at-rule', () => {
  it('should apply flex column layout without gap when using @honey-stack without arguments', () => {
    const Box = styled('div')`
      @honey-stack;
    `;

    const { getByTestId } = customRender(<Box data-testid="stack" />);

    expect(getByTestId('stack')).toHaveStyle({
      display: 'flex',
      flexDirection: 'column',
    });
  });

  it('should apply flex column layout and gap using @honey-stack with numeric multiplier', () => {
    const Box = styled('div')`
      @honey-stack (2);
    `;

    const { getByTestId } = customRender(<Box data-testid="stack" />);

    expect(getByTestId('stack')).toHaveStyle({
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    });
  });

  it('should apply flex column layout with explicit gap unit when using @honey-stack(12px)', () => {
    const Box = styled('div')`
      @honey-stack (12px);
    `;

    const { getByTestId } = customRender(<Box data-testid="stack" />);

    expect(getByTestId('stack')).toHaveStyle({
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    });
  });

  it('should support @honey-stack with braces and apply calculated gap', () => {
    const Box = styled('div')`
      @honey-stack (1) {
      }
    `;

    const { getByTestId } = customRender(<Box data-testid="stack" />);

    expect(getByTestId('stack')).toHaveStyle({
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    });
  });

  it('should apply flex column layout and transform numeric gap inside @honey-stack block while preserving other styles', () => {
    const Box = styled('div')`
      @honey-stack {
        gap: ${1};
        align-items: center;
      }
    `;

    const { getByTestId } = customRender(<Box data-testid="stack" />);

    expect(getByTestId('stack')).toHaveStyle({
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      alignItems: 'center',
    });
  });

  it('should transform nested @honey-stack directives and apply correct layout, gap, and spacing styles to child elements', () => {
    const Box = styled('div')`
      @honey-stack {
        gap: ${1};
        align-items: center;

        .nested-stack {
          @honey-stack (0.5) {
            padding: ${1};
          }
        }
      }
    `;

    const { getByTestId } = customRender(
      <Box data-testid="stack">
        <div className="nested-stack" data-testid="nested-stack" />
      </Box>,
    );

    expect(getByTestId('stack')).toHaveStyle({
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      alignItems: 'center',
    });

    expect(getByTestId('nested-stack')).toHaveStyle({
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      padding: '8px',
    });
  });
});
