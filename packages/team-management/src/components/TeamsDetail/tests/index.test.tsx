import { mount } from 'enzyme';
import React from 'react';
import TeamsDetail, { TeamsDetailProps } from '..';

describe('components/TeamsDetail', () => {
  const props: TeamsDetailProps = {
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
    teamMembers: [
      {
        active: false,
        identifier: '718e2b7d-22d7-4c23-aaa7-62cca4b9e318',
        name: 'prac one',
        userId: '7306784c-64fb-4d45-990b-306863eb478b',
        username: 'prac_1',
      },
      {
        active: true,
        identifier: '718e2b7d-22d7-4c23-aaa7-62cca4b9e318',
        name: 'prac two',
        userId: '7306784c-64fb-4d45-990b-306863eb478b',
        username: 'prac_2',
      },
    ],
  };

  it('renders without crashing', () => {
    const wrapper = mount(<TeamsDetail {...props} />);
    const content = wrapper.find('div.p-4.bg-white');
    expect(content.find('Button').props()).toMatchSnapshot('close button');
    expect(content.find('div.mb-4.small')).toHaveLength(4);
    expect(wrapper.text()).toMatchSnapshot('team name');
    expect(wrapper.text()).toMatchSnapshot('status');
    expect(wrapper.text()).toMatchSnapshot('identifier');
    expect(wrapper.text()).toMatchSnapshot('team members');
  });

  it('removes it self on close', () => {
    const wrapper = mount(<TeamsDetail {...props} onClose={() => wrapper.unmount()} />);
    expect(wrapper.children()).toHaveLength(1);
    wrapper.find('button').simulate('click');
    expect(wrapper).toHaveLength(0);
  });
  it('doesnt close if onClose prop is not set', () => {
    const wrapper = mount(<TeamsDetail {...props} />);
    expect(wrapper.children()).toHaveLength(1);
    wrapper.find('button').simulate('click');
    expect(wrapper).toHaveLength(1);
  });

  it('show no team members if doesnt have team members', () => {
    const wrapper = mount(<TeamsDetail {...props} teamMembers={[]} />);
    expect(wrapper.find('.no-team-members').text()).toEqual('No team members');
  });
});
