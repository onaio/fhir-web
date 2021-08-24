import React, { useState } from 'react';
import { Result } from 'antd';
import { sendWarningNotification } from '@opensrp-web/notifications';
import { ExtraLinks, UtilPageExtraProps, extraLinksDefault } from '../UtilPageExtra';
import lang from '../../lang';

/** props for the unauthorized page component */
export interface UnauthorizedPageProps extends UtilPageExtraProps {
  title: string;
  errorMessage?: string;
}

const defaultProps = {
  ...extraLinksDefault,
  errorMessage: lang.YOU_ARE_UNAUTHORIZED,
  title: lang.ERROR,
};

/** the component that renders a 500 view */

const UnauthorizedPage = (props: UnauthorizedPageProps) => {
  const { errorMessage, title } = props;
  const extraLinksProps = {
    homeUrl: props.homeUrl,
  };
  return (
    <Result
      status="403"
      title={title}
      subTitle={errorMessage}
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
