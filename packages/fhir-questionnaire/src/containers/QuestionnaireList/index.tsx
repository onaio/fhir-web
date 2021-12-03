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
// import { TablePaginationConfig } from 'antd/lib/table/Table';

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
      <Link to={`${'qrList'}/${record.id}`}>View Questionnaire Responses</Link>
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
  const dateSorter = (a: string, b: string) => new Date(a).getTime() - new Date(b).getTime();
  const columns: Column<Questionnaire>[] = [
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
      title: 'Effective period',
      children: [
        {
          title: 'Start',
          dataIndex: ['effectivePeriod', 'start'],
          key: 'start',
          sorter: dateSorter,
        },
        {
          title: 'End',
          dataIndex: ['effectivePeriod', 'end'],
          key: 'end',
          sorter: dateSorter,
        },
      ],
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

  if (isLoading) {
    return <Spin size="large" className="custom-spinner" />;
  }

  // // if (error && !data) {
  // //   return <BrokenPage errorMessage={'Problem loading data'} />;
  // // }

  const tableProps = {
    pagination: {
      total: 36,
      onChange: (current: number, pageSize?: number) => {
        if (current && pageSize) {
          setPaginationPageSize(pageSize);
          setCurrentPage(current);
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
