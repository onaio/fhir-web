import React, { useState } from 'react';
import { Row, PageHeader, Col } from 'antd';
import { Link } from 'react-router-dom';
import { TableLayout } from '@opensrp/react-utils';
import { Helmet } from 'react-helmet';
import { FHIRServiceClass } from '@opensrp/react-utils';
import { questionnaireResourceType, QUEST_URL } from '../../constants';
import { useQuery } from 'react-query';
import { Spin } from 'antd';
import { Questionnaire } from '@helsenorge/skjemautfyller/types/fhir';
import { Column } from '@opensrp/react-utils';
// import { useInfiniteQuery } from 'react-query';
import { TablePaginationConfig } from 'antd/lib/table/Table';

/** props for the PlansList view */
interface QuestionnaireListProps {
  fhirBaseURL: string;
}

const defaultProps = {};

/**
 * component rendered in the action column of the table
 *
 * @param record record representing the active record
 */
export const ActionsColumnCustomRender: Column<Questionnaire>['render'] = (
  record: Questionnaire
) => {
  return (
    <>
      {/* Assumes the record status is in the routes */}
      <Link to={`${QUEST_URL}/${record.id}`}>View Questionnaire Responses</Link>
    </>
  );
};

export const NamesColumnCustomRender: Column<Questionnaire>['render'] = (record: Questionnaire) => {
  return (
    <>
      {/* Assumes the record status is in the routes */}
      <Link to={`${QUEST_URL}/${record.id}`}>{record.title ?? record.id ?? ''}</Link>
    </>
  );
};

/** generates columns for questionnaire rendering component
 *
 */
export const getColumns = (): Column<Questionnaire>[] => {
  const columns: Column<Questionnaire>[] = [
    {
      title: 'Name/Id',
      render: NamesColumnCustomRender,
      width: '60%',
    },
    {
      title: 'Status',
      dataIndex: 'status',
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

const QuestionnaireList = (props: QuestionnaireListProps) => {
  const { fhirBaseURL } = props;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [paginationPageSize, setPaginationPageSize] = useState<number>(20);

  const { data, isLoading } = useQuery(
    ['questionnaires', currentPage, paginationPageSize],
    () =>
      new FHIRServiceClass(fhirBaseURL, questionnaireResourceType).list({
        _getpagesoffset: (currentPage - 1) * paginationPageSize,
        _count: paginationPageSize,
      }),
    { keepPreviousData: true, staleTime: 5000 }
  );


  // TODO:  Prefetch the next page!
  // useEffect(() => {
  //   if (data?.hasMore) {
  //     queryClient.prefetchQuery(['projects', page + 1], () => fetchProjects(page + 1));
  //   }
  // }, []);

  // const {
  //   fetchNextPage,
  //   fetchPreviousPage,
  //   hasNextPage,
  //   hasPreviousPage,
  //   isFetchingNextPage,
  //   isFetchingPreviousPage,
  //   data,
  //   isLoading,
  //   ...result
  // } = useInfiniteQuery(
  //   ['queryKey', paginationPageSize],
  //   ({ pageParam = { pageSize: 20, current: 0 } }) => {
  //     // console.log('QueryContext');
  //     return new FHIRServiceClass(fhirBaseURL, questionnaireResourceType).list({
  //       _getpagesoffset: pageParam.current * paginationPageSize,
  //       _count: pageParam.pageSize, //paginationPageSize,
  //     });
  //   },
  //   {
  //     getNextPageParam: (..._: any) => {
  //       console.log('%%%%%%%%%%%%%%%%%><>>', _);
  //       return (currentPage + 1) * paginationPageSize;
  //     },
  //     getPreviousPageParam: (..._: any) => {
  //       return Math.max(currentPage - 1, 0) * paginationPageSize;
  //     },
  //   }
  // );

  if (isLoading) {
    return <Spin size="large" className="custom-spinner" />;
  }

  // console.log('Result===> ', { ...result, data });
  // const thisPagesData = (data?.pages as any)[currentPage - 1]?.entry as any[];

  // console.log('&&&&&&&&&&&&', data?.pages, currentPage - 1, data?.pages[currentPage]);

  // // const { isLoading, data, error } = useQuery(
  // //   [questionnaireResourceType],
  // //   () => new FHIRServiceClass(fhirBaseURL, questionnaireResourceType).list(),
  // //   {
  // //     select: (res) => res.entry,
  // //   }
  // // );

  // // if (error && !data) {
  // //   return <BrokenPage errorMessage={'Problem loading data'} />;
  // // }

  const tableProps = {
    // total: 36, //(thisPagesData as any).total,
    // fetchNextPage,
    // fetchPreviousPage,
    pagination: {
      total: 36,
      onChange: (current: number, pageSize?: number) => {
        // const { current, pageSize } = paginationDetails;
        if (current && pageSize) {
          setPaginationPageSize(pageSize);
          setCurrentPage(current);
          // (async () => {
          //   return fetchNextPage({ pageParam: { current, pageSize } });
          // })().catch((_) => {
          //   void 0;
          // });
        }
      },
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const tableDataSource = (data?.entry?.map((dt: any) => dt.resource) ?? []) as Questionnaire[];
  const pageTitle = 'Questionnaire list view';
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

QuestionnaireList.defaultProps = defaultProps;

export { QuestionnaireList };
