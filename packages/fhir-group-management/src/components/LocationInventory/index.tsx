import React from 'react';
import { useTranslation } from '../../mls';
import { Helmet } from 'react-helmet';
import { PageHeader, BrokenPage, getResourcesFromBundle } from '@opensrp/react-utils';
import { AddLocationInventoryForm } from './form';
import { groupResourceType } from '../../constants';
import { supplyMgSnomedCode, snomedCodeSystem } from '../../helpers/utils';
import { IGroup } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IGroup';
import { FHIRServiceClass } from '@opensrp/react-utils';
import { useQuery } from 'react-query';
import { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';

interface AddLocationInventoryProps {
  fhirBaseURL: string;
}

const extraQueryFilters = {
  code: `${snomedCodeSystem}|${supplyMgSnomedCode}`,
};

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

  const productQuery = useQuery([groupResourceType], async () =>
    new FHIRServiceClass<IBundle>(fhirBaseURL, groupResourceType).list(extraQueryFilters)
  );

  if (productQuery.error && !productQuery.data && !productQuery.isLoading) {
    return <BrokenPage errorMessage={(productQuery.error as Error).message} />;
  }

  const products = productQuery.data ? getResourcesFromBundle<IGroup>(productQuery.data) : [];

  const formProps = {
    fhirBaseURL,
    products,
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
