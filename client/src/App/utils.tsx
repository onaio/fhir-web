import { OPENSRP_API_BASE_URL } from '../configs/env';
import React from 'react';
import { RouteComponentProps } from 'react-router';

export const productCatalogueProps = {
  baseURL: OPENSRP_API_BASE_URL,
};

export const wrapWithRouterProps = (props: RouteComponentProps, Component: React.ElementType) => {
  const allProps = {
    ...props,
    ...productCatalogueProps,
  };
  return <Component {...allProps} />;
};
