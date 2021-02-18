import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import { Router } from 'react-router';
import { ViewDetails } from '..';
import * as fixtures from './fixtures';
import { createBrowserHistory } from 'history';
import { URL_USER_GROUPS } from '../../../constants';
import { act } from 'react-dom/test-utils';

const history = createBrowserHistory();

describe('View User Group Details', () => {
  it('works correctly', () => {
    const props = {
      groupId: fixtures.userGroup1.id,
      userGroupMembers: fixtures.members,
      singleUserGroupDetails: fixtures.userGroup1,
    };
    const wrapper = mount(<ViewDetails {...props} />);
    expect(wrapper.text()).toMatchSnapshot('nominal display');
  });

  it('detail view without groupId', () => {
    const props = {
      groupId: '',
      userGroupMembers: fixtures.members,
      singleUserGroupDetails: fixtures.userGroup1,
    };
    const wrapper = mount(<ViewDetails {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot('Should be null');
  });

  it('works when GroupId is present but user group members/details isnt', () => {
    const props = {
      groupId: fixtures.userGroup1.id,
      userGroupMembers: null,
      singleUserGroupDetails: null,
    };
    const wrapper = mount(
      <Router history={history}>
        <ViewDetails {...props} />
      </Router>
    );
    expect(wrapper.text()).toMatchInlineSnapshot(
      `"404Sorry, the resource you requested for, does not existGo BackBack Home"`
    );
  });

  it('Closes on clicking cancel (X) ', () => {
    const props = {
      groupId: fixtures.userGroup1.id,
      userGroupMembers: null,
      singleUserGroupDetails: null,
    };
    const wrapper = mount(
      <Router history={history}>
        <ViewDetails {...props} />
      </Router>
    );

    // simulate clicking on close button
    act(() => {
      wrapper.find('.flex-right button').simulate('click');
    });

    expect(wrapper.props().history.location.pathname).toEqual(URL_USER_GROUPS);
  });
});
