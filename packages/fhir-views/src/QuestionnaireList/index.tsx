import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { intlFormatDateStrings } from '@opensrp/react-utils';
import { FHIRServiceClass } from '@opensrp/react-utils';
import {
  questionnaireResourceType,
  QUEST_FORM_VIEW_URL,
  QUEST_RESPONSE_VIEW_URL,
} from '../constants';
import { Column } from '@opensrp/react-utils';
import type { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';
import { IQuestionnaire } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IQuestionnaire';
import { SimpleTabularView, SimpleTabularViewProps, TRQuery } from '../SimpleTabularView';

/** props for the PlansList view */
interface QuestionnaireListProps {
  fhirBaseURL: string;
}

/**
 * component rendered in the action column of the table
 *
 * @param record - each data item
 */
export const ActionsColumnCustomRender: Column<IQuestionnaire>['render'] = (
  record: IQuestionnaire
) => {
  return (
    <>
      <Link to={`${QUEST_RESPONSE_VIEW_URL}/${record.id}`}>View Questionnaire Responses</Link>
    </>
  );
};

export const NamesColumnCustomRender: Column<IQuestionnaire>['render'] = (
  record: IQuestionnaire
) => {
  return (
    <>
      <Link to={`${QUEST_FORM_VIEW_URL}/${record.id}/${questionnaireResourceType}`}>
        {record.title ?? record.id ?? ''}
      </Link>
    </>
  );
};

/**
 * generates columns for questionnaire rendering component
 *
 */
export const getColumns = (): Column<IQuestionnaire>[] => {
  const columns: Column<IQuestionnaire>[] = [
    {
      title: 'Name/Id',
      render: NamesColumnCustomRender,
      width: '20%',
    },
    {
      title: 'Status',
      dataIndex: 'status',
    },
    {
      title: 'Publisher',
      dataIndex: 'publisher',
    },
    {
      title: 'Version',
      dataIndex: 'version',
      render: (value, fullObj) => value ?? fullObj?.meta?.versionId ?? '',
    },
    {
      title: 'date',
      dataIndex: 'date',
      render: (value) => intlFormatDateStrings(value),
    },
    {
      title: 'Actions',
      render: ActionsColumnCustomRender,
      width: '20%',
    },
  ];
  return columns;
};

const questionnairesQueryKey = 'questionnaires';

/**
 * api paginated table view listing questionnaires
 *
 * @param props - component props
 */
const QuestionnaireList = (props: QuestionnaireListProps) => {
  const { fhirBaseURL } = props;

  type QueryKeyType = { queryKey: TRQuery };
  const loadQuestionnaires = useCallback(
    async ({ queryKey: [_, page, pageSize] }: QueryKeyType) => {
      return new FHIRServiceClass(fhirBaseURL, questionnaireResourceType).list({
        _getpagesoffset: (page - 1) * pageSize,
        _count: pageSize,
      }) as Promise<IBundle>;
    },
    [fhirBaseURL]
  );

  const simpleTabularViewProps: SimpleTabularViewProps<IQuestionnaire> = {
    queryKey: questionnairesQueryKey,
    rQuery: {
      queryFn: loadQuestionnaires,
      select: (data: IBundle) => ({
        records: (data?.entry?.map((dt) => dt.resource) ?? []) as IQuestionnaire[],
        total: data.total ?? 0,
      }),
      keepPreviousData: true,
      staleTime: 5000,
    },
    pageTitle: 'Questionnaire list view',
    columns: getColumns(),
  };

  return <SimpleTabularView {...simpleTabularViewProps} />;
};

export { QuestionnaireList };
