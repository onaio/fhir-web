/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { mount } from 'enzyme';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import flushPromises from 'flush-promises';
import { act } from 'react-dom/test-utils';
import TeamsDetail from '..';
import {
  team,
  practitioner102,
  practitioner116,
  practitionerRole,
  teamsDetail,
} from '../../../tests/fixtures';
import * as fhirCient from 'fhirclient';

const history = createBrowserHistory();

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

const fhir = jest.spyOn(fhirCient, 'client');
fhir.mockImplementation(
  jest.fn().mockImplementation(() => {
    return {
      request: jest.fn((url) => {
        if (url === 'Organization') return Promise.resolve(team);
        else if (url === 'PractitionerRole') return Promise.resolve(practitionerRole);
        else if (url === 'Practitioner/116') return Promise.resolve(practitioner116);
        else if (url === 'Practitioner/102') return Promise.resolve(practitioner102);
        else {
          // eslint-disable-next-line no-console
          console.error('response not found', url);
        }
      }),
    };
  })
);

describe('components/TeamsDetail', () => {
  it('renders correctly', async () => {
    const wrapper = mount(
      <Router history={history}>
        <TeamsDetail {...teamsDetail} />
      </Router>
    );

    expect(wrapper.find('TeamsDetail')).toHaveLength(1);
  });

  it('close button works correctly', async () => {
    const mockclose = jest.fn();
    const wrapper = mount(
      <Router history={history}>
        <TeamsDetail {...teamsDetail} onClose={mockclose} />
      </Router>
    );

    await act(async () => {
      wrapper.find('.close-btn').first().simulate('click');
      await flushPromises();
      wrapper.update();
    });

    expect(mockclose).toHaveBeenCalled();
  });
});
