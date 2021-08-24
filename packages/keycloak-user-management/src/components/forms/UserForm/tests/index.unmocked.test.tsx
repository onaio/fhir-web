import { mount } from 'enzyme';
import flushPromises from 'flush-promises';
import React from 'react';
import { history } from '@onaio/connected-reducer-registry';
import { defaultUserFormInitialValues, UserForm } from '..';
import { keycloakUser, practitioner1, userGroup } from './fixtures';
import { act } from 'react-dom/test-utils';
import { OPENSRP_API_BASE_URL } from '@opensrp-web/server-service';
import { Router } from 'react-router';
import { UserFormProps } from '../types';
import { getFormValues } from '../utils';

const props: UserFormProps = {
  initialValues: defaultUserFormInitialValues,
  keycloakBaseURL: 'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage',
  opensrpBaseURL: OPENSRP_API_BASE_URL,
  extraData: {},
  userGroups: userGroup,
};

describe('forms/userForm', () => {
  it('filters user groups', async () => {
    const propsOwn = {
      ...props,
      practitioner: practitioner1,
      // mount with both user and practitioner enabled
      initialValues: getFormValues(
        { ...keycloakUser, enabled: true },
        { ...practitioner1, active: true }
      ),
    };

    const wrapper = mount(
      <Router history={history}>
        <UserForm {...propsOwn} />
      </Router>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    // find antd Select with id 'practitioners' in the 'Form' component
    const userGroupSelect = wrapper.find('Select#userGroups');

    // simulate click on select - to show dropdown items
    userGroupSelect.find('.ant-select-selector').simulate('mousedown');
    wrapper.update();

    // find antd select options
    const selectOptions = wrapper.find('.ant-select-item-option-content');

    // expect all groups options
    expect(selectOptions.map((opt) => opt.text())).toStrictEqual(['Admin', 'Admin 2', 'New Group']);

    // find search input field
    const inputField = userGroupSelect.find('input#userGroups');
    // simulate change (type search phrase)
    inputField.simulate('change', { target: { value: 'dmi' } });

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    // expect to see only filtered options
    const selectOptions2 = wrapper.find('.ant-select-item-option-content');
    expect(selectOptions2.map((opt) => opt.text())).toStrictEqual(['Admin', 'Admin 2']);
  });
});
