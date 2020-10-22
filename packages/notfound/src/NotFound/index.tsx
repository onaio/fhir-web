import { Result, Button } from 'antd';
import React from 'react';
import { useHistory } from 'react-router';

interface Props {
  pathtoredirectto: string;
  title?: string;
  subTitle?: string;
}

/** Component to show when a page is not found in routes
 *
 * @param {props} props to contain functionality of NotsFound Component.
 * @returns {Function} returns Notfound component
 */
const NotFound: React.FC<Props> = (props: Props): JSX.Element => {
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

NotFound.defaultProps = {
  title: '404',
  subTitle: 'Sorry, the page you are trying to visit does not exist.',
};

export default NotFound;
