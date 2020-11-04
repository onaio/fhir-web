import React from 'react';
import { RouteComponentProps } from 'react-router';
import '../Location.css';
export interface GetLocationProps {
    accessToken: string;
}
export interface RouteParams {
    userId: string;
}
/** type intersection for all types that pertain to the props */
export declare type PropsTypes = GetLocationProps & RouteComponentProps<RouteParams>;
export declare const ConnectedLocationUnitGroupAdd: import("react-redux").ConnectedComponent<React.FC<PropsTypes>, Pick<PropsTypes, "location" | "accessToken" | "history" | "match" | "staticContext">>;
