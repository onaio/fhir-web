/**
 * shown during inventory csv bulk upload when committing entries
 * to the db fails and returns a csv error
 */
import React from 'react';
import { Card, Divider } from 'antd';
import { WarningOutlined } from '@ant-design/icons';
import { INVENTORY_BULK_UPLOAD_URL } from '../../constants';
import { Link } from 'react-router-dom';
import { BadRequestError } from '../../helpers/dataLoaders';
import { CardTitle } from '../../helpers/utils';
import { Column, TableLayout } from '@opensrp/react-utils';
import { useTranslation } from '../../mls';
import { Trans } from 'react-i18next';

type TableData = BadRequestError['errors'][0];

/** props for file start upload */
interface PostConfirmErrorProps {
  errorObj?: BadRequestError;
  filename: string;
}

const defaultProps = {
  filename: '',
};

/**
 * Card shows errors from validation step
 *
 * @param props - components props
 */
const PostConfirmError = (props: PostConfirmErrorProps) => {
  const { errorObj, filename } = props;
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
      IconRender={<WarningOutlined className="card-title__icon" />}
      text={t('Processing error: inventory items failed to be added')}
    />
  );

  const datasource: TableData[] = errorObj?.errors ?? [];

  const rowsProcessed = Number(errorObj?.rowsProcessed ?? '0');
  const totalRows = Number(errorObj?.rowsNumber ?? '0');
  const failedRowsNum = totalRows - rowsProcessed;

  return (
    <Card title={cardTitle} className="full-page-card">
      <p>
        {t(
          '{{failedRowsNum}} inventory items failed to be added from “{{filename}}”. To add items, follow these steps: ',
          { failedRowsNum, filename }
        )}
      </p>
      <ol>
        <li>{t('Extract the rows listed below from "{{filename}}"', { filename })}</li>
        <li>{t('Paste the rows into a new CSV file')}</li>
        <li>
          <Link to={INVENTORY_BULK_UPLOAD_URL}>{t('Upload the CSV file')}</Link>
        </li>
      </ol>
      <p>
        <Trans t={t} i18nKey="PostConfirmError.inventoryItemsNotAdded">
          Inventory items not listed below were successfully added to the
          <Link to={INVENTORY_BULK_UPLOAD_URL}>Service point inventory</Link>.
          <strong>
            &nbsp;Caution: do not re-upload the successful items or duplicates will be created.
          </strong>
        </Trans>
      </p>
      <Divider></Divider>
      <p>{t('Inventory items from “{{filename}}” that were not added', { filename })}</p>
      <TableLayout
        id="InventoryPostConfirmationError"
        dataKeyAccessor="row"
        persistState={true}
        columns={columns}
        datasource={datasource}
      />
    </Card>
  );
};

PostConfirmError.defaultProps = defaultProps;

export { PostConfirmError };
