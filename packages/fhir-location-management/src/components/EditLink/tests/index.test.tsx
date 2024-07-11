import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import { URL_LOCATION_UNIT_EDIT, URL_SERVICE_POINT_ADD_EDIT } from '../../../constants';
import { EditLink } from '..';
import { Location } from './fixtures';

describe('EditLink', () => {
  it('renders the correct link for building locations', () => {
    const { getByText } = render(
      <Router>
        <EditLink location={Location} editLinkText="Edit" />
      </Router>
    );

    const link = getByText('Edit');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', `${URL_SERVICE_POINT_ADD_EDIT}/303`);
  });

  it('renders the correct link for non-building locations', () => {
    const location = {
      ...Location,
      physicalType: {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/location-physical-type',
            code: 'jdn',
            display: 'Jurisdiction',
          },
        ],
      },
    };

    const { getByText } = render(
      <Router>
        <EditLink location={location} editLinkText="Edit" />
      </Router>
    );

    const link = getByText('Edit');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', `${URL_LOCATION_UNIT_EDIT}/303?back_to=%2F`);
  });
  it('renders custom link text from props', () => {
    const { getByText } = render(
      <Router>
        <EditLink location={Location} editLinkText="Edit details" />
      </Router>
    );

    const link = getByText('Edit details');
    expect(link).toBeInTheDocument();
  });
});
