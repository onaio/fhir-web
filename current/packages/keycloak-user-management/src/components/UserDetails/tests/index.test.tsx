import { mount } from 'enzyme';
import React from 'react';
import { UserDetails } from '../';
import { Organization } from '@opensrp/team-management';
import { Practitioner, KeycloakUser } from '../../../ducks/user';

describe('components/TeamsDetail', () => {
  const props = {
    keycloakUser: {
      id: 'c1d36d9a-b771-410b-959e-af2c04d132a2',
      username: 'allay_allan',
    } as KeycloakUser,
    practitioner: {
      identifier: 'f713620c-076e-407f-98fd-ae655b3dc5ba',
      active: true,
    } as Practitioner,
    assignedTeams: [
      {
        identifier: 'b0d21cea-9e0f-4ff8-b3e3-808a2655b9c5',
        active: true,
        name: 'Goldsmith CHW',
      },
      {
        identifier: '88e63364-53c1-436f-94b4-92d4bf7fc6c7',
        active: true,
        name: 'New team test',
      },
    ] as Organization[],
  };
  it('shows details section with data', () => {
    const wrapper = mount(<UserDetails {...props} />);

    const keycloakUsername = wrapper.find('#username').text();
    expect(keycloakUsername).toEqual(props.keycloakUser.username);

    const keycloakId = wrapper.find('#keycloakId').text();
    expect(keycloakId).toEqual(props.keycloakUser.id);

    const practitionerId = wrapper.find('#practitionerId').text();
    expect(practitionerId).toEqual(props.practitioner.identifier);

    const practitionerStatus = wrapper.find('#practitionerStatus').text();
    expect(practitionerStatus).toMatchInlineSnapshot(`"active"`);

    const assignedTeams = wrapper.find('#assignedTeam').map((team) => team.text());
    expect(assignedTeams).toEqual(props.assignedTeams.map((team) => team.name));
  });
  it('shows no practitioner message when practitioner not available', () => {
    const newProps = { ...props, practitioner: undefined };
    const wrapper = mount(<UserDetails {...newProps} />);
    expect(wrapper.find('#noActivePractitioner').text()).toMatchInlineSnapshot(
      `"No Active Practitioner"`
    );
  });
  it('shows no team available message when team not available', () => {
    const newProps = { ...props, assignedTeams: [] };
    const wrapper = mount(<UserDetails {...newProps} />);
    expect(wrapper.find('#noAssignedTeams').text()).toMatchInlineSnapshot(`"No Assigned Teams"`);
  });
  it('shows spinner', () => {
    const newProps = { ...props, keycloakUser: undefined };
    const wrapper = mount(<UserDetails {...newProps} />);
    expect(wrapper.find('.ant-spin').exists()).toBeTruthy();
  });
  it('removes it self on close', () => {
    const wrapper = mount(<UserDetails {...props} onClose={() => wrapper.unmount()} />);
    expect(wrapper.children()).toHaveLength(1);
    wrapper.find('Button.close-btn').simulate('click');
    expect(wrapper).toHaveLength(0);
  });
});
