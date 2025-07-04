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

  it('should compose class names from base and extended styled components', () => {
    const Button = styled('button')`
      background-color: white;
    `;

    const AddButton = (props: PropsWithChildren) => <Button {...props} />;

    const CustomAddButton = styled(AddButton)`
      background-color: green;
    `;

    const { getByTestId } = customRender(
      <CustomAddButton data-testid="custom-add-btn">content</CustomAddButton>,
    );

    expect(getByTestId('custom-add-btn')).toHaveClass(
      ...[
        // white
        'hscn-zqnl6l',
        // green
        'hscn-1b56n0h',
      ],
    );

    expect(getByTestId('custom-add-btn')).toHaveStyle({
      backgroundColor: 'green',
    });
  });

  it('should override default props with props passed to styled component', () => {
    const Box = styled('div', {
      title: 'Test',
    })``;

    const { getByTestId } = customRender(<Box title="Override Test" data-testid="box" />);

    expect(getByTestId('box')).toHaveAttribute('title', 'Override Test');
  });

  it('should convert single numeric spacing values to px using the multiplier', () => {
    const Box = styled('div')`
      margin: ${1.5};
      padding: ${1};
    `;

    const { getByTestId } = customRender(<Box data-testid="box" />);

    expect(getByTestId('box')).toHaveStyle({
      margin: '12px',
      padding: '8px',
    });
  });

  it('should convert array spacing values to px using the multiplier', () => {
    const Box = styled('div')`
      margin: ${[0.5, 2]};
      padding: ${[1, 1.5, '20px', -2]};
    `;

    const { getByTestId } = customRender(<Box data-testid="box" />);

    expect(getByTestId('box')).toHaveStyle({
      margin: '4px 16px',
      padding: '8px 12px 20px -16px',
    });
  });

  it('should convert directional spacing properties to px using the multiplier', () => {
    const Box = styled('div')`
      margin-top: ${2};
      padding-left: ${1};
    `;

    const { getByTestId } = customRender(<Box data-testid="box" />);

    expect(getByTestId('box')).toHaveStyle({
      marginTop: '16px',
      paddingLeft: '8px',
    });
  });

  // it('should 1', () => {
  //   type BoxProps<As extends ElementType> = HoneyStyledProps<
  //     As,
  //     {
  //       customProp: string;
  //     }
  //   >;
  //
  //   const Box = styled<BoxProps<'div'>>('div', {
  //     'data-testid': 'box',
  //   })``;
  //
  //   const Form = styled<BoxProps<'form'>>(Box, {
  //     as: 'form',
  //   })``;
  //
  //   const { getByTestId } = customRender(
  //     <Form unknownProp="123" customProp="test" data-testid="form" />,
  //   );
  //
  //   // expect(getByTestId('form'));
  // });
});
