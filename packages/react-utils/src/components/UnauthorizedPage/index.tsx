import React, { useState } from 'react';
import { Result } from 'antd';
import { sendWarningNotification } from '@opensrp/notifications';
import { ExtraLinks, UtilPageExtraProps, extraLinksDefault } from '../UtilPageExtra';
import { useTranslation } from '../../mls';

/** props for the unauthorized page component */
export interface UnauthorizedPageProps extends UtilPageExtraProps {
  title?: string;
  errorMessage?: string;
}

const defaultProps = {
  ...extraLinksDefault,
};

/** the component that renders a 500 view */

const UnauthorizedPage = (props: UnauthorizedPageProps) => {
  const { errorMessage, title } = props;

  // HACK to preserve defaultProps back compatibility
  const { t } = useTranslation();
  const i18nedErrMessage = errorMessage ?? t('Sorry, you are not authorized to access this page');
  const i18nedTitle = title ?? t('Error');
  const extraLinksProps = {
    homeUrl: props.homeUrl,
  };
  return (
    <Result
      status="403"
      title={i18nedTitle}
      subTitle={i18nedErrMessage}
      extra={<ExtraLinks {...extraLinksProps} />}
    />
  );
};

UnauthorizedPage.defaultProps = defaultProps;

export { UnauthorizedPage };

/** custom hook that abstracts behavior of an unauthorized page */

export const useHandleUnauthorizedPage = () => {
  const [unauthorized, setUnauthorized] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  /**
   * Convenience function to handle cases where we must abort and tell the user we have done so
   *
   * @param {Error} error - Error object
   */
  function handleUnauthorizedPage(error: Error) {
    sendWarningNotification(error.name, error.message);
    setErrorMessage(error.message);
    setUnauthorized(true);
  }

  return { unauthorized, errorMessage, handleUnauthorizedPage };
};
