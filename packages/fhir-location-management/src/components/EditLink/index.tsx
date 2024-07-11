import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BACK_SEARCH_PARAM,
  URL_LOCATION_UNIT_EDIT,
  URL_SERVICE_POINT_ADD_EDIT,
} from '../../constants';
import { ILocation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ILocation';

interface EditLinkProps {
  location: ILocation;
  editLinkText: string;
}

const EditLink: React.FC<EditLinkProps> = (props) => {
  const { location, editLinkText } = props;
  const { id, physicalType } = location;
  const isBuilding = physicalType?.coding?.[0].code === 'bu';
  const currentLocation = useLocation();

  const backToParam = new URLSearchParams({ [BACK_SEARCH_PARAM]: currentLocation.pathname });

  return (
    <Link
      to={
        isBuilding
          ? `${URL_SERVICE_POINT_ADD_EDIT}/${id}?${backToParam}`
          : `${URL_LOCATION_UNIT_EDIT}/${id}?${backToParam}`
      }
      className="m-0 p-1"
    >
      {editLinkText}
    </Link>
  );
};

export { EditLink };
