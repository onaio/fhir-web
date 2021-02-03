import { getQueryParams } from '@opensrp/react-utils';
import { RouteComponentProps } from 'react-router';
import { BULK_UPLOAD_PARAM } from '../constants';
import queryString from 'querystring';
import React from 'react';
import { Space } from 'antd';

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

export const updateUrlWithStatusCreator = (props: RouteComponentProps) => (
  status?: UploadStatus
) => {
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
