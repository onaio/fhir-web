//* eslint-disable @typescript-eslint/no-explicit-any */
import { mount } from 'enzyme';
import React, { useState } from 'react';
import { PaginateData } from '..';
import { QueryClient, QueryClientProvider } from 'react-query';
import { act } from 'react-dom/test-utils';
import flushPromises from 'flush-promises';
import { TableProps } from 'antd/lib/table';

describe('components/PaginateData', () => {
  interface TableData {
    name: string;
    id: number;
  }

  const data: TableData[] = Array(26)
    .fill(undefined)
    .map((_, i) => ({ id: i + 1, name: String.fromCharCode(97 + i) }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const MockComponent: React.FC<any> = jest.fn(
    (data: TableProps<TableData> & { fetchNextPage: Function; fetchPreviousPage: Function }) => {
      return (
        <div>
          <div id="page">page = {data.pagination !== false && data.pagination.current}</div>
          <div id="page">pageSize = {data.pagination !== false && data.pagination.pageSize}</div>
          <div id="Mock">Mock Component</div>
          <div
            id="page-1"
            onClick={() =>
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
              data.pagination !== false && data.pagination.onChange(1, data.pagination.pageSize)
            }
          >
            Fetch Page 1
          </div>
          <div
            id="page-3"
            onClick={() =>
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
              data.pagination !== false && data.pagination.onChange(3, data.pagination.pageSize)
            }
          >
            Fetch Page 3
          </div>
          <div id="prev" onClick={() => data.fetchPreviousPage()}>
            prev
          </div>
          <div id="next" onClick={() => data.fetchNextPage()}>
            next
          </div>
        </div>
      );
    }
  );

  it('renders Component', async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const mockqueryfn = jest.fn((page: number, pagesize: number) => {
      const first = (page - 1) * pagesize;
      const resp = data.slice(first, first + pagesize);
      return Promise.resolve(resp);
    });

    const wrapper = mount(
      <QueryClientProvider client={queryClient}>
        <PaginateData
          queryFn={mockqueryfn}
          queryid="queryid"
          currentPage={2}
          pageSize={10}
          total={() => Promise.resolve(500)}
        >
          {(pram) => <MockComponent {...pram} />}
        </PaginateData>
      </QueryClientProvider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(mockqueryfn).toHaveBeenLastCalledWith(2, 10, undefined);
    expect(MockComponent).toHaveBeenLastCalledWith(
      {
        datasource: [
          { id: 11, name: 'k' },
          { id: 12, name: 'l' },
          { id: 13, name: 'm' },
          { id: 14, name: 'n' },
          { id: 15, name: 'o' },
          { id: 16, name: 'p' },
          { id: 17, name: 'q' },
          { id: 18, name: 'r' },
          { id: 19, name: 's' },
          { id: 20, name: 't' },
        ],
        fetchNextPage: expect.any(Function),
        fetchPreviousPage: expect.any(Function),
        loading: false,
        pagination: { current: 2, onChange: expect.any(Function), pageSize: 10, total: 500 },
      },
      {}
    );
  });

  it('Search Query is correctly generated', async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const mockqueryfn = jest.fn((page: number, pagesize: number) => {
      const first = (page - 1) * pagesize;
      const resp = data.slice(first, first + pagesize);
      return Promise.resolve(resp);
    });

    const wrapper = mount(
      <QueryClientProvider client={queryClient}>
        <PaginateData
          queryFn={mockqueryfn}
          queryid="id"
          queryPram={{
            string: 'value',
            string2: 'value2',
            empty: '',
            number99: 99,
            number0: 0,
            false: false,
            undefined: undefined,
            null: null,
          }}
        >
          {(data) => <MockComponent {...data} />}
        </PaginateData>
      </QueryClientProvider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(mockqueryfn).toBeCalledWith(
      1,
      5,
      '&string=value&string2=value2&number99=99&number0=0&false=false&null=null'
    );
  });

  it('Specific Page Fetch', async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const mockqueryfn = jest.fn((page: number, pagesize: number) => {
      const first = (page - 1) * pagesize;
      const resp = data.slice(first, first + pagesize);
      return Promise.resolve(resp);
    });

    const wrapper = mount(
      <QueryClientProvider client={queryClient}>
        <PaginateData queryFn={mockqueryfn} currentPage={2} queryid="id">
          {(data) => <MockComponent {...data} />}
        </PaginateData>
      </QueryClientProvider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
      wrapper.find('#page-3').simulate('click');
    });

    expect(mockqueryfn).toHaveBeenLastCalledWith(3, 5, undefined);
  });

  it('Fetch next page', async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const mockqueryfn = jest.fn((page: number, pagesize: number) => {
      const first = (page - 1) * pagesize;
      const resp = data.slice(first, first + pagesize);
      return Promise.resolve(resp);
    });

    const wrapper = mount(
      <QueryClientProvider client={queryClient}>
        <PaginateData queryFn={mockqueryfn} currentPage={2} queryid="id">
          {(data) => <MockComponent {...data} />}
        </PaginateData>
      </QueryClientProvider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    wrapper.find('#next').simulate('click');

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(mockqueryfn).toHaveBeenLastCalledWith(3, 5, undefined);
  });

  it('Fetch Prev page', async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const mockqueryfn = jest.fn((page: number, pagesize: number) => {
      const first = (page - 1) * pagesize;
      const resp = data.slice(first, first + pagesize);
      return Promise.resolve(resp);
    });

    const wrapper = mount(
      <QueryClientProvider client={queryClient}>
        <PaginateData queryFn={mockqueryfn} currentPage={3} queryid="id">
          {(data) => <MockComponent {...data} />}
        </PaginateData>
      </QueryClientProvider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    wrapper.find('#prev').simulate('click');

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(mockqueryfn).toHaveBeenLastCalledWith(2, 5, undefined);
  });

  it('page reset to 1 after query changes', async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const mockqueryfn = jest.fn((page: number, pagesize: number) => {
      const start = (page - 1) * pagesize;
      const resp = data.slice(start, start + pagesize);
      return Promise.resolve(resp);
    });

    const MockView: React.FC = () => {
      const [inputVal, setInputVal] = useState('');
      return (
        <div>
          <input type="text" onChange={({ target: { value } }) => setInputVal(value)} />
          <PaginateData
            queryFn={mockqueryfn}
            currentPage={2}
            queryid="id"
            queryPram={{ searchPram: inputVal }}
          >
            {(data) => <MockComponent {...data} />}
          </PaginateData>
        </div>
      );
    };

    const wrapper = mount(
      <QueryClientProvider client={queryClient}>
        <MockView />
      </QueryClientProvider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    wrapper.find('#page-3').simulate('click');

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    wrapper.find('input').simulate('change', { target: { value: 'testname' } });

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(mockqueryfn).nthCalledWith(1, 2, 5, '');
    expect(mockqueryfn).nthCalledWith(2, 3, 5, '');
    expect(mockqueryfn).nthCalledWith(3, 1, 5, '&searchPram=testname');
  });
});
