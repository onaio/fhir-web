import React from 'react';
import { Result, Button } from 'antd';
import { PAGE_TITLE, PAGE_SUB_TITLE, BUTTON_TITLE } from '../../lang';

interface Props {
  homeUrl?: string;
}

const ErrorBoundaryFallback = (props: Props) => {
  const { homeUrl } = props;
  return (
    <Result
      status="error"
      title={PAGE_TITLE}
      subTitle={PAGE_SUB_TITLE}
      extra={
        <Button
          id="backHome"
          key="error"
          onClick={() => (window.location.href = homeUrl ? homeUrl : '/')}
          type="primary"
        >
          {BUTTON_TITLE}
        </Button>
      }
    />
  );
};

export { ErrorBoundaryFallback };
