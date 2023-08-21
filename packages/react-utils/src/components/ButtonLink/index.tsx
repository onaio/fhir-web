import React, { HTMLAttributes } from 'react';
import { Button } from 'antd';
import { useHistory } from 'react-router';

/***
 * Simple button, type link supposed to be used for navigation
 */

export interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  name: string;
  route: string;
}

const ButtonLink = (props: ButtonProps) => {
  const history = useHistory();
  const { name, route, className } = props;

  const handleClick = () => {
    history.push(route);
  };

  return (
    <Button onClick={handleClick} className={className} type="link">
      {name}
    </Button>
  );
};

export { ButtonLink };
