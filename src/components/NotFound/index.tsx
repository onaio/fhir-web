import { Result, Button } from 'antd';
import * as React from 'react';
import { useHistory } from 'react-router';
import { HOME_URL } from '../../constants';

const NotFound: React.FC = () => {
  const history = useHistory();

  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you are trying to visit does not exist."
      extra={
        <Button key="home" onClick={() => history.push(HOME_URL)} type="primary">
          Back Home
        </Button>
      }
    />
  );
};

export default NotFound;
