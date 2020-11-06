import { shallow } from 'enzyme';
import React from 'react';
import { TableData } from '../Table';
import { ConnectedLocationUnitGroup } from '..';

describe('containers/pages/locations/ConnectedLocationUnitGroup', () => {
  const tableData: TableData[] = [];
  for (let i = 1; i < 5; i++) {
    tableData.push({
      id: i,
      key: i.toString(),
      active: true,
      name: 'Asda',
      description: 'this is the description',
    });
  }

  // const props = {
  //   accessToken: 'hunter 2',
  //   keycloakUser: null,
  //   serviceClass: KeycloakService,
  //   history,
  //   location: {
  //     hash: '',
  //     pathname: `/user/credentials/${fixtures.keycloakUser.id}`,
  //     search: '',
  //     state: undefined,
  //   },
  //   match: {
  //     isExact: true,
  //     params: {
  //       userId: fixtures.keycloakUser.id,
  //     },
  //     path: '/user/credentials/:userId',
  //     url: `/user/credentials/${fixtures.keycloakUser.id}`,
  //   },
  //   keycloakBaseURL: 'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage',
  //   fetchKeycloakUsersCreator: fetchKeycloakUsers,
  // };

  it('renders without crashing', () => {
    const wrapper = shallow(<ConnectedLocationUnitGroup />);
    expect(wrapper.props()).toMatchSnapshot();
  });

  // it('Render view details', () => {
  //   const wrapper = mount(<ConnectedLocationUnitGroup tableData={tableData} tree={tree} />);

  //   // click on view detail
  //   const first_action = wrapper.find('.d-flex.justify-content-end.align-items-center').first();
  //   first_action.children().last().simulate('click');
  //   wrapper.find('.ant-dropdown-menu-item.ant-dropdown-menu-item-only-child').simulate('click');

  //   // find view details component
  //   let viewdetail = wrapper.find('.ant-col.ant-col-5.pl-3');
  //   expect(viewdetail.length).toBe(1);

  //   // Close View Details
  //   viewdetail.find('button').simulate('click');
  //   viewdetail = wrapper.find('.ant-col.ant-col-5.pl-3');
  //   expect(viewdetail.length).toBe(0);
  // });

  // it('Test view details close', () => {
  //   const wrapper = mount(<ConnectedLocationUnitGroup tableData={tableData} tree={tree} />);

  //   // click on view detail
  //   const first_row = wrapper.find('tr[data-row-key="1"]');
  //   first_row.find('span.ant-dropdown-trigger').simulate('click'); // click on dropdown icon
  //   wrapper.find('.ant-dropdown-menu-item.ant-dropdown-menu-item-only-child').simulate('click'); // click on viewdetails

  //   // find view details component
  //   let viewdetail = wrapper.find('.ant-col.ant-col-5.pl-3');
  //   expect(viewdetail.length).toBe(1);

  //   // Close View Details
  //   viewdetail.find('button').simulate('click');
  //   viewdetail = wrapper.find('.ant-col.ant-col-5.pl-3');
  //   expect(viewdetail.length).toBe(0);
  // });

  // it('Test Name Sorting functionality', () => {
  //   const wrapper = mount(<ConnectedLocationUnitGroup tableData={tableData} tree={tree} />);

  //   let heading = wrapper.find('thead');
  //   expect(heading.find('th').length).toBe(4);
  //   heading.find('th').at(0).children().simulate('click');
  //   heading.find('th').at(0).children().simulate('click');

  //   let body = wrapper.find('tbody');
  //   expect(body.children().first().prop('rowKey')).toBe('4');
  //   expect(body.children().last().prop('rowKey')).toBe('1');
  // });

  // it('Test Level Sorting functionality', () => {
  //   const wrapper = mount(<ConnectedLocationUnitGroup tableData={tableData} tree={tree} />);

  //   let heading = wrapper.find('thead');
  //   expect(heading.find('th').length).toBe(4);
  //   heading.find('th').at(1).children().simulate('click');
  //   heading.find('th').at(1).children().simulate('click');

  //   let body = wrapper.find('tbody');
  //   expect(body.children().first().prop('rowKey')).toBe('4');
  //   expect(body.children().last().prop('rowKey')).toBe('1');
  // });

  // it('Test Last Updated Sorting functionality', () => {
  //   const wrapper = mount(<ConnectedLocationUnitGroup tableData={tableData} tree={tree} />);

  //   let heading = wrapper.find('thead');
  //   expect(heading.find('th').length).toBe(4);
  //   heading.find('th').at(2).children().simulate('click');
  //   heading.find('th').at(2).children().simulate('click');

  //   let body = wrapper.find('tbody');
  //   expect(body.children().first().prop('rowKey')).toBe('4');
  //   expect(body.children().last().prop('rowKey')).toBe('1');
  // });
});
