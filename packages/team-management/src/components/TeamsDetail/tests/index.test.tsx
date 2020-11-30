import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import flushPromises from 'flush-promises';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { store } from '@opensrp/store';
import TeamsDetail, { Props } from '..';

describe('containers/pages/Home', () => {
  const props: Props = {
    active: true,
    id: 1,
    identifier: 'fcc19470-d599-11e9-bb65-2a2ae2dbcce4',
    name: 'The Luang',
    type: {
      coding: [
        {
          code: 'team',
          display: 'Team',
          system: 'http://terminology.hl7.org/CodeSystem/team-type',
        },
      ],
    },
  };

  it('renders without crashing', () => {
    const wrapper = mount(
      <Provider store={store}>
        <TeamsDetail {...props} />
      </Provider>
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('removes it self on close', async () => {
    const wrapper = mount(
      <Provider store={store}>
        <TeamsDetail {...props} onClose={() => wrapper.unmount()} />
      </Provider>
    );
    await act(async () => {
      await flushPromises();
      wrapper.update();
    });
    expect(wrapper.children()).toHaveLength(1);
    // wrapper.find('.close-btn').simulate('click');
    // expect(wrapper).toHaveLength(0);
  });
  // it('doesnt close if onClose prop is not set', () => {
  //   const wrapper = mount(
  //     <Provider store={store}>
  //       <TeamsDetail {...props} />
  //     </Provider>
  //   );
  //   expect(wrapper.children()).toHaveLength(1);
  //   wrapper.find('button').simulate('click');
  //   expect(wrapper).toHaveLength(1);
  // });
});
