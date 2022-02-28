import { useHistory } from 'react-router';
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { HOME_URL } from '../../constants';
import lang from '../../lang';

export interface UtilPageExtraProps {
  homeUrl: string;
}

export const extraLinksDefault = {
  homeUrl: HOME_URL,
};

/**
 * util component that is used in several other util-views that serve
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
        {lang.GO_BACK}
      </Button>
      <Link to={homeUrl}>
        <Button type="primary">{lang.GO_HOME}</Button>
      </Link>
    </>
  );
};

ExtraLinks.defaultProps = extraLinksDefault;

export { ExtraLinks };
