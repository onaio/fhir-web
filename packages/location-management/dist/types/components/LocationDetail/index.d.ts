/// <reference types="react" />
import './LocationDetail.css';
export interface Props {
    name: string;
    active: any;
    description: string;
    onClose?: Function;
}
declare const LocationDetail: (props: Props) => JSX.Element;
export default LocationDetail;
