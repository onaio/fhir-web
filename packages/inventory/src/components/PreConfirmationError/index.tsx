/** shown during inventory csv bulk upload when validation fails and returns a csv error */
import React from 'react';
import { Card, Button, Table } from 'antd';
import {
  ERRORS,
  PLEASE_FIX_THE_ERRORS_LISTED_BELOW,
  RETRY,
  RETRY_CSV_UPLOAD,
  ROW_NUMBER,
  USE_CSV_TO_UPLOAD_INVENTORY,
} from '../../lang';
import { FileExcelOutlined } from '@ant-design/icons';
import { errorsTableColumnsNameSpace, INVENTORY_BULK_UPLOAD_URL } from '../../constants';
import { Link } from 'react-router-dom';
import { ColumnsType } from 'antd/lib/table/interface';
import { BadRequestError } from '../../helpers/dataLoaders';
import { CardTitle } from '../../helpers/utils';

type TableData = BadRequestError['errors'][0];

const columns: ColumnsType<TableData> = [
  {
    title: ROW_NUMBER,
    dataIndex: 'row',
    key: `${errorsTableColumnsNameSpace}-${ROW_NUMBER}`,
  },
  {
    title: ERRORS,
    dataIndex: 'failureReason',
    key: `${errorsTableColumnsNameSpace}-${ERRORS}`,
  },
];

/** props for file start upload */
interface PreConfirmationErrorProps {
  errorObj?: BadRequestError;
}

/** Card shows errors from validation step
 *
 * @param props - components props
 */
const PreConfirmationError = (props: PreConfirmationErrorProps) => {
  const { errorObj } = props;

  const cardTitle = (
    <CardTitle
      IconRender={<FileExcelOutlined className="card-title__icon" />}
      text={USE_CSV_TO_UPLOAD_INVENTORY}
    />
  );

  const dataSource = errorObj?.errors.map((error) => {
    return {
      ...error,
      key: error.row,
    };
  });

  return (
    <Card title={cardTitle} className="full-page-card">
      <p>
        {PLEASE_FIX_THE_ERRORS_LISTED_BELOW}{' '}
        <Link to={INVENTORY_BULK_UPLOAD_URL}>{RETRY_CSV_UPLOAD}</Link>
      </p>
      <Table columns={columns} dataSource={dataSource}></Table>
      <Link to={INVENTORY_BULK_UPLOAD_URL}>
        <Button className="round-button">{RETRY}</Button>
      </Link>
    </Card>
  );
};

export { PreConfirmationError };
