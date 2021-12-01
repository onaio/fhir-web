import React from 'react';
import { Result, Button } from 'antd';
import { useTranslation } from '../../mls';
interface Props {
  homeUrl?: string;
}

const ErrorBoundaryFallback = (props: Props) => {
  const { homeUrl } = props;
  const { t } = useTranslation();
  return (
    <Result
      status="error"
      title={t('An Error Occurred')}
      subTitle={t(
        'There has been an error. It’s been reported to the site administrators via email and should be fixed shortly. Thanks for your patience.'
      )}
      extra={
        <Button
          id="backHome"
          key="error"
          onClick={() => (window.location.href = homeUrl ? homeUrl : '/')}
          type="primary"
        >
          {t('Back Home')}
        </Button>
      }
    />
  );
};

export { ErrorBoundaryFallback };
