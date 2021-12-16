import React, { useState } from 'react';
import { Row, Col } from 'antd';
import { Link, useParams } from 'react-router-dom';
import { TableLayout } from '@opensrp/react-utils';
import { Helmet } from 'react-helmet';
import { FHIRServiceClass } from '@opensrp/react-utils';
import {
  questionnaireResourceType,
  // questionnaireResourceType,
  questionnaireResponseResourceType,
  // QUEST_URL,
} from '../../constants';
import { useQuery } from 'react-query';
import { Spin } from 'antd';
import { Column } from '@opensrp/react-utils';
import { Questionnaire } from '../../resources/Questionnaire/Questionnaire';
import { parseResource } from '../../resources/QuestionnaireResponse/questionResponse';
import type { ParsedQuestionnaireResponse } from '../../resources/QuestionnaireResponse/questionResponse';
import type { IQuestionnaireResponse } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IQuestionnaireResponse';

// import { useInfiniteQuery } from 'react-query';
// import { TablePaginationConfig } from 'antd/lib/table/Table';

/** props for the PlansList view */
interface QuestionnaireListProps {
  fhirBaseURL: string;
}

interface RouteProps {
  questId: string;
}

const defaultProps = {};

// /**
//  * component rendered in the action column of the table
//  *
//  * @param record record representing the active record
//  */
// export const ActionsColumnCustomRender: Column<Questionnaire>['render'] = (
//   record: Questionnaire
// ) => {
//   return (
//     <>
//       {/* Assumes the record status is in the routes */}
//       <Link to={`${QUEST_URL}/${record.id}`}></Link>
//     </>
//   );
// };

// eslint-disable-next-line react/display-name
const ActionsColumnCustomRender: Column<ParsedQuestionnaireResponse>['render'] = (
  record: ParsedQuestionnaireResponse
) => {
  return (
    <>
      <Link to={`/${'qr'}/${record.id}`}>View in Form</Link>
    </>
  );
};

/**
 * generates columns for questionnaire rendering component
 *
 * @param questionnaireId
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
      render: (value) => new Intl.DateTimeFormat('en-US').format(new Date(value)), // TODO - dry out, magic string
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

/** component that renders plans */

const QuestionnaireResponseList = (props: QuestionnaireListProps) => {
  const { fhirBaseURL } = props;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [paginationPageSize, setPaginationPageSize] = useState<number>(20);
  const { questId } = useParams<RouteProps>();

  const { data, isLoading } = useQuery(
    ['questionnaireResponses', currentPage, paginationPageSize],
    () =>
      new FHIRServiceClass(fhirBaseURL, questionnaireResponseResourceType).list({
        _getpagesoffset: (currentPage - 1) * paginationPageSize,
        _count: paginationPageSize,
        questionnaire: questId,
      }),
    { keepPreviousData: true, staleTime: 5000 }
  );

  const { isLoading: QuestLoading, data: questData } = useQuery(
    [questionnaireResourceType, questId],
    () => new FHIRServiceClass(fhirBaseURL, questionnaireResourceType).read(questId),
    { refetchOnMount: false, refetchOnWindowFocus: false, refetchOnReconnect: false }
  );

  // TODO:  Prefetch the next page!
  // useEffect(() => {
  //   if (data?.hasMore) {
  //     queryClient.prefetchQuery(['projects', page + 1], () => fetchProjects(page + 1));
  //   }
  // }, []);

  if (isLoading || QuestLoading) {
    return <Spin size="large" className="custom-spinner" />;
  }

  // // if (error && !data) {
  // //   return <BrokenPage errorMessage={'Problem loading data'} />;
  // // }

  const tableProps = {
    pagination: {
      total: data?.total ?? 0,
      onChange: (current: number, pageSize?: number) => {
        if (current && pageSize) {
          setPaginationPageSize(pageSize);
          setCurrentPage(current);
        }
      },
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const resources = (data?.entry?.map((dt) => dt.resource) ?? []) as IQuestionnaireResponse[];
  const tableDataSource = resources.map((res) => parseResource(res));
  const pageTitle = 'Questionnaire Responses';
  const columns = getColumns();
  return (
    <div className="content-section questionnaireList">
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <div>
        <Questionnaire questionnaire={questData as any} />
        <Row className={'list-view pt-0'}>
          <Col className={'main-content'}>
            <TableLayout datasource={tableDataSource} columns={columns} {...tableProps} />
          </Col>
        </Row>
      </div>
    </div>
  );
};

QuestionnaireResponseList.defaultProps = defaultProps;

export { QuestionnaireResponseList };
