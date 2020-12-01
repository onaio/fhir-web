import React from 'react';
import { mount } from 'enzyme';
import { history } from '@onaio/connected-reducer-registry';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { store } from '@opensrp/store';

import { accessToken, id, intialValue, practitioners } from './fixtures';
import Form from '../Form';

describe('Team-management/TeamsAddEdit/Form', () => {
  it('renders without crashing', () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <Form accessToken={accessToken} practitioner={practitioners} />
        </Router>
      </Provider>
    );

    expect(wrapper.find('form')).toHaveLength(1);
  });

  it('renders without crashing with id', () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <Form
            id={id}
            initialValue={intialValue}
            accessToken={accessToken}
            practitioner={practitioners}
          />
        </Router>
      </Provider>
    );

    expect(wrapper.find('Form').prop('initialValue')).toMatchObject(intialValue);
  });

  it('Cancel button', () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <Form
            id={id}
            initialValue={intialValue}
            accessToken={accessToken}
            practitioner={practitioners}
          />
        </Router>
      </Provider>
    );

    wrapper.find('button#cancel').simulate('click');
  });

  // TODO : Add test
  // it('Create TeamsAddEdit', async () => {});
  // it('Update TeamsAddEdit', async () => {});
  // it('Add Practinier field', async () => {});
  // it('Remove Practinier field', async () => {});
});
