import { render, screen } from '@testing-library/react';
import { ResourceDetails } from '..';
import React from 'react';
import { Button } from 'antd';

const props = {
  title: 'Good Health Clinic',
  headerLeftData: { ID: 123, version: 5 },
  headerLeftDataClasses: 'left-data',
  dateData: { 'Date created': 'Today, 9.30' },
  headerActions: <a href="/patient/edit/123">Edit details</a>,
  status: {
    title: 'Active',
    color: 'green',
  },
  bodyData: {
    'Location name': 'Good Health',
    Alias: 'Clinic',
    'Administrative Level': 2,
  },
  footer: (
    <div>
      <Button type="link">view details</Button>
    </div>
  ),
};

test('ResourceDetails component renders correctly', () => {
  render(<ResourceDetails {...props} />);

  expect(screen.getByText(/Good Health Clinic/)).toBeInTheDocument();
  expect(screen.getByText(/Edit details/)).toBeInTheDocument();
  expect(screen.getByText(/view details/)).toBeInTheDocument();

  const bodyElementValues = [...document.querySelectorAll('.singleKeyValue-pair__default')].map(
    (keyValue) => keyValue.textContent
  );
  expect(bodyElementValues).toEqual([
    'Location nameGood Health',
    'AliasClinic',
    'Administrative Level2',
  ]);

  const dateElementValues = [...document.querySelectorAll('.singleKeyValue-pair__light')].map(
    (keyValue) => keyValue.textContent
  );
  expect(dateElementValues).toEqual(['Date createdToday, 9.30']);

  const headerLeftElementValues = [...document.querySelectorAll('.left-data')].map(
    (keyValue) => keyValue.textContent
  );
  expect(headerLeftElementValues).toEqual(['ID: 123version: 5']);
});
