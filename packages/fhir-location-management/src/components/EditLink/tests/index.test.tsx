import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import { URL_LOCATION_UNIT_EDIT, URL_SERVICE_POINT_ADD_EDIT } from '../../../constants';
import { EditLink } from '..';
import { Location } from './fixtures';

// Mock the useMls hook
jest.mock('../../mls', () => ({
  useMls: () => ({ t: (key: string) => key }),
}));

describe('EditLink', () => {
  it('renders the correct link for building locations', () => {
    const { getByText } = render(
      <Router>
        <EditLink location={Location} />
      </Router>
    );

    const link = getByText('Edit');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', `${URL_SERVICE_POINT_ADD_EDIT}/1`);
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
        <EditLink location={location} />
      </Router>
    );

    const link = getByText('Edit');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', `${URL_LOCATION_UNIT_EDIT}/2`);
  });
});
