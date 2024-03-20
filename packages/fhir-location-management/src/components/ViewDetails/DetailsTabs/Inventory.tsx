import React from 'react';
import { useTranslation } from '../../../mls';
import {
  TableLayout,
  useTabularViewWithLocalSearch,
  SearchForm,
  Column,
} from '@opensrp/react-utils';
import { Alert, Button, Col, Divider, Row } from 'antd';
import { IGroup } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IGroup';
import { listResourceType } from '../../../constants';
import { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';
import { RbacCheck } from '@opensrp/rbac';
import { Link, useHistory } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
import {
  donorCharacteristicCoding,
  getCharacteristicWithCoding,
  groupResourceType,
  inventoryGroupCoding,
  poNumberIdentifierCoding,
  productCoding,
  sectionCharacteristicCoding,
  quantityCharacteristicCoding,
} from '@opensrp/fhir-helpers';
import { hasCode } from '../utils';

export interface InventoryViewProps {
  fhirBaseUrl: string;
  locationId: string;
}

/**
 * Returns an object that can be easily consumed that represents an inventory resource
 *
 * @param group - inventory group resource to be parsed
 */
function parseInventoryGroup(group: IGroup) {
  const { member, characteristic, identifier } = group;

  const sanitizeDate = (dateString?: string) => {
    if (!dateString) return;
    const sampleDate = new Date(dateString);
    if (isNaN(sampleDate.getTime())) return;
    return sampleDate;
  };

  // invariant one member representing the product
  const firstMember = member?.[0];
  const productReference = firstMember?.entity.reference;
  const startDate = firstMember?.period?.start as string | undefined;
  const endDate = firstMember?.period?.end as string | undefined;
  const poNumberIdentifier = identifier?.filter((id) => {
    return (id.type?.coding ?? []).indexOf(poNumberIdentifierCoding);
  });

  const sectionCharacteristic = getCharacteristicWithCoding(
    characteristic ?? [],
    sectionCharacteristicCoding
  );
  const donorCharacteristic = getCharacteristicWithCoding(
    characteristic ?? [],
    donorCharacteristicCoding
  );

  const quantityCharacteristic = getCharacteristicWithCoding(
    characteristic ?? [],
    quantityCharacteristicCoding
  );

  return {
    productReference,
    quantity: quantityCharacteristic?.valueQuantity?.value,
    poNumber: poNumberIdentifier?.[0]?.value,
    deliveryDate: sanitizeDate(startDate),
    accountabilityEndDate: sanitizeDate(endDate),
    unicefSection: sectionCharacteristic?.valueCodeableConcept?.text,
    donor: donorCharacteristic?.valueCodeableConcept?.text,
  };
}

/**
 * extracts required fields from a group product catalogue resource
 *
 * @param group - group resource to be parsed
 */
function parseProductGroup(group: IGroup) {
  const { name, identifier } = group;

  const serialNumberIdentifier = identifier?.filter((id) => {
    return (id.type?.coding ?? []).indexOf(poNumberIdentifierCoding);
  });
  return {
    productName: name,
    serialNumber: serialNumberIdentifier?.[0]?.value,
  };
}

type TableData = ReturnType<typeof parseInventoryGroup> & ReturnType<typeof parseProductGroup>;

/**
 * checks if Group resource has a coding that identifies it as an inventory
 *
 * @param res - group resource to be checked
 */
function isInventory(res: IGroup) {
  return hasCode(res.code?.coding ?? [], inventoryGroupCoding);
}

/**
 * checks if Group resource has a coding that identifies is as a product
 *
 * @param res - group resource to be checked
 */
function isProduct(res: IGroup) {
  return hasCode(res.code?.coding ?? [], productCoding);
}

/**
 * A data mapper that generates table data source from bundle response that fetches service point inventory
 *
 * @param bundleResponse - api response
 */
function dataTransformer(bundleResponse: IBundle) {
  const entry = (bundleResponse.entry ?? []).map((x) => x.resource) as IGroup[];
  const tableDataByProductRef: Record<string, Record<string, unknown> | undefined> = {};

  for (const resource of entry) {
    if (isInventory(resource)) {
      const tableDataEntry = parseInventoryGroup(resource as IGroup);
      const { productReference } = tableDataEntry;
      if (productReference) {
        if (tableDataByProductRef[productReference] !== undefined) {
          tableDataByProductRef[productReference] = {
            ...tableDataByProductRef[productReference],
            ...tableDataEntry,
          };
        } else {
          tableDataByProductRef[productReference] = tableDataEntry;
        }
      }
    }
    if (isProduct(resource)) {
      const thisResource = resource as IGroup;
      const tableDataEntry = parseProductGroup(thisResource);
      const productReference = `${groupResourceType}/${thisResource.id}`;
      if (tableDataByProductRef[productReference] === undefined) {
        tableDataByProductRef[productReference] = tableDataEntry;
      } else {
        tableDataByProductRef[productReference] = {
          ...tableDataByProductRef[productReference],
          ...tableDataEntry,
        };
      }
    }
  }
  return Object.values(tableDataByProductRef as Record<string, TableData>);
}

/**
 * filter to implement custom search
 *
 * @param obj - obj to filter
 * @param search - search string
 */
function matchesSearch(obj: TableData, search: string) {
  return (obj.productName ?? '').toLowerCase().includes(search.toLowerCase());
}

export const InventoryView = ({ fhirBaseUrl, locationId }: InventoryViewProps) => {
  const { t } = useTranslation();
  const history = useHistory();

  const {
    queryValues: { data, isLoading, error },
    tablePaginationProps,
    searchFormProps,
  } = useTabularViewWithLocalSearch<TableData>(
    fhirBaseUrl,
    listResourceType,
    {
      subject: locationId,
      _include: 'List:item',
      '_include:recurse': 'Group:member',
    },
    matchesSearch,
    dataTransformer
  );

  if (error && !data) {
    return <Alert type="error">{t('An error occurred while fetching inventory')}</Alert>;
  }

  const columns: Column<TableData>[] = [
    {
      title: t('Product name'),
      dataIndex: 'productName' as const,
      key: 'productName' as const,
      sorter: (rec1: TableData, rec2: TableData) => {
        if (rec1.productName && rec2.productName) {
          if (rec1.productName > rec2.productName) {
            return -1;
          }
          if (rec1.productName < rec2.productName) {
            return 1;
          }
        }

        return 0;
      },
      defaultSortOrder: 'descend',
    },
    {
      title: t('Qty'),
      dataIndex: 'quantity' as const,
      key: 'quantity' as const,
    },
    {
      title: t('PO no.'),
      dataIndex: 'poNumber' as const,
      key: 'poNumber' as const,
    },
    {
      title: t('Serial no.'),
      dataIndex: 'serialNumber' as const,
      key: 'serialNumber' as const,
    },
    {
      title: t('Delivery dt.'),
      dataIndex: 'deliveryDate' as const,
      key: 'deliveryDate' as const,
    },
    {
      title: t('Acct. end dt.'),
      dataIndex: 'accountabilityEndDate' as const,
      key: 'accountabilityEndDate' as const,
    },
    {
      title: t('Unicef section'),
      dataIndex: 'unicefSection' as const,
      key: 'unicefSection' as const,
    },
    {
      title: t('Donor'),
      dataIndex: 'donor' as const,
      key: 'donor' as const,
    },
    {
      title: t('Actions'),
      // eslint-disable-next-line react/display-name
      render: (_: unknown) => (
        <span className="d-flex align-items-center">
          <RbacCheck permissions={['Group.update']}>
            <>
              <Link to={`#`} className="m-0 p-1">
                {t('Edit')}
              </Link>
              <Divider type="vertical" />
            </>
          </RbacCheck>
        </span>
      ),
      width: '20%',
    },
  ];

  const tableProps = {
    datasource: data ?? [],
    columns,
    loading: isLoading,
    size: 'small' as const,
    tablePaginationProps,
  };

  return (
    <Row data-testid="inventory-tab" className="list-view">
      <Col style={{ width: '100%' }}>
        <div className="main-content__header">
          <SearchForm data-testid="search-form" {...searchFormProps} />
          <RbacCheck permissions={['Group.create']}>
            <Button type="primary" disabled onClick={() => history.push('#')}>
              <PlusOutlined />
              {t('Add Inventory')}
            </Button>
          </RbacCheck>
        </div>
        <TableLayout {...tableProps} />
      </Col>
    </Row>
  );
};
