import { useHistory } from 'react-router';
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { HOME_URL } from '../constants';

export interface UtilPageExtraProps {
  homeUrl: string;
}

export const defaultProps = {
  homeUrl: HOME_URL,
};

/** util component that is used in several other util-views that serve
 * as notification views
 */

const ExtraLinks = (props: UtilPageExtraProps) => {
  const history = useHistory();
  const { homeUrl } = props;
  return (
    <>
      <Button
        type="primary"
        onClick={() => {
          history.goBack();
        }}
      >
        <ArrowLeftOutlined />
        Go Back
      </Button>
      <Link to={homeUrl}>
        <Button type="primary">Back Home</Button>
      </Link>
    </>
  );
};

ExtraLinks.defaultProps = defaultProps;

export { ExtraLinks };
