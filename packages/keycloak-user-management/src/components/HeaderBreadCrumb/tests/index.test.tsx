// test ExportModal
import { mount, shallow } from 'enzyme';
import React from 'react';
import HeaderBreadCrumb, { handleTabLink } from '..';
import { URL_USER_CREDENTIALS, URL_USER_EDIT } from '../../../constants';

describe('components/HeaderBreadCrumb', () => {
  const mockUseHistory = {
    push: jest.fn(),
  };
  const setActiveKeyStateMethodMock = jest.fn();

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
  it('handles credential tab link appropriately', () => {
    handleTabLink('credentials', setActiveKeyStateMethodMock, '123', mockUseHistory);
    expect(setActiveKeyStateMethodMock).toBeCalled();
    expect(mockUseHistory.push).toBeCalledWith(`${URL_USER_CREDENTIALS}/123`);
  });
  it('handles details tab link appropriately', () => {
    handleTabLink('details', setActiveKeyStateMethodMock, '123', mockUseHistory);
    expect(setActiveKeyStateMethodMock).toBeCalled();
    expect(mockUseHistory.push).toBeCalledWith(`${URL_USER_EDIT}/123`);
  });
  it('handles group tab link appropriately', () => {
    handleTabLink('groups', setActiveKeyStateMethodMock, '123', mockUseHistory);
    expect(setActiveKeyStateMethodMock).toBeCalled();
    expect(mockUseHistory.push).toBeCalledWith('/groups');
  });
});
