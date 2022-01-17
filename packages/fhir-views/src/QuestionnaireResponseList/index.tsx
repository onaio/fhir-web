import React, { useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BrokenPage, intlFormatDateStrings } from '@opensrp/react-utils';
import { FHIRServiceClass } from '@opensrp/react-utils';
import {
  questionnaireResourceType,
  questionnaireResponseResourceType,
  QUEST_FORM_VIEW_URL,
} from '../constants';
import { useQuery } from 'react-query';
import { Spin } from 'antd';
import { Column } from '@opensrp/react-utils';
import {
  parseQuestionnaireResponseResource as parseResource,
  Questionnaire,
  ParsedQuestionnaireResponse,
} from '@opensrp/fhir-resources';
import type { IQuestionnaireResponse } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IQuestionnaireResponse';
import type { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';
import { IQuestionnaire } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IQuestionnaire';
import { TRQuery, SimpleTabularViewProps, SimpleTabularView } from '../SimpleTabularView';

/** props for the PlansList view */
export interface QuestionnaireListProps {
  fhirBaseURL: string;
}

export interface RouteProps {
  questId: string;
}

// eslint-disable-next-line react/display-name
const ActionsColumnCustomRender: Column<ParsedQuestionnaireResponse>['render'] = (
  record: ParsedQuestionnaireResponse
) => {
  return (
    <>
      <Link to={`${QUEST_FORM_VIEW_URL}/${record.id}/${questionnaireResponseResourceType}`}>
        View in Form
      </Link>
    </>
  );
};

/**
 * generates columns for questionnaire rendering component
 *
 */
const getColumns = (): Column<ParsedQuestionnaireResponse>[] => {
  const columns: Column<ParsedQuestionnaireResponse>[] = [
    {
      title: 'Submission Id',
      width: '30%',
      dataIndex: 'id',
    },
    {
      title: 'Date authored',
      dataIndex: 'authoredDateTime',
      render: (value) => intlFormatDateStrings(value),
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
    },
    {
      title: 'QuestionnaireVersion',
      dataIndex: 'questionnaireVersion',
    },
    {
      title: 'Actions',
      render: ActionsColumnCustomRender,
      width: '20%',
    },
  ];
  return columns;
};

const questionnaireResQueryKey = 'questionnaireResponses';

/** component that renders plans */

const QuestionnaireResponseList = (props: QuestionnaireListProps) => {
  const { fhirBaseURL } = props;
  const { questId } = useParams<RouteProps>();

  type QueryKeyType = { queryKey: TRQuery };
  const loadQuestResponses = useCallback(
    async ({ queryKey: [_, page, pageSize] }: QueryKeyType) => {
      return new FHIRServiceClass(fhirBaseURL, questionnaireResponseResourceType).list({
        _getpagesoffset: (page - 1) * pageSize,
        _count: pageSize,
        questionnaire: questId,
      }) as Promise<IBundle>;
    },
    [fhirBaseURL, questId]
  );

  const { isLoading: QuestLoading, data: questData, error: questError } = useQuery(
    [questionnaireResourceType, questId],
    () => new FHIRServiceClass(fhirBaseURL, questionnaireResourceType).read(questId),
    { refetchOnMount: false, refetchOnWindowFocus: false, refetchOnReconnect: false }
  );

  if (QuestLoading) {
    return <Spin size="large" className="custom-spinner" />;
  }

  if (questError && !questData) {
    return <BrokenPage errorMessage={'Problem loading questionnaire'} />;
  }

  const simpleTabularViewProps: SimpleTabularViewProps<ParsedQuestionnaireResponse> = {
    queryKey: questionnaireResQueryKey,
    rQuery: {
      queryFn: loadQuestResponses,
      select: (data: IBundle) => {
        const resources = (data?.entry?.map((dt) => dt.resource) ?? []) as IQuestionnaireResponse[];
        const tableDataSource = resources.map((res) => parseResource(res));
        return {
          records: tableDataSource,
          total: data.total ?? 0,
        };
      },
      keepPreviousData: true,
      staleTime: 5000,
    },
    pageTitle: 'Questionnaire Responses',
    columns: getColumns(),
    // eslint-disable-next-line react/display-name
    aboveTableRender: () => <Questionnaire resource={questData as IQuestionnaire} />,
  };

  return <SimpleTabularView {...simpleTabularViewProps} />;
};

export { QuestionnaireResponseList };
