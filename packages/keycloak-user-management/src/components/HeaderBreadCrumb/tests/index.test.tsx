// test ExportModal
import { mount, shallow } from 'enzyme';
import React from 'react';
import HeaderBreadCrumb, { handleTabLink } from '..';

describe('components/HeaderBreadCrumb', () => {
  it('renders without crashing', () => {
    shallow(<HeaderBreadCrumb />);
  });
  it('renders the HeadeBreadCrumb component', () => {
    const wrapper = mount(<HeaderBreadCrumb />);
    expect(wrapper.find('Tabs').props()).toMatchSnapshot('Tabs');
    wrapper.unmount();
  });

  it('renders the users breadcrumb when userId is defined', () => {
    const props = {
      userId: '97f36061-52fb-4474-88f2-fd286311ff1d',
    };
    const wrapper = mount(<HeaderBreadCrumb {...props} />);
    expect(wrapper.find('Tabs').props()).toMatchSnapshot('Tabs');
    wrapper.unmount();
  });
  it('handles tab links appropriately', () => {
    const mockUseHistory = {
      push: jest.fn(),
    };
    const setActiveKeyStateMethodMock = jest.fn();
    handleTabLink('credentials', setActiveKeyStateMethodMock, '123', mockUseHistory);
    expect(setActiveKeyStateMethodMock).toBeCalled();
    expect(mockUseHistory.push).toBeCalled();
  });
});
