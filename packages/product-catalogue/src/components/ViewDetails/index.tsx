import { ProductCatalogue } from '../../ducks/productCatalogue';
import React from 'react';
import { Col } from 'antd';
import { Resource404 } from '@opensrp/react-utils';
import { Dictionary } from '@onaio/utils';
import lang, { Lang } from '../../lang';
import { CloseOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router';
import { Button } from 'antd';
import { CATALOGUE_LIST_VIEW_URL } from '../../constants';
import './index.css';

/**
 * helper function that creates a list of key,value pairs.
 * This pairs are iterated and displayed as they are.
 *
 * @param  product - a single product object
 * @param langObj - the translation obj lookup
 * @returns  - the mapping inform of an array
 */
export const defaultExtractViewDetails = (product: ProductCatalogue, langObj: Lang = lang) => {
  const mapping: Dictionary = {};
  mapping[langObj.PRODUCT_NAME] = product.productName;
  mapping[langObj.UNIQUE_ID] = product.uniqueId;
  mapping[langObj.MATERIAL_NUMBER] = product.materialNumber;
  mapping[langObj.SERVER_VERSION] = product.serverVersion;
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
  const history = useHistory();

  if (objectId === '') {
    return null;
  }

  return (
    <Col className="view-details-content">
      <div className="flex-right">
        <Button
          icon={<CloseOutlined />}
          className="display-block"
          onClick={() => history.push(CATALOGUE_LIST_VIEW_URL)}
        />
      </div>
      {objectId && !object ? (
        <Resource404></Resource404>
      ) : (
        <div className="p-10">
          {extractViewDetails(object as ProductCatalogue).map(([key, val]) => {
            return (
              <div key={`${key}-${val}`} className="mb-3">
                <p className="panel-label">{key}</p>
                <p className="mb-0 panel-value">{`${val}`}</p>
              </div>
            );
          })}
        </div>
      )}
    </Col>
  );
};

ViewDetails.defaultProps = defaultProps;

export { ViewDetails };
