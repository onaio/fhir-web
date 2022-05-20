import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import { Router } from 'react-router';
import { ViewDetails } from '..';
import { createMemoryHistory } from 'history';
import { URL_USER_GROUPS } from '../../../constants';
import { act } from 'react-dom/test-utils';
import flushPromises from 'flush-promises';

import { KeycloakUserGroup } from '../../../ducks/userGroups';
import { UserGroupMembers } from '../../UserGroupsList';
import { Resource404 } from '@opensrp/react-utils';
import { Button } from 'antd';

const history = createMemoryHistory();
history.push(URL_USER_GROUPS);

describe('View User Group Details', () => {
  const props = {
    loading: false,
    error: false,
    GroupDetails: {
      id: '123-some-group-uuid-456',
      name: 'Group Name',
      realmRoles: ['ROLE_ONE', 'ROLE_TWO', 'ROLE_THREE'],
    } as KeycloakUserGroup,
    userGroupMembers: [
      {
        id: 'id-1',
        username: 'name-1',
      },
      {
        id: 'id-2',
        username: 'name-2',
      },
      {
        id: 'id-3',
        username: 'name-3',
      },
      {
        id: 'id-4',
        username: 'name-4',
      },
    ] as UserGroupMembers[],
    onClose: jest.fn(),
  };

  it('works correctly', async () => {
    const wrapper = mount(
      <Router history={history}>
        <ViewDetails {...props} />
      </Router>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    expect(wrapper.text()).toMatchSnapshot('nominal display');
    // att test case to capture space element props snapshot
    expect(wrapper.find('ViewDetails Space').props()).toMatchSnapshot('space element');
    wrapper.unmount();
  });

  it('shows loader if loading', async () => {
    const newProps = {
      ...props,
      loading: true,
    };

    const wrapper = mount(
      <Router history={history}>
        <ViewDetails {...newProps} />
      </Router>
    );

    expect(toJson(wrapper.find('.ant-spin'))).toBeTruthy();
  });

  it('shows error page when error is present', async () => {
    const newProps = {
      ...props,
      error: true,
    };

    const wrapper = mount(
      <Router history={history}>
        <ViewDetails {...newProps} />
      </Router>
    );

    expect(wrapper.find(Resource404)).toBeTruthy();
    wrapper.unmount();
  });

  it('Closes on clicking cancel (X) ', () => {
    const wrapper = mount(
      <Router history={history}>
        <ViewDetails {...props} />
      </Router>
    );

    // simulate clicking on close button
    act(() => {
      wrapper.find(Button).simulate('click');
    });

    expect(props.onClose).toHaveBeenCalledTimes(1);
    wrapper.unmount();
  });

  it('shows missing messages when no roles and groups present', async () => {
    const newProps = {
      ...props,
      GroupDetails: {
        ...props.GroupDetails,
        realmRoles: [],
      },
      userGroupMembers: [],
    };

    const wrapper = mount(
      <Router history={history}>
        <ViewDetails {...newProps} />
      </Router>
    );

    expect(wrapper.find('#noRealRole').text()).toEqual("No assigned roles");
    expect(wrapper.find('#noGroupMember').text()).toEqual("No assigned members");
  });
});
