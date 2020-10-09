import * as React from 'react';
import './LocationDetail.css';

const LocationDetail = ({ locationData }: any) => {
  const {
    name,
    lastupdated,
    status,
    type,
    created,
    externalid,
    openmrsid,
    username,
    version,
    syncstatus,
  } = locationData;

  return (
    <div className="p-4 bg-white">
      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold loc-title">Name</p>
        <p className="mb-0 loc-desc">{name}</p>
      </div>

      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold loc-title">Status</p>
        <p className="mb-0 loc-desc">{status}</p>
      </div>

      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold loc-title">Type</p>
        <p className="mb-0 loc-desc">{type}</p>
      </div>

      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold loc-title">Created</p>
        <p className="mb-0 loc-desc">{created}</p>
      </div>

      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold loc-title">Last updated</p>
        <p className="mb-0 loc-desc">{lastupdated}</p>
      </div>

      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold loc-title">External Id</p>
        <p className="mb-0 loc-desc">{externalid}</p>
      </div>

      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold loc-title">OpenMRS Id</p>
        <p className="mb-0 loc-desc">{openmrsid}</p>
      </div>

      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold loc-title">Username</p>
        <p className="mb-0 loc-desc">{username}</p>
      </div>

      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold loc-title">Username</p>
        <p className="mb-0 loc-desc">{username}</p>
      </div>

      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold loc-title">Version</p>
        <p className="mb-0 loc-desc">{version}</p>
      </div>

      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold loc-title">Sync status</p>
        <p className="mb-0 loc-desc">{syncstatus}</p>
      </div>
    </div>
  );
};

export default LocationDetail;
