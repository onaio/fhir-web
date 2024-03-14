import React from 'react';
import { useTranslation } from '../../../../mls';
import {
  TableLayout,
  useTabularViewWithLocalSearch,
  SearchForm,
  Column,
} from '@opensrp/react-utils';
import { Alert, Button, Col, Divider, Row } from 'antd';
import { IGroup } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IGroup';
import { listResourceType } from '../../../../constants';
import { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';
import { Coding, GroupCharacteristic } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/models-r4';
import { isEqual } from 'lodash';
import { RbacCheck } from '@opensrp/rbac';
import { Link, useHistory } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';

export interface InventoryViewProps {
  fhirBaseUrl: string;
  locationId: string;
}

// TODO - not accurate
const poNumberIdentifierCoding = {
  system: 'http://smartregister.org/',
  code: '78991122',
  display: 'Supply Inventory',
};

// TODO - centralize this declarations
const sectionCharacteristicCoding = {
  system: 'http://smartregister.org/',
  code: '98734231',
  display: 'Unicef Section',
};

const donorCharacteristicCoding = {
  system: 'http://smartregister.org/',
  code: '45647484',
  display: 'Donor',
};

// TODO - move to fhir utils
/**
 * finds a characteristic that has the given coding as one of its characteristic.codings
 *
 * @param characteristics - group characteristic
 * @param coding - coding to test for
 */
export function getCharacteristicWithCoding(
  characteristics: GroupCharacteristic[],
  coding: Coding
) {
  for (const characteristic of characteristics) {
    const codings = characteristic.code.coding ?? [];
    for (const thisCoding of codings) {
      if (isEqual(thisCoding, coding)) {
        return characteristic;
      }
    }
  }
}

/**
 * @param group
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
  const quantity = 1; // TODO - fix
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

  return {
    productReference,
    quantity,
    poNumber: poNumberIdentifier?.[0]?.value,
    deliveryDate: sanitizeDate(startDate),
    accountabilityEndDate: sanitizeDate(endDate),
    unicefSection: sectionCharacteristic?.valueCodeableConcept?.text,
    donor: donorCharacteristic?.valueCodeableConcept?.text,
  };
}

/**
 * @param group
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
 * @param res
 */
function isInventory(res: IGroup) {
  // TODO move to constants and magic strings
  const inventoryGroupCoding = {
    system: 'http://smartregister.org/',
    code: '78991122',
    display: 'Supply Inventory',
  };
  return (res.code?.coding ?? []).indexOf(inventoryGroupCoding) !== -1;
}

/**
 * @param group
 */
function isProduct(group: IGroup) {
  // TODO move to constants and magic strings
  const snomedCodeSystem = 'http://snomed.info/sct';
  const supplyMgSnomedCode = '386452003';
  const productCoding = {
    system: snomedCodeSystem,
    code: supplyMgSnomedCode,
    display: 'Supply management',
  };
  return (group.code?.coding ?? []).indexOf(productCoding) !== -1;
}

/**
 * @param bundleResponse
 */
function dataTransformer(bundleResponse: IBundle) {
  const entry = (bundleResponse.entry ?? []).map((x) => x.resource) as IGroup[];
  const tableDataByProductRef: Record<string, Record<string, unknown>> = {};

  for (const resource of entry) {
    if (isInventory(resource)) {
      const tableDataEntry = parseInventoryGroup(resource as IGroup);
      const { productReference } = tableDataEntry;
      if (productReference) {
        if (tableDataByProductRef[productReference]) {
          tableDataByProductRef[productReference] = {
            ...tableDataByProductRef[productReference],
            ...tableDataEntry,
          };
        }
        tableDataByProductRef[productReference] = { ...tableDataEntry };
      }
    }
    if (isProduct(resource)) {
      const thisResource = resource as IGroup;
      const tableDataEntry = parseProductGroup(thisResource);
      // todo - magic string
      const productReference = `${'Group'}/${thisResource.id}`;
      if (!tableDataByProductRef[productReference]) {
        tableDataByProductRef[productReference] = tableDataEntry;
      }
      tableDataByProductRef[productReference] = {
        ...tableDataByProductRef[productReference],
        ...tableDataEntry,
      };
    }
  }
  return Object.values(tableDataByProductRef as Record<string, TableData>);
}

/**
 * @param obj
 * @param search
 */
function matchesSearch(obj: any, search: string) {
  return obj.productName.toLowerCase().includes(search.toLowerCase());
}

export const InventoryView = ({ fhirBaseUrl }: InventoryViewProps) => {
  const { t } = useTranslation();
  const history = useHistory();

  // TODO - migrate to react-utils.

  const {
    queryValues: { data, isLoading, error },
    tablePaginationProps,
    searchFormProps,
  } = useTabularViewWithLocalSearch<TableData>(
    fhirBaseUrl,
    listResourceType,
    {
      _include: 'List:item',
      '_include:recurse': 'Group:member',
    },
    matchesSearch,
    dataTransformer
  );

  if (error && !data) {
    // TODO - change string
    return <Alert type="error">{t('An error occurred while fetching inventory')}</Alert>;
  }

  const columns: Column<TableData>[] = [
    {
      title: t('Product name'),
      dataIndex: 'productName' as const,
      key: 'productName' as const,
      render: (item: TableData) => item.productName,
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
    <Row className="list-view">
      <Col>
        <div className="main-content__header">
          <SearchForm data-testid="search-form" {...searchFormProps} />
          <RbacCheck permissions={['Group.create']}>
            <Button type="primary" onClick={() => history.push('#')}>
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
