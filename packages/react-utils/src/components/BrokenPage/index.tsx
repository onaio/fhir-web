/** use this component as the temporary background view ,
 * when the app runs into an unrecoverable error.
 */
import React, { useState } from 'react';
import { Result } from 'antd';
import { sendErrorNotification } from '@opensrp-web/notifications';
import { ExtraLinks, UtilPageExtraProps, extraLinksDefault } from '../UtilPageExtra';
import lang from '../../lang';

/** props for the broken page component */
export interface BrokenPageProps extends UtilPageExtraProps {
  title: string;
  errorMessage?: string;
}

export const defaultProps = {
  ...extraLinksDefault,
  errorMessage: lang.SOMETHING_WENT_WRONG,
  title: lang.ERROR,
};

/** the component that renders a 500 view
 *
 * @param props - the component props
 */
const BrokenPage = (props: BrokenPageProps) => {
  const { errorMessage, title } = props;
  const extraLinksProps = {
    homeUrl: props.homeUrl,
  };
  return (
    <Result
      status="500"
      title={title}
      subTitle={errorMessage}
      extra={<ExtraLinks {...extraLinksProps} />}
    />
  );
};

BrokenPage.defaultProps = defaultProps;

export { BrokenPage };

/** custom hook that abstracts behavior of a broken page */

export const useHandleBrokenPage = () => {
  const [broken, setBroken] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  /**
   * Convenience function to handle cases where we must abort and tell the user we have done so
   *
   * @param {Error} error - Error object
   */
  function handleBrokenPage(error: Error) {
    sendErrorNotification(error.name, error.message);
    setErrorMessage(error.message);
    setBroken(true);
  }

  return { broken, errorMessage, handleBrokenPage };
};
