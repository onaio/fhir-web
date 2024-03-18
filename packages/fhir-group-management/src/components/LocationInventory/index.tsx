import React from 'react';
import { useTranslation } from '../../mls';
import { Helmet } from 'react-helmet';
import { PageHeader } from '@opensrp/react-utils';
import { AddLocationInventoryForm } from './form';

interface AddLocationInventoryProps {
  fhirBaseURL: string;
}

/**
 * component to add location inventory
 *
 * @param  props - AddLocationInventoryProps component props
 * @returns returns form to add location inventories
 */
export const AddLocationInventory = (props: AddLocationInventoryProps) => {
  const { fhirBaseURL } = props;
  const { t } = useTranslation();
  const pageTitle = t('Add locations Inventory');

  const formProps = {
    fhirBaseURL,
  };

  return (
    <section className="content-section">
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <PageHeader title={pageTitle} />
      <div className="bg-white p-5">
        <AddLocationInventoryForm {...formProps} />
      </div>
    </section>
  );
};
