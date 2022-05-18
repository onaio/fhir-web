import React from 'react';
import { Helmet } from 'react-helmet';
import { Row, Col, PageHeader } from 'antd';
import { Column, TableLayout } from '@opensrp/react-utils';
import { BrokenPage, SearchForm } from '@opensrp/react-utils';
import { useSimpleTabularView } from '@opensrp/react-utils';
import { IPatient } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPatient';
import { patientResourceType } from '../../constants';
import { parsePatient, columns } from '../PatientDetails/ResourceSchema/Patient';
import { useTranslation } from '../../mls';

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

  const { searchFormProps, tablePaginationProps, queryValues } = useSimpleTabularView<IPatient>(
    fhirBaseURL,
    patientResourceType
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

  const tableProps = {
    datasource: tableData,
    columns: columns(t) as Column<TableData>[],
    loading: isFetching || isLoading,
    pagination: tablePaginationProps,
  };

  return (
    <div className="content-section">
      <Helmet>
        <title>{t('Patients')}</title>
      </Helmet>
      <PageHeader title={t('Patients')} className="page-header" />
      <Row className="list-view">
        <Col className={'main-content'} span={24}>
          <div className="main-content__header">
            <SearchForm {...searchFormProps} />
          </div>
          <TableLayout {...tableProps} />
        </Col>
      </Row>
    </div>
  );
};
