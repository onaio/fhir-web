/* eslint-disable @typescript-eslint/camelcase */
import { store } from '@opensrp-web/store';
import { mount } from 'enzyme';
import { getOpenSRPUserInfo } from '@onaio/gatekeeper';
import { history } from '@onaio/connected-reducer-registry';
import { authenticateUser } from '@onaio/session-reducer';
import React from 'react';
import { Provider } from 'react-redux';
import Table from '../Table';
import { Router } from 'react-router';
import { opensrpBaseURL } from '../../TeamsAddEdit/tests/fixtures';
import { Organization } from '../../../ducks/organizations';

describe('components/TeamsView/table', () => {
  beforeAll(() => {
    const { authenticated, user, extraData } = getOpenSRPUserInfo({
      oAuth2Data: {
        access_token: 'hunter2',
        expires_in: '3599',
        state: 'opensrp',
        token_type: 'bearer',
      },
      preferredName: 'Superset User',
      roles: ['ROLE_EDIT_KEYCLOAK_USERS'],
      username: 'superset-user',
    });
    store.dispatch(authenticateUser(authenticated, user, extraData));
  });
  const tableData: Organization[] = [];
  for (let i = 1; i < 5; i++) {
    tableData.push({
      id: i,
      name: `Edrward ${i}`,
      active: i % 2 === 0,
      identifier: `mock ${i}`,
    });
  }

  it('renders without crashing', () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <Table
            setPractitionersList={() => jest.fn()}
            setDetail={() => jest.fn()}
            opensrpBaseURL={opensrpBaseURL}
            data={tableData}
          />
        </Router>
      </Provider>
    );
    expect(wrapper.props().children.props.children).toMatchSnapshot('Table');
  });

  it('Test Table View Detail', () => {
    const onViewDetails = jest.fn();

    const wrapper = mount(
      <Router history={history}>
        <Table
          setPractitionersList={() => jest.fn()}
          setDetail={() => jest.fn()}
          opensrpBaseURL={opensrpBaseURL}
          data={tableData}
          onViewDetails={onViewDetails}
        />
      </Router>
    );
    const dropdown = wrapper.find('Dropdown').at(0);
    dropdown.simulate('click');
    wrapper.update();
    wrapper.find('.viewdetails').at(0).simulate('click');
    wrapper.update();
    expect(onViewDetails).toBeCalled();
    wrapper.unmount();
  });

  it('Should show table pagination options', () => {
    const wrapper = mount(
      <Router history={history}>
        <Table
          setPractitionersList={() => jest.fn()}
          setDetail={() => jest.fn()}
          opensrpBaseURL={opensrpBaseURL}
          data={tableData}
        />
      </Router>
    );
    expect(wrapper.find('.ant-table-pagination')).toBeTruthy();
  });
});
