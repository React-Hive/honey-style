import React, { ReactElement } from 'react';
import { render } from '@testing-library/react';

import { HoneyStyleProvider } from '../../../providers';
import { themeMock } from '../../../__mocks__';
import { styled } from '../../../styled';

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
});
