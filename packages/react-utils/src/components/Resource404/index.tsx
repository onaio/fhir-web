import React from 'react';
import { Result } from 'antd';
import { ExtraLinks, UtilPageExtraProps, extraLinksDefault } from '../UtilPageExtra';
import { useTranslation } from '../../mls';

/** typings for the resource404 component */
interface Resource404Props extends UtilPageExtraProps {
  title?: string;
  errorMessage?: string;
}

const defaultProps = {
  ...extraLinksDefault,
};

/** component shown when a requested resource is not found;
 * the more canonical 404 component, is shown when a page is not yet bound
 * to the routing system, this component is to be used within an existing page
 * but where one or more resources to be shown on that page are deemed missing.
 */

const Resource404 = (props: Resource404Props) => {
  const { title, errorMessage } = props;
  const { t } = useTranslation();
  const extraLinksProps = {
    homeUrl: props.homeUrl,
  };

  // HACK to preserve defaultProps back compatibility
  const i18nedErrMessage =
    errorMessage ?? t('Sorry, the resource you requested for, does not exist');
  const i18nedTitle = title ?? t('404');
  return (
    <Result
      status="404"
      title={i18nedTitle}
      subTitle={i18nedErrMessage}
      extra={<ExtraLinks {...extraLinksProps}></ExtraLinks>}
    />
  );
};

Resource404.defaultProps = defaultProps;

export { Resource404 };
