import { Typography, Tooltip } from 'antd';
import { Period } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/period';
import { Coding } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/coding';
import { Column, TableLayout } from '@opensrp/react-utils';
import { CodeableConcept } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/codeableConcept';
import React from 'react';
import { useTranslation } from '../mls';
import { get } from 'lodash';

const { Text } = Typography;

/**
 * Abstracts sort functionality for dates as strings
 *
 * @param accessor - the key name
 * @param isDate - if the string represents a date
 */
export const sorterFn =
  (accessor: string, isDate = false) =>
  (a: Record<string, unknown>, b: Record<string, unknown>) => {
    const first = get(a, accessor) as string | undefined;
    const second = get(b, accessor) as string | undefined;
    if (first === undefined) return 1;
    if (second === undefined) return -1;
    if (isDate) {
      return Date.parse(first) - Date.parse(second);
    } else {
      return first.localeCompare(second);
    }
  };

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
