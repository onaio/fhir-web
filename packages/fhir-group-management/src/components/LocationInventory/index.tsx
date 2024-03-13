import React from 'react';
import { useTranslation } from '../../mls';
import { Helmet } from 'react-helmet';
import { PageHeader, useSimpleTabularView, BrokenPage } from '@opensrp/react-utils';
import { AddLocationInventoryForm } from './form';
import { groupResourceType } from '../../constants';
import { supplyMgSnomedCode, snomedCodeSystem } from '../../helpers/utils';
import { IGroup } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IGroup';

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

  const {
    queryValues: { data, error },
  } = useSimpleTabularView<IGroup>(fhirBaseURL, groupResourceType, extraQueryFilters);

  if (error && !data) {
    return <BrokenPage errorMessage={(error as Error).message} />;
  }

  const formProps = {
    fhirBaseURL,
    products: data?.records,
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
