import React from 'react';
import { Link } from 'react-router-dom';
import { ManifestReleasesTypes } from '../../../../ducks/manifestReleases';

/** interface for component props */
export interface TableActionsProps {
  file: ManifestReleasesTypes;
  currentURL: string;
}

const TableActions = (props: TableActionsProps): JSX.Element => {
  const { file, currentURL } = props;
  return (
    <>
      <Link to={`${currentURL}/${file.identifier}`} key="actions">
        View Files
      </Link>
    </>
  );
};

export { TableActions };
