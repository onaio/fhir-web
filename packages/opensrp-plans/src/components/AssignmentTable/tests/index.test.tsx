import { mount, shallow } from 'enzyme';
import React from 'react';
import { ConnectedAssignmentTable } from '..';
import {
  expectedAssignment,
  expectedAssignment1,
  organizations,
  plan,
  sampleRawAssignments,
} from './fixtures';
import { store } from '@opensrp/store';
import { Provider } from 'react-redux';
import reducerRegistry from '@onaio/redux-reducer-registry';
import {
  plansReducerName,
  plansReducer,
  removePlanDefinitions,
} from '../../../ducks/planDefinitions';
import { act } from 'react-dom/test-utils';
import { jurisdictions } from './fixtures';
import { Jurisdiction, removeJurisdictions } from '../../../ducks/jurisdictions';
import { removeAssignmentsAction } from '@opensrp/team-assignment';
import { Organization, removeOrganizationsAction } from '@opensrp/team-management';
import { authenticateUser } from '@onaio/session-reducer';
import { Dictionary } from '@onaio/utils';
import MockDate from 'mockdate';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import flushPromises from 'flush-promises';

const history = createBrowserHistory();

reducerRegistry.register(plansReducerName, plansReducer);

// help convert jurisdictions to select options
const jursToOptions = (jurisdictions: Jurisdiction[]) => {
  return jurisdictions.map((jur) => ({
    key: jur.id,
    label: jur.properties.name,
    value: jur.id,
  }));
};

// help convert organizations to select options
const orgsToOptions = (organizations: Organization[]) => {
  return organizations.map((org) => ({
    key: org.identifier,
    label: org.name,
    value: org.identifier,
  }));
};

MockDate.set('12/30/2019');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetch = require('jest-fetch-mock');

describe('opensrp-plans/assignmentTable', () => {
  beforeAll(() => {
    store.dispatch(
      authenticateUser(
        true,
        {
          email: 'bob@example.com',
          name: 'Bobbie',
          username: 'RobertBaratheon',
        },
        { api_token: 'hunter2', oAuth2Data: { access_token: 'sometoken', state: 'abcde' } }
      )
    );
  });

  afterEach(() => {
    fetch.resetMocks();
    store.dispatch(removeJurisdictions());
    store.dispatch(removeAssignmentsAction);
    store.dispatch(removeOrganizationsAction());
    store.dispatch(removePlanDefinitions());
  });

  it('renders without crashing', async () => {
    fetch.mockResponse(JSON.stringify([]));
    const wrapper = shallow(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedAssignmentTable plan={plan} />
        </Router>
      </Provider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    wrapper.unmount();
  });

  it('renders correctly', async () => {
    fetch.mockResponse(JSON.stringify([]));
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedAssignmentTable plan={plan} />
        </Router>
      </Provider>
    );
    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(fetch.mock.calls).toEqual([
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/organization/assignedLocationsAndPlans?plan=ae12d8c4-d2a8-53f9-b201-6cccdd42482b',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer sometoken',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/organization',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer sometoken',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/location/findByProperties?is_jurisdiction=true&return_geometry=false&properties_filter=status:Active,geographicLevel:0',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer sometoken',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
    ]);
    fetch.resetMocks();
    wrapper.find('tr').forEach((tr, index) => {
      expect(tr.text()).toMatchSnapshot(`tr ${index}`);
    });

    // check the rendered output, will only have jurisdictions as ids that were in the plan
    expect(wrapper.text()).toMatchInlineSnapshot(
      `"Assigned regionsAssigned teamsActions9b5dd829-89de-45a5-98f2-fd37787ae949, 6bb05db0-730b-409b-991d-4abfe6a59ea1, 1b14ff5b-1f24-4b50-a59a-33cef0ed7bfb, 7d150b42-11e7-4362-8d0d-1a8ef506c754, 9fb0f2cf-7836-4557-a908-4b8cd628d193 - Edit regionsEdit teams"`
    );
    wrapper.unmount();
  });

  it('renders correctly when there is data', async () => {
    fetch
      .once(JSON.stringify(sampleRawAssignments))
      .once(JSON.stringify(organizations))
      .once(JSON.stringify(jurisdictions));
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedAssignmentTable plan={plan} assignAtGeoLevel={3} />
        </Router>
      </Provider>
    );
    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    wrapper.find('tr').forEach((tr, index) => {
      expect(tr.text()).toMatchSnapshot(`tr ${index}`);
    });

    // check the rendered output
    expect(wrapper.text()).toMatchInlineSnapshot(
      `"Assigned regionsAssigned teamsActionsIITANANGA, OKASHANDJAOna testOrgEdit regionsEdit teamsIITANANGATest Test TeamEdit regionsEdit teamsOKASHANDJANAIMA old test teamEdit regionsEdit teamsIIYALA N.6, OKANKETE-2, OSHIPUMBU MAKILINDIDI NO 2-1 - Edit regionsEdit teams"`
    );
    wrapper.unmount();
  });

  it('renders even with errors', async () => {
    fetch
      .once(JSON.stringify(null))
      .once(JSON.stringify(organizations))
      .once(JSON.stringify(jurisdictions));
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedAssignmentTable plan={plan} assignAtGeoLevel={3} />
        </Router>
      </Provider>
    );
    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    // check the rendered output
    expect(wrapper.text()).toMatchInlineSnapshot(`"ErrorCould not load assignmentsGo backGo home"`);
    wrapper.unmount();
  });

  it('test plan jurisdiction assignment', async () => {
    // remove plans
    const mission = { ...plan, jurisdiction: [] };
    fetch
      .once(JSON.stringify([]))
      .once(JSON.stringify(organizations))
      .once(JSON.stringify(jurisdictions));
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedAssignmentTable plan={mission} assignAtGeoLevel={3} />
        </Router>
      </Provider>
    );
    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    //should have 2 rows
    expect(wrapper.find('tr')).toHaveLength(2);

    wrapper.find('tr').forEach((tr, index) => {
      expect(tr.text()).toMatchSnapshot(`tr ${index}`);
    });

    // check the rendered output
    expect(wrapper.text()).toMatchInlineSnapshot(
      `"Assigned regionsAssigned teamsActionsEdit regionsEdit teams"`
    );

    // edit teams modal button should be disabled
    wrapper.find('button.assign-modal').forEach((button, index) => {
      expect(button.text()).toMatchSnapshot(`${index} button`);
    });
    expect(wrapper.find('button.assign-modal').first().props().disabled).toBeFalsy();
    expect(wrapper.find('button.assign-modal').last().props().disabled).toBeTruthy();

    fetch.resetMocks();
    fetch.mockResponse(JSON.stringify([]));

    // simulate selecting jurisdictions
    const jurisdictionAssignmentModal = wrapper.find('EditAssignmentsModal').first();
    // make sure its the areas one
    expect(jurisdictionAssignmentModal.text().includes('Edit regions')).toBeTruthy();
    const selectedJurisdiction = jursToOptions([jurisdictions[0]]);
    (jurisdictionAssignmentModal.props() as Dictionary).saveHandler(selectedJurisdiction);
    await act(async () => {
      await flushPromises();
    });

    // what fetch calls were made:
    // one to add the jurs to plan, the other to add assignments if there is selected organizations
    const body = JSON.stringify({ ...mission, jurisdiction: [{ code: jurisdictions[0].id }] });
    expect(fetch.mock.calls.slice(0, 2)).toEqual([
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/plans',
        {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          body,
          headers: {
            accept: 'application/json',
            authorization: 'Bearer sometoken',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'PUT',
        },
      ],
      // there are no teams in the rows scope, so the posted assignments are empty
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/organization/assignLocationsAndPlans',
        {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          body: '[]',
          headers: {
            accept: 'application/json',
            authorization: 'Bearer sometoken',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'POST',
        },
      ],
    ]);
    wrapper.unmount();
  });

  it('test plan teams assignment', async () => {
    // add just a single jurisdiction to plan
    const mission = { ...plan, jurisdiction: [{ code: jurisdictions[0].id }] };
    fetch
      .once(JSON.stringify([]))
      .once(JSON.stringify(organizations))
      .once(JSON.stringify(jurisdictions));
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedAssignmentTable plan={mission} assignAtGeoLevel={3} />
        </Router>
      </Provider>
    );
    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    //should have 2 rows
    expect(wrapper.find('tr')).toHaveLength(2);

    wrapper.find('tr').forEach((tr, index) => {
      expect(tr.text()).toMatchSnapshot(`tr ${index}`);
    });

    // check the rendered output
    expect(wrapper.text()).toMatchInlineSnapshot(
      `"Assigned regionsAssigned teamsActionsIITANANGA - Edit regionsEdit teams"`
    );

    fetch.resetMocks();
    fetch.mockResponse(JSON.stringify([]));

    // simulate selecting jurisdictions
    const teamAssignmentModal = wrapper.find('EditAssignmentsModal').last();
    // make sure its the areas one
    expect(teamAssignmentModal.text().includes('Edit teams')).toBeTruthy();
    const selectedOrgs = orgsToOptions([organizations[0]]);
    (teamAssignmentModal.props() as Dictionary).saveHandler(selectedOrgs);
    await act(async () => {
      await flushPromises();
    });

    // what fetch calls were made:
    // calls should be just about adding assignments.
    expect(fetch.mock.calls).toEqual([
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/organization/assignLocationsAndPlans',
        {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          body: expectedAssignment,
          headers: {
            accept: 'application/json',
            authorization: 'Bearer sometoken',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'POST',
        },
      ],
    ]);
    wrapper.unmount();
  });

  it('test plan jurisdiction when there is already an assignment', async () => {
    // has one jurisdiction, that goes with one assignment
    const mission = { ...plan, jurisdiction: [{ code: '9b5dd829-89de-45a5-98f2-fd37787ae949' }] };
    fetch
      .once(JSON.stringify([sampleRawAssignments[0]]))
      .once(JSON.stringify(organizations))
      .once(JSON.stringify(jurisdictions));
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ConnectedAssignmentTable plan={mission} assignAtGeoLevel={3} />
        </Router>
      </Provider>
    );
    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    //should have 2 rows
    expect(wrapper.find('tr')).toHaveLength(2);

    wrapper.find('tr').forEach((tr, index) => {
      expect(tr.text()).toMatchSnapshot(`tr ${index}`);
    });

    // check the rendered output
    expect(wrapper.text()).toMatchInlineSnapshot(
      `"Assigned regionsAssigned teamsActionsIITANANGAOna testOrgEdit regionsEdit teams"`
    );

    fetch.resetMocks();
    fetch.mockResponse(JSON.stringify([]));

    // simulate selecting jurisdictions
    const jurisdictionAssignmentModal = wrapper.find('EditAssignmentsModal').first();
    // make sure its the areas one
    expect(jurisdictionAssignmentModal.text().includes('Edit regions')).toBeTruthy();
    const selectedJurisdiction = jursToOptions([jurisdictions[1], jurisdictions[0]]);
    (jurisdictionAssignmentModal.props() as Dictionary).saveHandler(selectedJurisdiction);
    await act(async () => {
      await flushPromises();
    });

    // what fetch calls were made:
    // calls should be just about adding assignments.
    const body = JSON.stringify({
      ...mission,
      jurisdiction: [{ code: jurisdictions[1].id }, { code: jurisdictions[0].id }],
    });
    expect(fetch.mock.calls.slice(0, 2)).toEqual([
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/plans',
        {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          body,
          headers: {
            accept: 'application/json',
            authorization: 'Bearer sometoken',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'PUT',
        },
      ],
      // 2 assignments made
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/organization/assignLocationsAndPlans',
        {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          body: expectedAssignment1,
          headers: {
            accept: 'application/json',
            authorization: 'Bearer sometoken',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'POST',
        },
      ],
    ]);
    wrapper.unmount();
  });
});
