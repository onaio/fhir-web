import React from 'react';
import { Link } from 'react-router-dom';
import { ManifestReleasesTypes } from '@opensrp/form-config-core';
import { useTranslation } from '../../../mls';

/** interface for component props */
export interface TableActionsProps {
  file: ManifestReleasesTypes;
  viewReleaseURL: string;
}

const TableActions = (props: TableActionsProps): JSX.Element => {
  const { file, viewReleaseURL } = props;
  const {t} = useTranslation()
  return (
    <>
      <Link to={`${viewReleaseURL}/${file.identifier}`} key="actions">
        {t('View Files')}
      </Link>
    </>
  );
};

export { TableActions };
