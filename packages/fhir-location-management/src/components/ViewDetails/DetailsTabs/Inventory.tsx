import React, { ChangeEvent } from 'react';
import { useMls } from '../../../mls';
import {
  TableLayout,
  useTabularViewWithLocalSearch,
  SearchForm,
  Column,
} from '@opensrp/react-utils';
import { Alert, Button, Col, Divider, Radio, Row, Space, Typography } from 'antd';
import { IGroup } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IGroup';
import { accEndDateFilterKey, listResourceType, nameFilterKey } from '../../../constants';
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
  serialNumberIdentifierCoding,
} from '@opensrp/fhir-helpers';
import { hasCode } from '../utils';
import { Reference } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/reference';
import { ADD_LOCATION_INVENTORY } from '@opensrp/fhir-group-management';

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
  const { member, characteristic, identifier, id } = group;
  const sanitizeDate = (dateString?: string) => {
    if (!dateString) return;
    const sampleDate = new Date(dateString);
    if (isNaN(sampleDate.getTime())) return;
    return sampleDate.toLocaleDateString();
  };

  // invariant one member representing the product
  const firstMember = member?.[0];
  const productReference = (firstMember?.entity as Reference | undefined)?.reference;
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

  const serialNumberIdentifier = identifier?.filter((id) => {
    const hasCoding = id.type?.coding?.some(
      (coding) => coding.code === serialNumberIdentifierCoding.code
    );
    return hasCoding;
  });

  return {
    id,
    productReference,
    quantity: quantityCharacteristic?.valueQuantity?.value,
    poNumber: poNumberIdentifier?.[0]?.value,
    deliveryDate: sanitizeDate(startDate),
    accountabilityEndDate: sanitizeDate(endDate),
    unicefSection: sectionCharacteristic?.valueCodeableConcept?.text,
    donor: donorCharacteristic?.valueCodeableConcept?.text,
    serialNumber: serialNumberIdentifier?.[0]?.value,
  };
}

/**
 * extracts required fields from a group product catalogue resource
 *
 * @param group - group resource to be parsed
 */
function parseProductGroup(group: IGroup) {
  const { name } = group;
  return {
    productName: name,
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
  const inventoryById: Record<string, ReturnType<typeof parseInventoryGroup> | undefined> = {};
  const productById: Record<string, ReturnType<typeof parseProductGroup> | undefined> = {};
  for (const resource of entry) {
    if (isInventory(resource)) {
      inventoryById[resource.id as string] = parseInventoryGroup(resource as IGroup);
    }
    if (isProduct(resource)) {
      productById[`${groupResourceType}/${resource.id}`] = parseProductGroup(resource as IGroup);
    }
  }
  const tableData = [];
  for (const inventory of Object.values(inventoryById)) {
    let tableDataEntry = inventory;
    const productReference = inventory?.productReference;
    const correspondingProductReference = productReference ? productById[productReference] : {};
    if (correspondingProductReference) {
      tableDataEntry = {
        ...tableDataEntry,
        ...correspondingProductReference,
      } as TableData;
    }
    tableData.push(tableDataEntry as TableData);
  }
  return tableData;
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

/**
 * filter products based on accountability period
 *
 * @param obj - obj to filter
 */
function activeInventoryByAccEndDate(obj: TableData) {
  if (obj.accountabilityEndDate === undefined) {
    return true;
  }
  const currentAccEndDate = Date.parse(obj.accountabilityEndDate);
  if (!isNaN(currentAccEndDate)) {
    return currentAccEndDate >= Date.now();
  }
  return false;
}

export const InventoryView = ({ fhirBaseUrl, locationId }: InventoryViewProps) => {
  const { t } = useMls();
  const history = useHistory();

  const {
    queryValues: { data, isLoading, error },
    tablePaginationProps,
    searchFormProps: rawSearchFormProps,
    filterOptions: { registerFilter, deregisterFilter, filterRegistry },
  } = useTabularViewWithLocalSearch<TableData>(
    fhirBaseUrl,
    listResourceType,
    {
      subject: locationId,
      _include: 'List:item',
      '_include:recurse': 'Group:member',
    },
    dataTransformer,
    {
      [accEndDateFilterKey]: {
        value: 'active',
        filterFunc: (el) => {
          return activeInventoryByAccEndDate(el);
        },
      },
    }
  );

  if (error && !data.length) {
    return <Alert type="error">{t('An error occurred while fetching inventory')}</Alert>;
  }

  const baseInventoryPath = `${ADD_LOCATION_INVENTORY}/${locationId}`;

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
      render: ({ id }: TableData) => (
        <span className="d-flex align-items-center">
          <RbacCheck permissions={['Group.update']}>
            <>
              <Link to={`${baseInventoryPath}/${id}`} className="m-0 p-1">
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

  const searchFormProps = {
    ...rawSearchFormProps,
    onChangeHandler: (event: ChangeEvent<HTMLInputElement>) => {
      rawSearchFormProps.onChangeHandler(event);
      const searchText = event.target.value;
      if (searchText) {
        registerFilter(
          nameFilterKey,
          (el) => {
            return matchesSearch(el, searchText);
          },
          searchText
        );
      } else {
        deregisterFilter(nameFilterKey);
      }
    },
  };

  const tableProps = {
    datasource: data,
    columns,
    loading: isLoading,
    size: 'small' as const,
    tablePaginationProps,
  };

  const activeValue = 'active';
  const inactiveValue = 'inactive';

  return (
    <Row data-testid="inventory-tab" className="list-view">
      <Col style={{ width: '100%' }}>
        <div className="main-content__header">
          <Space size={'large'}>
            <SearchForm data-testid="search-form" {...searchFormProps} />
            <Space>
              <Typography.Text>{t('Accountability status:')}</Typography.Text>
              <Radio.Group
                size="small"
                value={filterRegistry[accEndDateFilterKey]?.value}
                buttonStyle="solid"
                onChange={(event) => {
                  const val = event.target.value;
                  switch (val) {
                    case activeValue:
                      registerFilter(
                        accEndDateFilterKey,
                        (el) => {
                          return activeInventoryByAccEndDate(el);
                        },
                        val
                      );
                      break;
                    case inactiveValue:
                      registerFilter(
                        accEndDateFilterKey,
                        (el) => {
                          return !activeInventoryByAccEndDate(el);
                        },
                        val
                      );
                      break;
                  }
                }}
              >
                <Radio.Button value={activeValue}>{t('Active')}</Radio.Button>
                <Radio.Button value={inactiveValue}>{t('Inactive')}</Radio.Button>
              </Radio.Group>
            </Space>
          </Space>
          <RbacCheck permissions={['Group.create']}>
            <Button type="primary" onClick={() => history.push(baseInventoryPath)}>
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
