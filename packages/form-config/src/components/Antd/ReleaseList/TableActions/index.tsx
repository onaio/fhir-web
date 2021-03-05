import React from 'react';
import { Link } from 'react-router-dom';
import { ManifestReleasesTypes } from '../../../../ducks/manifestReleases';
import { VIEW_FILES } from '../../../../lang';

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
        {VIEW_FILES}
      </Link>
    </>
  );
};

export { TableActions };
