/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { mount } from 'enzyme';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import flushPromises from 'flush-promises';
import { act } from 'react-dom/test-utils';
import HealthcareDetails from '..';
import {
  team,
  healthcareservice,
  healthcareservice313,
  healthcareservice323,
  team366,
  healthcaredetail,
} from '../../../tests/fixtures';
import * as fhirCient from 'fhirclient';

const history = createBrowserHistory();

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

const fhir = jest.spyOn(fhirCient, 'client');
fhir.mockImplementation(
  jest.fn().mockImplementation(() => ({
    request: jest.fn((url) => {
      if (url === 'Organization/') return Promise.resolve(team);
      if (url === 'Organization/366') return Promise.resolve(team366);
      else if (url === 'HealthcareService/') return Promise.resolve(healthcareservice);
      else if (url === 'HealthcareService/323') return Promise.resolve(healthcareservice323);
      else if (url === 'HealthcareService/313') return Promise.resolve(healthcareservice313);
      else {
        // eslint-disable-next-line no-console
        console.error('response not found', url);
      }
    }),
  }))
);

describe('components/TeamsDetail', () => {
  it('renders correctly', async () => {
    const wrapper = mount(
      <Router history={history}>
        <HealthcareDetails {...healthcaredetail} />
      </Router>
    );

    expect(wrapper.find('HealthcareDetails')).toHaveLength(1);
  });

  it('close button works correctly', async () => {
    const mockclose = jest.fn();
    const wrapper = mount(
      <Router history={history}>
        <HealthcareDetails
          {...healthcaredetail}
          active={false}
          organization={undefined}
          comment={undefined}
          extraDetails={undefined}
          onClose={mockclose}
          meta={undefined}
        />
      </Router>
    );

    await act(async () => {
      wrapper.find('.close-btn').first().simulate('click');
      await flushPromises();
      wrapper.update();
    });

    expect(mockclose).toHaveBeenCalled();
  });

  it('cover close button without button function', async () => {
    // eslint-disable-next-line no-console
    const globalerr = console.error;
    // eslint-disable-next-line no-console
    console.error = jest.fn();
    const wrapper = mount(
      <Router history={history}>
        <HealthcareDetails {...healthcaredetail} active={true} />
      </Router>
    );

    try {
      wrapper.find('.close-btn').first().simulate('click');
      await flushPromises();
      wrapper.update();
    } catch (e) {
      expect(e.message).toBe('No OnClose Function Specified');
      // eslint-disable-next-line no-console
      expect(console.error).toBeCalledTimes(1);
    }

    // eslint-disable-next-line no-console
    console.error = globalerr;
  });
});
