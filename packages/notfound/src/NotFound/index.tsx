import { Result, Button } from 'antd';
import React from 'react';
import { useHistory } from 'react-router';

interface Props {
  pathtoredirectto: string;
  title: string;
  subTitle: string;
}

NotFound.defaultProps = {
  title: '404',
  subTitle: 'Sorry, the page you are trying to visit does not exist.',
};

function NotFound(props: Props) {
  const history = useHistory();

  return (
    <Result
      status="404"
      title={props.title}
      subTitle={props.subTitle}
      extra={
        <>
          asdsadaS
          <Button key="home" onClick={() => history.push(props.pathtoredirectto)} type="primary">
            Back Home
          </Button>
        </>
      }
    />
  );
}

export default NotFound;
