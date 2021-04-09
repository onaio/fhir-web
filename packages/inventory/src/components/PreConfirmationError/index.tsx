/** shown during inventory csv bulk upload when validation fails and returns a csv error */
import React from 'react';
import { Card, Button, Table } from 'antd';
import lang from '../../lang';
import { FileExcelOutlined } from '@ant-design/icons';
import { errorsTableColumnsNameSpace, INVENTORY_BULK_UPLOAD_URL } from '../../constants';
import { Link } from 'react-router-dom';
import { ColumnsType } from 'antd/lib/table/interface';
import { BadRequestError } from '../../helpers/dataLoaders';
import { CardTitle } from '../../helpers/utils';
import { Column, TableLayout } from '@opensrp/react-utils';

type TableData = BadRequestError['errors'][0];

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

  const columns: Column<TableData>[] = [
    {
      title: lang.ROW_NUMBER,
      dataIndex: 'row',
      key: `${errorsTableColumnsNameSpace}-${lang.ROW_NUMBER}` as keyof TableData,
    },
    {
      title: lang.ERRORS,
      dataIndex: 'failureReason',
      key: `${errorsTableColumnsNameSpace}-${lang.ERRORS}` as keyof TableData,
    },
  ];

  const cardTitle = (
    <CardTitle
      IconRender={<FileExcelOutlined className="card-title__icon" />}
      text={lang.USE_CSV_TO_UPLOAD_INVENTORY}
    />
  );

  const datasource: TableData[] = errorObj?.errors.map((error) => {
    return {
      ...error,
      key: error.row,
    };
  }) as TableData[];

  return (
    <Card title={cardTitle} className="full-page-card">
      <p>
        {lang.PLEASE_FIX_THE_ERRORS_LISTED_BELOW}{' '}
        <Link to={INVENTORY_BULK_UPLOAD_URL}>{lang.RETRY_CSV_UPLOAD}</Link>
      </p>
      <TableLayout columns={columns} datasource={datasource} />
      <Link to={INVENTORY_BULK_UPLOAD_URL}>
        <Button className="round-button">{lang.RETRY}</Button>
      </Link>
    </Card>
  );
};

export { PreConfirmationError };
