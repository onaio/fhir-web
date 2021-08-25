/* eslint-disable @typescript-eslint/camelcase */
import { Column, FHIRResponse, Require, TableLayout } from '@opensrp/react-utils';
import { IfhirR4 } from '@smile-cdr/fhirts';

/** interface for Objects */
import React, { useEffect, useRef } from 'react';
import FHIR from 'fhirclient';
import { PaginateData } from '.';

export interface Organization extends Require<IfhirR4.IOrganization, 'id' | 'active' | 'name'> {
  resourceType: 'Organization';
}

export function useTraceUpdate(props: any) {
  const prev = useRef(props);
  useEffect(() => {
    const changedProps = Object.entries(props).reduce((ps: any, [k, v]) => {
      if (prev.current[k] !== v) {
        ps[k] = [prev.current[k], v];
      }
      return ps;
    }, {});
    if (Object.keys(changedProps).length > 0) {
      console.log('Changed props:', changedProps);
    }
    prev.current = props;
  });
}

const columns: Column<Organization>[] = [
  {
    title: 'id',
    dataIndex: 'id',
    // sorter: (a: Organization, b: Organization) => a.name.localeCompare(b.name),
  },
  {
    title: 'Name',
    dataIndex: 'name',
    sorter: (a: Organization, b: Organization) => a.name.localeCompare(b.name),
  },
  {
    title: 'Status',
    dataIndex: 'active',
    // eslint-disable-next-line react/display-name
    render: (value) => <div>{value ? 'Active' : 'Inactive'}</div>,
  },
];

/** Function which shows the list of all teams and there details
 *
 * @param {Object} props - TeamsList component props
 * @returns {Function} returns team display
 */
export const TeamsList: React.FC = () => {
  const serve = FHIR.client('https://fhir.labs.smartregister.org/fhir');

  return (
    <section>
      <h5 className="mb-3">TEAMS</h5>

      <PaginateData<Organization>
        queryid="testing"
        currentPage={1}
        pageSize={5}
        queryFn={(page, size) =>
          serve.request(
            `Organization?_count=${size}&_getpagesoffset=${(page - 1) * size}&_format=json`
          )
        }
        total={(data) => ((data as unknown) as FHIRResponse<Organization>)?.total}
        onSelect={(data: FHIRResponse<Organization> | []) =>
          !Array.isArray(data) ? data.entry.map((e) => e.resource) : data
        }
      >
        {(props) => (
          <TableLayout<Organization>
            {...props}
            columns={columns}
            dataKeyAccessor="id"
            actions={{
              title: 'Actions',
              width: '10%',
              // eslint-disable-next-line react/display-name
              render: (_: unknown, record) => (
                <span className="d-flex justify-content-end align-items-center">action col</span>
              ),
            }}
          />
        )}
      </PaginateData>
    </section>
  );
};

export default TeamsList;
