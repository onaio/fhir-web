import React from 'react';
import { Result } from 'antd';
import { ExtraLinks, UtilPageExtraProps, extraLinksDefault } from '../UtilPageExtra';
import lang from '../../lang';

/** typings for the resource404 component */
interface Resource404Props extends UtilPageExtraProps {
  title: string;
  errorMessage: string;
}

const defaultProps = {
  ...extraLinksDefault,
  title: lang.TITLE_404,
  errorMessage: lang.RESOURCE_DOES_NOT_EXIST,
};

/**
 * component shown when a requested resource is not found;
 * the more canonical 404 component, is shown when a page is not yet bound
 * to the routing system, this component is to be used within an existing page
 * but where one or more resources to be shown on that page are deemed missing.
 */

const Resource404 = (props: Resource404Props) => {
  const { title, errorMessage } = props;
  const extraLinksProps = {
    homeUrl: props.homeUrl,
  };
  return (
    <Result
      status="404"
      title={title}
      subTitle={errorMessage}
      extra={<ExtraLinks {...extraLinksProps}></ExtraLinks>}
    />
  );
};

Resource404.defaultProps = defaultProps;

export { Resource404 };
