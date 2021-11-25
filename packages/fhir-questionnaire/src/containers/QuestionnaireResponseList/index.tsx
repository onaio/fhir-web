import React, { useState } from 'react';
import { Row, PageHeader, Col } from 'antd';
import { Link, useParams } from 'react-router-dom';
import { TableLayout } from '@opensrp/react-utils';
import { Helmet } from 'react-helmet';
import { FHIRServiceClass } from '@opensrp/react-utils';
import {
  // questionnaireResourceType,
  questionnaireResponseResourceType,
  // QUEST_URL,
} from '../../constants';
import { useQuery } from 'react-query';
import { Spin } from 'antd';
import { Column } from '@opensrp/react-utils';
import { IfhirR4 } from '@smile-cdr/fhirts';

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
export const NamesColumnCustomCreator: Column<IfhirR4.IQuestionnaireResponse>['render'] = (
  record: IfhirR4.IQuestionnaireResponse
) => {
  return (
    <>
      <Link to={`/${'qr'}/${record.id}`}>{record.id ?? ''}</Link>
    </>
  );
};

/**
 * generates columns for questionnaire rendering component
 *
 * @param questionnaireId
 */
const getColumns = (): Column<IfhirR4.IQuestionnaireResponse>[] => {
  const columns: Column<IfhirR4.IQuestionnaireResponse>[] = [
    {
      title: 'Name/Id',
      render: NamesColumnCustomCreator,
      width: '60%',
    },
    {
      title: 'Status',
      dataIndex: 'status',
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

  // TODO:  Prefetch the next page!
  // useEffect(() => {
  //   if (data?.hasMore) {
  //     queryClient.prefetchQuery(['projects', page + 1], () => fetchProjects(page + 1));
  //   }
  // }, []);

  if (isLoading) {
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
  const tableDataSource = (data?.entry?.map((dt: any) => dt.resource) ??
    []) as IfhirR4.IQuestionnaireResponse[];
  const pageTitle = 'Questionnaire Responses';
  const columns = getColumns();
  return (
    <div className="content-section">
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <PageHeader title={pageTitle} className="page-header"></PageHeader>

      <Row className={'list-view pt-0'}>
        <Col className={'main-content'}>
          <TableLayout datasource={tableDataSource} columns={columns} {...tableProps} />
        </Col>
      </Row>
    </div>
  );
};

QuestionnaireResponseList.defaultProps = defaultProps;

export { QuestionnaireResponseList };
