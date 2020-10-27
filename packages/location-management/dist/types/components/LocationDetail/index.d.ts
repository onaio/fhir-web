/// <reference types="react" />
import './LocationDetail.css';
export interface Props {
    key: string;
    name: string;
    status: 'Alive' | 'Not Active';
    type: string;
    created: Date;
    lastupdated: Date;
    externalid: string;
    openmrsid: string;
    username: string;
    version: string;
    syncstatus: 'Synced' | 'Not Synced';
    level: number;
    onClose?: Function;
}
declare const LocationDetail: (props: Props) => JSX.Element;
export default LocationDetail;
