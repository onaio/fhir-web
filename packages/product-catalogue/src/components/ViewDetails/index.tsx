import { ProductCatalogue } from '../../ducks/productCatalogue';
import React from 'react';
import { Col, Typography, Space } from 'antd';
import { Resource404 } from '@opensrp/react-utils';
import { Dictionary } from '@onaio/utils';

const { Text } = Typography;

/**
 * helper function that creates a list of key,value pairs.
 * This pairs are iterated and displayed as they are.
 *
 * @param {ProductCatalogue} product - a single product object
 * @returns {Dictionary} - the mapping inform of an array
 */
export const defaultExtractViewDetails = (product: ProductCatalogue) => {
  const mapping: Dictionary = {};
  mapping['Product name'] = product.productName;
  mapping['Unique ID'] = product.uniqueId;
  mapping['Material number'] = product.materialNumber;
  mapping['Created'] = 'n/a';
  mapping['Last updated'] = 'n/a';
  mapping['Server version'] = product.serverVersion;
  return Object.entries(mapping);
};

/** typings for the view details component */
export interface ViewDetailsProps {
  object: ProductCatalogue | null;
  objectId: string;
  extractViewDetails: (object: ProductCatalogue) => [string, number | string][];
}

export const defaultProps = {
  object: null,
  objectId: '',
  extractViewDetails: defaultExtractViewDetails,
};

/** component that renders the view details to the right side
 * of list view
 */

const ViewDetails = (props: ViewDetailsProps) => {
  const { object, objectId, extractViewDetails } = props;
  if (objectId === '') {
    return null;
  }

  return (
    <Col className="view-details-content">
      {objectId && !object ? (
        <Resource404></Resource404>
      ) : (
        <Space direction="vertical">
          {extractViewDetails(object as ProductCatalogue).map(([key, val]) => {
            return (
              <>
                <Text strong={true}>{key}</Text>
                <Text>{val}</Text>
              </>
            );
          })}
        </Space>
      )}
    </Col>
  );
};

ViewDetails.defaultProps = defaultProps;

export { ViewDetails };
