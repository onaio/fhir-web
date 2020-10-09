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
    <div className="mr-1 ml-3 loc-detail-container bg-white">
      <div className="loc-detail-item">
        <p className="loc-title">Name</p>
        <p className="loc-desc">{name}</p>
      </div>

      <div className="loc-detail-item">
        <p className="loc-title">Status</p>
        <p className="loc-desc">{status}</p>
      </div>

      <div className="loc-detail-item">
        <p className="loc-title">Type</p>
        <p className="loc-desc">{type}</p>
      </div>

      <div className="loc-detail-item">
        <p className="loc-title">Created</p>
        <p className="loc-desc">{created}</p>
      </div>

      <div className="loc-detail-item">
        <p className="loc-title">Last updated</p>
        <p className="loc-desc">{lastupdated}</p>
      </div>

      <div className="loc-detail-item">
        <p className="loc-title">External Id</p>
        <p className="loc-desc">{externalid}</p>
      </div>

      <div className="loc-detail-item">
        <p className="loc-title">OpenMRS Id</p>
        <p className="loc-desc">{openmrsid}</p>
      </div>

      <div className="loc-detail-item">
        <p className="loc-title">Username</p>
        <p className="loc-desc">{username}</p>
      </div>

      <div className="loc-detail-item">
        <p className="loc-title">Username</p>
        <p className="loc-desc">{username}</p>
      </div>

      <div className="loc-detail-item">
        <p className="loc-title">Version</p>
        <p className="loc-desc">{version}</p>
      </div>

      <div className="loc-detail-item">
        <p className="loc-title">Sync status</p>
        <p className="loc-desc">{syncstatus}</p>
      </div>
    </div>
  );
};

export default LocationDetail;
