import React from 'react';
import { render } from '@testing-library/react';
import type { ReactElement, PropsWithChildren } from 'react';

import { themeMock } from '../__mocks__';
import { HoneyStyleProvider } from '../providers';
import { styled } from '../styled';

const customRender = (element: ReactElement) =>
  render(<HoneyStyleProvider theme={themeMock}>{element}</HoneyStyleProvider>);

describe('[styled]: basic behavior', () => {
  it('should render a styled component with children and props', () => {
    const Box = styled('div')``;

    const { getByTestId } = customRender(<Box data-testid="box">content</Box>);

    expect(getByTestId('box')).toHaveTextContent('content');
  });

  it('should render a styled component with "as" prop and preserve native attributes', () => {
    const Box = styled('div')``;
    const A = styled(Box, {
      as: 'a',
    })``;

    const { getByTestId } = customRender(
      <A href="https://google.com" data-testid="link">
        content
      </A>,
    );

    expect(getByTestId('link')).toHaveAttribute('href', 'https://google.com');
  });

  it('should render with the "as" prop using a styled component and preserve attributes', () => {
    const Link = styled('a')``;
    const Box = styled('div')``;

    const { getByTestId } = customRender(
      <Box as={Link} href="https://google.com" data-testid="link">
        content
      </Box>,
    );

    expect(getByTestId('link')).toHaveAttribute('href', 'https://google.com');
  });

  it('should render with the "as" prop using a custom component and forward its props', () => {
    interface LinkProps {
      to: string;
    }

    const Link = ({ to, ...props }: PropsWithChildren<LinkProps>) => {
      return <a href={to} {...props}></a>;
    };

    const Box = styled('div')``;

    const { getByTestId } = customRender(
      <Box as={Link} to="https://google.com" data-testid="link">
        content
      </Box>,
    );

    expect(getByTestId('link')).toHaveAttribute('href', 'https://google.com');
  });
});
