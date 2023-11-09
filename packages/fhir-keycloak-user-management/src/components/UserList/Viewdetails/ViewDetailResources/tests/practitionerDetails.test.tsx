import { PractitionerDetailsView } from '../PractitionerDetails';
import { render } from '@testing-library/react';
import { practitionerDetailsBundle } from './fixtures';
import React from 'react';
import { getResourcesFromBundle } from '@opensrp/react-utils';
import { PractitionerDetail } from '../../types';

const practitionerDetails =
  getResourcesFromBundle<PractitionerDetail>(practitionerDetailsBundle)[0].fhir;

test('renders without crashing', () => {
  const props = {
    loading: false,
    practitionerDetails,
  };
  render(<PractitionerDetailsView {...props} />);

  const tableRows = document.querySelectorAll('table tr');
  const text = [...tableRows].map((tr) => tr.textContent);
  expect(text).toEqual([
    'IdNameActiveUser TypePractitioner Role Coding',
    '3a801d6e-7bd3-4a5f-bc9c-64758fbb3dadtest1147 1147ActivepractitionerAssigned practitioner(http://snomed.info/sct|405623001), ',
  ]);
});
