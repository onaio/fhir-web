import { Result, Button } from 'antd';
import React from 'react';
import { useHistory } from 'react-router';

export interface NotFoundProps {
  pathtoredirectto: string;
  title?: string;
  subTitle?: string;
}

const defaultProps: Partial<NotFoundProps> = {
  title: '404',
  subTitle: 'Sorry, the page you are trying to visit does not exist.',
};

/** Component to show when a page is not found in routes
 *
 * @param {NotFoundProps} props to contain functionality of NotsFound Component.
 * @returns {NotFound} returns Notfound component
 */
const NotFound: React.FC<NotFoundProps> = (props: NotFoundProps): JSX.Element => {
  const history = useHistory();

  return (
    <Result
      status="404"
      title={props.title}
      subTitle={props.subTitle}
      extra={
        <Button key="home" onClick={() => history.push(props.pathtoredirectto)} type="primary">
          Back Home
        </Button>
      }
    />
  );
};

NotFound.defaultProps = defaultProps;

export default NotFound;
