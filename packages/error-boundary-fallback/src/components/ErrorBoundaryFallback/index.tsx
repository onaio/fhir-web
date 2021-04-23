import React from 'react';
import { Result, Button } from 'antd';
import lang from '../../lang';

interface Props {
  homeUrl?: string;
}

const ErrorBoundaryFallback = (props: Props) => {
  const { homeUrl } = props;
  return (
    <Result
      status="error"
      title={lang.PAGE_TITLE}
      subTitle={lang.PAGE_SUB_TITLE}
      extra={
        <Button
          id="backHome"
          key="error"
          onClick={() => (window.location.href = homeUrl ? homeUrl : '/')}
          type="primary"
        >
          {lang.BUTTON_TITLE}
        </Button>
      }
    />
  );
};

export { ErrorBoundaryFallback };
