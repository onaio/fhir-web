import { renderHook, act } from '@testing-library/react-hooks';
import { useClientSideDataGridFilters } from '../useClientSideDataGridFilters';
import React from 'react';
import { sampleData } from './fixtures';

test('client data grid filters work correctly', async () => {
  const wrapper = ({ children }) => <div>{children}</div>;

  const { result } = renderHook(() => useClientSideDataGridFilters(sampleData, {}), {
    wrapper,
  });

  // check initial state
  expect(result.error).toBeUndefined();
  expect(result.current).toMatchObject({
    registerFilter: expect.any(Function),
    filteredData: sampleData,
    filterRegistry: {},
    deregisterFilter: expect.any(Function),
  });

  // Add first name filter
  const firstNameFilter = (element) => element.first_name.includes('el');
  act(() => {
    result.current.registerFilter('first_name', firstNameFilter, 'el');
  });
  expect(result.current).toMatchObject({
    registerFilter: expect.any(Function),
    filteredData: sampleData.filter(firstNameFilter),
    filterRegistry: {
      first_name: {
        filterFunc: expect.any(Function),
        value: 'el',
      },
    },
    deregisterFilter: expect.any(Function),
  });

  // Add last name filter
  const lastNameFilter = (element) => element.last_name.includes('ob');
  act(() => {
    result.current.registerFilter('last_name', lastNameFilter, 'ob');
  });
  expect(result.current).toMatchObject({
    registerFilter: expect.any(Function),
    filteredData: sampleData.filter(firstNameFilter).filter(lastNameFilter),
    filterRegistry: {
      first_name: {
        filterFunc: expect.any(Function),
        value: 'el',
      },
      last_name: {
        filterFunc: expect.any(Function),
        value: 'ob',
      },
    },
    deregisterFilter: expect.any(Function),
  });

  // deregister filter
  act(() => {
    result.current.registerFilter('first_name');
  });
  expect(result.current).toMatchObject({
    registerFilter: expect.any(Function),
    filteredData: sampleData.filter(lastNameFilter),
    filterRegistry: {
      last_name: {
        filterFunc: expect.any(Function),
        value: 'ob',
      },
    },
    deregisterFilter: expect.any(Function),
  });

  // deregister filter
  act(() => {
    result.current.deregisterFilter('last_name');
  });
  expect(result.current).toMatchObject({
    registerFilter: expect.any(Function),
    filteredData: sampleData,
    filterRegistry: {},
    deregisterFilter: expect.any(Function),
  });
});
