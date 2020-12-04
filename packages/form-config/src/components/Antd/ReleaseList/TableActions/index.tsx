import React from 'react';
import { Link } from 'react-router-dom';
import { ManifestReleasesTypes } from '../../../../ducks/manifestReleases';

/** interface for component props */
export interface TableActionsProps {
  file: ManifestReleasesTypes;
  viewFileURL: string;
}

const TableActions = (props: TableActionsProps): JSX.Element => {
  const { file, viewFileURL } = props;
  return (
    <>
      <Link to={`${viewFileURL}/${file.identifier}`} key="actions">
        View Files
      </Link>
    </>
  );
};

export { TableActions };
