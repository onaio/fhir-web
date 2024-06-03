import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Row, Col } from 'antd';
import { BodyLayout, useSearchParams, viewDetailsQuery } from '@opensrp/react-utils';
import { Column, TableLayout } from '@opensrp/react-utils';
import { BrokenPage, SearchForm } from '@opensrp/react-utils';
import { useSimpleTabularView } from '@opensrp/react-utils';
import { IPatient } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPatient';
import { patientResourceType } from '../../constants';
import { useTranslation } from '../../mls';
import {
  parsePatient,
  serverSideSortedColumns,
  sortMap,
} from '../PatientDetails/ResourceSchema/Patient';
import { FilterValue, SorterResult, TablePaginationConfig } from 'antd/lib/table/interface';
import { get } from 'lodash';
import { PatientDetailsOverview } from '../PatientDetailsOverview';

interface PatientListProps {
  fhirBaseURL: string;
}

/**
 * Component which shows the list of all patients in FHIR server
 *
 * @param {Object} props - UserGoupsList component props
 * @returns {Function} returns patients list display
 */
export const PatientsList = (props: PatientListProps) => {
  const { fhirBaseURL } = props;
  const { t } = useTranslation();
  const { addParams } = useSearchParams();

  const [fhirSortFilters, setFhirSortFilters] = useState<Record<'_sort', string>>();
  const { searchFormProps, tablePaginationProps, queryValues } = useSimpleTabularView<IPatient>(
    fhirBaseURL,
    patientResourceType,
    fhirSortFilters
  );
  const { data, isFetching, isLoading, error } = queryValues;

  if (error && !data) {
    return <BrokenPage errorMessage={(error as Error).message} />;
  }

  const tableData = (data?.records ?? []).map((patient: IPatient) => {
    const patientValues = parsePatient(patient);
    return {
      ...patientValues,
      key: patientValues.id,
    };
  });

  type TableData = typeof tableData[0];

  const showPatientOverview = (id: string) => {
    addParams({ [viewDetailsQuery]: id });
  };
  const tableProps = {
    datasource: tableData,
    columns: serverSideSortedColumns(t, showPatientOverview) as Column<TableData>[],
    loading: isFetching || isLoading,
    pagination: tablePaginationProps,
    onChange: (
      _: TablePaginationConfig,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      __: Record<string, FilterValue | null>,
      sorter: SorterResult<TableData> | SorterResult<TableData>[]
    ) => {
      const sorters = Array.isArray(sorter) ? sorter : [sorter];
      const sortQueryString = sorters.reduce((acc: string, value: SorterResult<TableData>) => {
        const { field, order } = value;
        const sortableKey = get(sortMap, field as string);
        if (!sortableKey) {
          return acc;
        }
        if (order && order === 'ascend') {
          return `${acc}${sortableKey}`;
        } else if (order) {
          return `${acc}-${sortableKey}`;
        }
        return acc;
      }, '');
      if (sortQueryString) {
        setFhirSortFilters({ _sort: sortQueryString });
      }
    },
  };
  const pageTitle = 'Patients';
  const headerProps = {
    pageHeaderProps: {
      title: pageTitle,
      onBack: undefined,
    },
  };

  return (
    <BodyLayout headerProps={headerProps}>
      <Helmet>
        <title>{t('Patients')}</title>
      </Helmet>
      <div className="main-content__table">
        <div className="main-content__header">
          <SearchForm {...searchFormProps} />
        </div>
        <Row className="list-view">
          <Col className={'main-content'}>
            <TableLayout {...tableProps} />
          </Col>
          <PatientDetailsOverview fhirBaseURL={fhirBaseURL} />
        </Row>
      </div>
    </BodyLayout>
  );
};
