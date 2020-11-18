import flushPromises from 'flush-promises';
import { mount } from 'enzyme';
import React from 'react';
import { history } from '@onaio/connected-reducer-registry';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { store } from '@opensrp/store';

import { id, LocationTagValue, locationtag, treedata } from './fixtures';
import Form from '../Form';
import { act } from 'react-dom/test-utils';

// jest.mock('antd', () => {
//   const antd = jest.requireActual('antd');

//   /* eslint-disable react/prop-types */
//   const Select = ({ children, onChange }) => {
//     return <select onChange={(e) => onChange(e.target.value)}>{children}</select>;
//   };

//   const Option = ({ children, ...otherProps }) => {
//     return <option {...otherProps}>{children}</option>;
//   };
//   /* eslint-disable react/prop-types */

//   Select.Option = Option;

//   return {
//     __esModule: true,
//     ...antd,
//     Select,
//   };
// });

describe('containers/pages/locations/LocationUnitAdd', () => {
  it('renders without crashing', () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <Form locationtag={locationtag} treedata={treedata} />
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
            initialValue={LocationTagValue}
            id={id}
            locationtag={locationtag}
            treedata={treedata}
          />
        </Router>
      </Provider>
    );

    expect(wrapper.find('form input[name="name"]').prop('value')).toBe(LocationTagValue.name);

    expect(
      wrapper.find(`form input[type="radio"][value="${LocationTagValue.status}"]`).prop('checked')
    ).toBe(true);

    expect(wrapper.find('form TreeSelect[className="ant-tree-select"]').prop('value')).toBe(
      LocationTagValue.parentId
    );
    expect(
      wrapper.find('form Field[name="locationTags"] Select[prefixCls="ant-select"]').prop('value')
    ).toBe(LocationTagValue.locationTags);
    expect(wrapper.find('form input[name="type"]').prop('value')).toBe(LocationTagValue.type);
  });

  it('Cancel button', () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <Form locationtag={locationtag} treedata={treedata} />
        </Router>
      </Provider>
    );

    wrapper.find('button#cancel').simulate('click');
  });

  it('Update LocationTagValue', async () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <Form
            initialValue={LocationTagValue}
            id={id}
            locationtag={locationtag}
            treedata={treedata}
          />
        </Router>
      </Provider>
    );

    wrapper.find('form').simulate('submit');

    await act(async () => {
      await flushPromises();
    });
  });

  it('Create LocationTagValue', async () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <Form initialValue={LocationTagValue} locationtag={locationtag} treedata={treedata} />
        </Router>
      </Provider>
    );

    wrapper.find('form').simulate('submit');

    await act(async () => {
      await flushPromises();
    });
  });

  // TODO : Fix test
  // it('Filter function', async () => {
  //   // const wrapper = mount(
  //   //   <Provider store={store}>
  //   //     <Router history={history}>
  //   //       <Form initialValue={LocationTagValue} locationtag={locationtag} treedata={treedata} />
  //   //     </Router>
  //   //   </Provider>
  //   // );

  //   // expect(toJson(wrapper)).toMatchSnapshot();
  //   // wrapper
  //   //   .find('form Field[name="locationTags"] Select')
  //   //   .first()
  //   //   .simulate('change', { target: { name: 'locationTags', value: 'password133' } });

  // await act(async () =>{ await flushPromises()});
  // });
});
