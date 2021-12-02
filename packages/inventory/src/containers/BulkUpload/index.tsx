import React, { useState } from 'react';
import { PageHeader } from 'antd';
import { getQueryParams } from '@opensrp/react-utils';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { CommonProps, defaultCommonProps } from '../../helpers/common';
import { updateUrlWithStatusCreator, UploadStatus } from '../../helpers/utils';
import { StartUpload } from '../../components/StartUpload';
import {
  BadRequestError,
  parseTextResponse,
  SuccessfulResponse,
  uploadCSV,
} from '../../helpers/dataLoaders';
import axios from 'axios';
import {
  BULK_UPLOAD_PARAM,
  INVENTORY_BULK_UPLOAD_URL,
  OPENSRP_IMPORT_STOCK_ENDPOINT,
  OPENSRP_UPLOAD_STOCK_ENDPOINT,
} from '../../constants';
import { UploadValidateCard } from '../../components/PreConfirmUploadValidate';
import { PostConfirmError } from '../../components/PostConfirmationError';
import { PreConfirmationSuccess } from '../../components/PreConfirmationSuccess';
import { PostConfirmationUpload } from '../../components/PostConfirmUpload';
import { PostConfirmationSuccess } from '../../components/PostConfirmationSuccess';
import { PreConfirmationError } from '../../components/PreConfirmationError';
import { sendErrorNotification } from '@opensrp/notifications';
import { useTranslation } from '../../mls';

export type CSVUploadTypes = CommonProps & RouteComponentProps;

/** default Props */
const defaultProps = {
  ...defaultCommonProps,
};

/** component that renders views for uploading inventory using a csv file
 *
 * @param props - the component props
 */
const BulkUpload = (props: CSVUploadTypes) => {
  const { baseURL } = props;
  /** track the visibility of the cards on this page. */
  const uploadStatus =
    getQueryParams(props.location)[BULK_UPLOAD_PARAM] ?? UploadStatus.UPLOAD_START;
  const updateURLWithStatus = updateUrlWithStatusCreator(props);
  const history = useHistory();
  const [validatedRows, setValidatedRows] = useState<SuccessfulResponse>();
  const [importedRows, setImportedRows] = useState<string | number>();
  const [file, selectFile] = useState<File>();
  const [requestErrors, setRequestErrors] = useState<BadRequestError>();
  const [importRequestError, setImportRequestError] = useState<BadRequestError>();
  const { t } = useTranslation();

  const pageTitle = t('Add inventory via CSV');
  return (
    <div className="content-section">
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <PageHeader title={pageTitle} className="page-header"></PageHeader>
      {(() => {
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();
        if (uploadStatus === UploadStatus.UPLOAD_START) {
          const onUploadFinish = () => {
            updateURLWithStatus(UploadStatus.PRE_CONFIRMATION_VALIDATION);
          };
          const onRequestError = (err: BadRequestError) => {
            setRequestErrors(err);
            updateURLWithStatus(UploadStatus.PRE_CONFIRMATION_ERROR);
          };
          const onRequestStart = () => {
            updateURLWithStatus(UploadStatus.PRE_CONFIRMATION_UPLOAD);
          };
          const onRequestCancel = () => {
            updateURLWithStatus();
          };
          const startUploadProps = {
            onFileUpload: (file: File) => {
              selectFile(file);
              uploadCSV(
                file,
                baseURL,
                OPENSRP_UPLOAD_STOCK_ENDPOINT,
                onUploadFinish,
                onRequestError,
                onRequestStart,
                onRequestCancel,
                source.token
              )
                .then((successData) => {
                  if (successData) {
                    setValidatedRows(successData as SuccessfulResponse);
                    updateURLWithStatus(UploadStatus.PRE_CONFIRMATION_SUCCESS);
                  }
                })
                .catch((err) => {
                  sendErrorNotification(err.message);
                  updateURLWithStatus();
                });
            },
          };
          return <StartUpload {...startUploadProps} />;
        }
        const cancelUploadValidation = () => {
          // stop the axios request and redirect back to bulk upload
          source.cancel();
          history.push(INVENTORY_BULK_UPLOAD_URL);
        };
        if (uploadStatus === UploadStatus.PRE_CONFIRMATION_UPLOAD) {
          const uploadValidationProps = {
            uploadStatus: UploadStatus.PRE_CONFIRMATION_UPLOAD,
            onCancel: cancelUploadValidation,
          };
          return <UploadValidateCard {...uploadValidationProps} />;
        }
        if (uploadStatus === UploadStatus.PRE_CONFIRMATION_VALIDATION) {
          const uploadValidationProps = {
            uploadStatus: UploadStatus.PRE_CONFIRMATION_VALIDATION,
            onCancel: cancelUploadValidation,
          };
          return <UploadValidateCard {...uploadValidationProps} />;
        }
        if (uploadStatus === UploadStatus.PRE_CONFIRMATION_ERROR) {
          const uploadValidationProps = {
            errorObj: requestErrors,
            filename: file?.name,
          };
          return <PreConfirmationError {...uploadValidationProps} />;
        }
        if (uploadStatus === UploadStatus.PRE_CONFIRMATION_SUCCESS) {
          const onRequestError = (err: BadRequestError) => {
            setImportRequestError(err);
            updateURLWithStatus(UploadStatus.POST_CONFIRMATION_ERROR);
          };
          const onRequestStart = () => {
            updateURLWithStatus(UploadStatus.POST_CONFIRMATION_UPLOAD);
          };
          const preConfirmSuccessProps = {
            onCancel: () => {
              history.push(INVENTORY_BULK_UPLOAD_URL);
            },
            onCommitInventory: () => {
              if (file) {
                return uploadCSV(
                  file,
                  baseURL,
                  OPENSRP_IMPORT_STOCK_ENDPOINT,
                  undefined,
                  onRequestError,
                  onRequestStart,
                  undefined,
                  source.token
                )
                  .then((dataString) => {
                    if (dataString) {
                      const parsedResponse = parseTextResponse(dataString as string);
                      setImportedRows(parsedResponse.rowsProcessed);
                      updateURLWithStatus(UploadStatus.POST_CONFIRMATION_SUCCESS);
                    }
                  })
                  .catch((err) => {
                    sendErrorNotification(err.message);
                    updateURLWithStatus();
                  });
              }
            },
            filename: file?.name,
            rowsProcessed: validatedRows?.rowCount ?? 0,
          };
          return <PreConfirmationSuccess {...preConfirmSuccessProps} />;
        }
        if (uploadStatus === UploadStatus.POST_CONFIRMATION_UPLOAD) {
          return <PostConfirmationUpload />;
        }

        if (uploadStatus === UploadStatus.POST_CONFIRMATION_SUCCESS) {
          const postConfirmationSuccessProps = {
            rowsProcessed: importedRows,
            filename: file?.name,
          };
          return <PostConfirmationSuccess {...postConfirmationSuccessProps} />;
        }
        const postConfirmErrorProps = {
          errorObj: importRequestError,
          filename: file?.name,
        };
        return <PostConfirmError {...postConfirmErrorProps} />;
      })()}
    </div>
  );
};

BulkUpload.defaultProps = defaultProps;

export { BulkUpload };
