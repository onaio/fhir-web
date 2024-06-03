import { render, screen, fireEvent } from '@testing-library/react';
import { ResourceDetails } from '..';
import React from 'react';
import { Button } from 'antd';

const props = {
  title: 'Good Health Clinic',
  headerLeftData: { ID: 123, version: 5 },
  headerLeftDataClasses: 'left-data',
  headerRightData: { 'Date created': 'Today, 9.30' },
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
      <Button type="link" onClick={() => mockFunction()}>
        view details
      </Button>
    </div>
  ),
};

const mockFunction = jest.fn();

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

  const headerRightData = [...document.querySelectorAll('.singleKeyValue-pair__light')].map(
    (keyValue) => keyValue.textContent
  );
  expect(headerRightData).toEqual(['Date createdToday, 9.30']);

  const headerLeftElementValues = [...document.querySelectorAll('.left-data')].map(
    (keyValue) => keyValue.textContent
  );
  expect(headerLeftElementValues).toEqual(['ID: 123version: 5']);

  // Test Status Tag
  expect(screen.getByText(/Active/)).toBeInTheDocument();
  expect(document.querySelector('.ant-tag-green')).toBeInTheDocument()

  // Test Footer Button Click
  fireEvent.click(screen.getByText('view details'));
  expect(mockFunction).toHaveBeenCalled();
});

// New test case for bodyData as a render prop
test('ResourceDetails component renders bodyData as a render prop', () => {
  const renderPropProps = {
    ...props,
    bodyData: () => <div>Rendered Content from Prop</div>, // Using bodyData as a render prop
  };

  render(<ResourceDetails {...renderPropProps} />);

  // Check if the rendered content from the bodyData render prop is in the document
  expect(screen.getByText(/Rendered Content from Prop/)).toBeInTheDocument();
});
