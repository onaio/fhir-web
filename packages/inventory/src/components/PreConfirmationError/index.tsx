/** shown during inventory csv bulk upload when validation fails and returns a csv error */
import React from 'react';
import { Card, Button } from 'antd';
import { FileExcelOutlined } from '@ant-design/icons';
import { INVENTORY_BULK_UPLOAD_URL } from '../../constants';
import { Link } from 'react-router-dom';
import { BadRequestError } from '../../helpers/dataLoaders';
import { CardTitle } from '../../helpers/utils';
import { Column, TableLayout } from '@opensrp/react-utils';
import { useTranslation } from '../../mls';
import { Trans } from '@opensrp/i18n';

type TableData = BadRequestError['errors'][0];

/** props for file start upload */
interface PreConfirmationErrorProps {
  errorObj?: BadRequestError;
}

/**
 * Card shows errors from validation step
 *
 * @param props - components props
 */
const PreConfirmationError = (props: PreConfirmationErrorProps) => {
  const { errorObj } = props;
  const { t } = useTranslation();

  const columns: Column<TableData>[] = [
    {
      title: t('Row number'),
      dataIndex: 'row' as const,
      key: 'row',
    },
    {
      title: t('Errors'),
      dataIndex: 'failureReason' as const,
      key: 'failureReason',
    },
  ];

  const cardTitle = (
    <CardTitle
      IconRender={<FileExcelOutlined className="card-title__icon"  />}
      text={t('Use a CSV file to add service point inventory')}
    />
  );

  const datasource: TableData[] = errorObj?.errors ?? [];

  return (
    <Card title={cardTitle} className="full-page-card">
      <Trans t={t} i18nKey="preConfirmationError.retryCsvUpload">
        <p>
          please fix the errors listed below, then&nbsp;
          <Link to={INVENTORY_BULK_UPLOAD_URL}>retry csv upload</Link>
        </p>
      </Trans>
      <TableLayout
        id="InventoryPreConfirmationError"
        dataKeyAccessor="row"
        persistState={true}
        columns={columns}
        datasource={datasource}
      />
      <Link to={INVENTORY_BULK_UPLOAD_URL}>
        <Button className="round-button">{t('Retry')}</Button>
      </Link>
    </Card>
  );
};

export { PreConfirmationError };
