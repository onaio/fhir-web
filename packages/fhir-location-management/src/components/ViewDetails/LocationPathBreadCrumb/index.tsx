import { ILocation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ILocation';
import { Breadcrumb } from 'antd';
import { URL_LOCATION_VIEW_DETAILS } from '../../../constants';
import { Link } from 'react-router-dom';
import React from 'react';

interface LocationPathBreadCrumbProps {
  locationPath: ILocation[];
}

export const LocationPathBreadCrumb = (props: LocationPathBreadCrumbProps) => {
  const { locationPath } = props;
  const breadCrumbItems = locationPath.map((location) => {
    const { name, id } = location;
    return {
      title: name,
      path: `${URL_LOCATION_VIEW_DETAILS}/${id}`,
    };
  });

  return (
    <Breadcrumb
      style={{ marginLeft: '16px' }}
      separator=">"
      items={breadCrumbItems}
      // eslint-disable-next-line @typescript-eslint/naming-convention
      itemRender={(route, _, items, __) => {
        const last = items.indexOf(route) === items.length - 1 || items.indexOf(route) === 0;
        return last ? (
          <span>{route.title}</span>
        ) : (
          <Link to={route.path ? route.path : '#'}>{route.title}</Link>
        );
      }}
    ></Breadcrumb>
  );
};
