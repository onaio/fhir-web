import React from 'react';
import { Link } from 'react-router-dom';
import { ManifestReleasesTypes } from '../../../../ducks/manifestReleases';

/** interface for component props */
export interface TableActionsProps {
  file: ManifestReleasesTypes;
  viewReleaseURL: string;
}

const TableActions = (props: TableActionsProps): JSX.Element => {
  const { file, viewReleaseURL } = props;
  return (
    <>
      <Link to={`${viewReleaseURL}/${file.identifier}`} key="actions">
        View Files
      </Link>
    </>
  );
};

export { TableActions };
