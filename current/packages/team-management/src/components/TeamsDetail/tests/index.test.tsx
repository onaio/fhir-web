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
    assignedLocations: [
      {
        type: 'Feature',
        id: 'id-1',
        properties: {
          status: 'Active',
          parentId: 'parent-id-1',
          name: 'Location 1',
          geographicLevel: 1,
          version: 0,
        },
        serverVersion: 0,
      },
      {
        type: 'Feature',
        id: 'id-2',
        properties: {
          status: 'Active',
          parentId: 'parent-id-2',
          name: 'Location 2',
          geographicLevel: 2,
          version: 0,
        },
        serverVersion: 1,
      },
    ],
  };

  it('renders without crashing', () => {
    const wrapper = mount(<TeamsDetail {...props} />);
    const content = wrapper.find('div.p-4.bg-white');
    expect(content.find('Button').props()).toMatchSnapshot('close button');
    expect(content.find('div.mb-4.small')).toHaveLength(5);
    expect(wrapper.text()).toMatchSnapshot('team name');
    expect(wrapper.text()).toMatchSnapshot('status');
    expect(wrapper.text()).toMatchSnapshot('identifier');
    expect(wrapper.text()).toMatchSnapshot('team members');
    expect(wrapper.text()).toMatchSnapshot('Assigned Locations');
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

  it('show no assigned locations if team not assigned to any location', () => {
    const wrapper = mount(<TeamsDetail {...props} assignedLocations={[]} />);
    expect(wrapper.find('.no-assigned-locations').text()).toMatchInlineSnapshot(
      `"This team is not assigned to any Location"`
    );
  });

  it('shows assigned locations', () => {
    const wrapper = mount(<TeamsDetail {...props} />);
    expect(wrapper.find('div.mb-4.small').at(4).text()).toMatchInlineSnapshot(
      `"Assigned LocationsLocation 1Location 2"`
    );
  });
});
