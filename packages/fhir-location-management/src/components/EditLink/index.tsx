import React from 'react';
import { Link } from 'react-router-dom';
import { useMls } from '../../mls';
import { URL_LOCATION_UNIT_EDIT, URL_SERVICE_POINT_ADD_EDIT } from '../../constants';
import { ILocation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ILocation';

interface EditLinkProps {
  location: ILocation;
}

const EditLink: React.FC<EditLinkProps> = ({ location }) => {
  const { t } = useMls();
  const { id, physicalType } = location;
  const isBuilding = physicalType?.coding?.[0].code === 'bu';

  return (
    <Link
      to={`${isBuilding ? URL_SERVICE_POINT_ADD_EDIT : URL_LOCATION_UNIT_EDIT}/${id}`}
      className="m-0 p-1"
    >
      {t('Edit')}
    </Link>
  );
};

export { EditLink };
