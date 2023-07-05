/***
 * Simple button component for use in Dropdown components
 */

import React, { HTMLAttributes } from 'react';
import { Button } from 'antd';
import { useHistory } from 'react-router';

export interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  name: string;
  route: string;
  'data-testid'?: string;
}

const ButtonLink = (props: ButtonProps) => {
  const history = useHistory();
  const { name, route, className, 'data-testid': dataTestId } = props;

  const handleClick = () => {
    history.push(route);
  };

  return (
    <Button onClick={handleClick} className={className} data-testid={dataTestId} type="link">
      {name}
    </Button>
  );
};

export { ButtonLink };
