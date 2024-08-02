import { ILocation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ILocation';
import { Space, Select } from 'antd';
import React from 'react';
import { FilterParamState, PaginatedAsyncSelect } from '@opensrp/react-utils';
import { locationResourceType } from '@opensrp/fhir-helpers';
import { useMls } from '.././../mls';
import { Trans } from '@opensrp/i18n';

export interface LocationGridFilterRowRenderProps {
  fhirBaseUrl: string;
  updateFilterParams: (filter: FilterParamState) => void;
  currentFilters: FilterParamState;
}

const partOfFilterDataIdx = 'partof';
const statusFilterDataIdx = 'status';

export const LocationGridFilterRowRender = (props: LocationGridFilterRowRenderProps) => {
  const { t } = useMls();
  const { fhirBaseUrl, updateFilterParams, currentFilters } = props;
  return (
    <div className="filter-row" data-testid="filter-row">
      <Space>
        <Trans t={t} i18nKey="parentLocationFilter">
          <Space>
            Parent Location:
            <PaginatedAsyncSelect<ILocation>
              allowClear={true}
              showSearch={true}
              resourceType={locationResourceType}
              baseUrl={fhirBaseUrl}
              transformOption={(resource) => {
                return {
                  value: resource.id as string,
                  label: resource.name as string,
                  ref: resource,
                };
              }}
              onChange={(value) => {
                if (!value) {
                  updateFilterParams({ [partOfFilterDataIdx]: undefined });
                } else {
                  updateFilterParams({
                    [partOfFilterDataIdx]: {
                      paramAccessor: 'partof',
                      rawValue: value,
                      paramValue: value,
                    },
                  });
                }
              }}
            />
          </Space>
        </Trans>
        <Trans t={t} i18nKey="locationStatusFilter">
          <Space>
            Status:
            <Select
              id="location-status-filter"
              value={currentFilters['status']?.rawValue ?? '*'}
              style={{ width: 120 }}
              onChange={(value: string) => {
                if (value === '*') {
                  updateFilterParams({ [statusFilterDataIdx]: undefined });
                  return;
                }
                updateFilterParams({
                  [statusFilterDataIdx]: {
                    paramAccessor: 'status',
                    rawValue: value,
                    paramValue: value,
                  },
                });
              }}
              options={[
                { value: 'active', label: t('Active') },
                { value: 'inactive', label: t('Inactive') },
                { value: '*', label: t('Show all') },
              ]}
            />
          </Space>
        </Trans>
      </Space>
    </div>
  );
};
