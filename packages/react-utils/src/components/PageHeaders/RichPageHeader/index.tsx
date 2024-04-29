import React from 'react';
import { PageHeader, PageHeaderProps } from '@ant-design/pro-layout';
import { Link, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Breadcrumb } from 'antd';
import { BreadcrumbProps } from 'antd/es/breadcrumb';

export interface RichPageHeaderProps {
  pageHeaderProps?: PageHeaderProps;
  breadCrumbProps?: BreadcrumbProps;
}

const RichPageHeader = (props: RichPageHeaderProps) => {
  const { pageHeaderProps, breadCrumbProps } = props;

  const { t } = useTranslation();
  const history = useHistory();

  const updatedBreadcrumbProps: BreadcrumbProps = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    itemRender: (route, _, items, __) => {
      const last = items.indexOf(route) === items.length - 1;
      return last ? (
        <span>{route.title}</span>
      ) : (
        <Link to={route.path ? route.path : '#'}>{route.title}</Link>
      );
    },
    ...breadCrumbProps,
  };

  const updatedPageheaderProps: PageHeaderProps = {
    className: 'site-page-header',
    onBack: () => history.goBack(),
    title: t('View details'),
    ...pageHeaderProps,
  };

  if (breadCrumbProps?.items) {
    const breadcrumbRenderFn = () => <Breadcrumb {...updatedBreadcrumbProps} />;
    updatedPageheaderProps.breadcrumbRender =
      pageHeaderProps?.breadcrumbRender ?? breadcrumbRenderFn;
  }

  return <PageHeader {...updatedPageheaderProps} />;
};

export { RichPageHeader };
