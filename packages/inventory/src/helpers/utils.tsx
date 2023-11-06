import { getQueryParams } from '@opensrp/react-utils';
import { RouteComponentProps } from 'react-router';
import { BULK_UPLOAD_PARAM, COMMUNE_GEOGRAPHIC_LEVEL } from '../constants';
import queryString from 'querystring';
import React from 'react';
import { Space } from 'antd';
import { TreeNode } from '@opensrp/location-management';

export enum UploadStatus {
  UPLOAD_START = 'uploadStart',
  PRE_CONFIRMATION_UPLOAD = 'preConfirmationUpload',
  PRE_CONFIRMATION_VALIDATION = 'preConfirmationValidation',
  PRE_CONFIRMATION_SUCCESS = 'preConfirmationSuccess',
  PRE_CONFIRMATION_ERROR = 'preConfirmationError',
  POST_CONFIRMATION_UPLOAD = 'postConfirmationUpload',
  POST_CONFIRMATION_SUCCESS = 'postConfirmationSuccess',
  POST_CONFIRMATION_ERROR = 'postConfirmationError',
}

export const updateUrlWithStatusCreator =
  (props: RouteComponentProps) => (status?: UploadStatus) => {
    const allQueryParams = getQueryParams(props.location);
    if (status) {
      allQueryParams[BULK_UPLOAD_PARAM] = status;
    } else {
      delete allQueryParams[BULK_UPLOAD_PARAM];
    }
    props.history.push(`${props.match.url}?${queryString.stringify(allQueryParams)}`);
  };

interface CardTitleProps {
  IconRender: React.ReactNode;
  text: string;
}
export const CardTitle = ({ IconRender = null, text = '' }: CardTitleProps) => (
  <Space className="card-title">
    {IconRender}
    <span className="card-title__text">{text}</span>
  </Space>
);

/**
 * to pass to form, help decide what nodes in the tree select options will be disabled
 * returns true meaning disabled if node does not have the geographic level 3
 *
 * @param node - a single tree node
 */
export const disabledTreeNodesCallback = (node: TreeNode) => {
  return node.model.node.attributes.geographicLevel !== COMMUNE_GEOGRAPHIC_LEVEL;
};

/** location form fields that are hidden for service point creation and editing in EUSM */
export const commonHiddenFields = [
  'extraFields',
  'type',
  'locationTags',
  'externalId',
  'isJurisdiction',
  'geometry',
];
