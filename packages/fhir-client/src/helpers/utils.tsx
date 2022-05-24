import { Typography, Tooltip } from 'antd';
import { Period } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/period';
import { Coding } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/coding';
import { Column, TableLayout } from '@opensrp/react-utils';
import { CodeableConcept } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/codeableConcept';
import React from 'react';
import { useTranslation } from '../mls';

const { Text } = Typography;

/**
 * Abstracts sort functionality for dates as strings
 *
 * @param d1 - the first date string
 * @param d2 - the second date string
 */
export const dateStringSorterFn = (d1: string, d2: string) => Date.parse(d1) - Date.parse(d2);

/**
 * Abstracts sort functionality for dates as strings
 *
 * @param a - first string
 * @param b - second string
 */
export const rawStringSorterFn = (a: string, b: string) => a.localeCompare(b);

/**
 * Abstracts how to render a Fhir Period data type
 *
 * @param props - Period object
 */
export const FhirPeriod = (props: Period) => {
  const { start, end } = props;
  const { t } = useTranslation();
  return (
    <>
      <Text>{t('{{val, datetime}}', { val: new Date(start ?? '') })}</Text>-
      <Text>{t('{{val, datetime}}', { val: new Date(end ?? '') })}</Text>
    </>
  );
};

/**
 * Abstracts how Codings will be rendered
 *
 * @param root0 - props
 * @param root0.codings -  the codings
 */
export const FhirCodesTooltips = ({ codings }: { codings?: Coding[] }) => {
  return (
    <>
      {(codings ?? []).map((coding) => {
        return (
          <Tooltip key={coding.code} title={coding.system || ''}>
            <span>{coding.display}</span>
          </Tooltip>
        );
      })}
    </>
  );
};

/**
 * normalize codeCodeable concept representation
 *
 * @param concepts - codecodeableConcept
 */
export const getCodeableConcepts = (concepts?: CodeableConcept[] | CodeableConcept) => {
  const arrayConcepts = concepts ? (Array.isArray(concepts) ? concepts : [concepts]) : [];
  const rtn = arrayConcepts
    .map((codeableConcept) => {
      return codeableConcept.coding ?? [];
    })
    .flat();
  return rtn;
};

interface PatientDetailsTableProps<T, ParsedType> {
  resources: T[];
  parseResource: (resource: T) => ParsedType;
  columns: Column<ParsedType>[];
}

/**
 * Renders simple table
 *
 * @param props - component props
 */
export function PatientDetailsTable<T, ParsedType>(props: PatientDetailsTableProps<T, ParsedType>) {
  const { resources, parseResource, columns } = props;
  const tableProps = {
    datasource: resources.map(parseResource),
    columns,
  };
  return <TableLayout {...tableProps}></TableLayout>;
}
