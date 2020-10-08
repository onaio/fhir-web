// test ExportModal
import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import HeaderBreadCrumb from '..';

describe('components/HeaderBreadCrumb', () => {
  it('renders without crashing', () => {
    shallow(<HeaderBreadCrumb />);
  });
  it('renders the HeadeBreadCrumb component', () => {
    const wrapper = mount(<HeaderBreadCrumb />);
    expect(toJson(wrapper)).toMatchSnapshot();
    wrapper.unmount();
  });

  it('renders the users breadcrumb when userId is defined', () => {
    const props = {
      userId: '97f36061-52fb-4474-88f2-fd286311ff1d',
    };
    const wrapper = mount(<HeaderBreadCrumb {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot('bread crumb component');
    expect(wrapper.props()).toMatchSnapshot('bread crumb props');
    wrapper.unmount();
  });
  it('renders the users breadcrumb when userId is undefined', () => {
    const props = {
      userId: undefined,
    };
    const wrapper = mount(<HeaderBreadCrumb {...props} />);
    expect(wrapper.props()).toMatchSnapshot('bread crumb props');
    wrapper.unmount();
  });
  it('shows credentials as active', () => {
    const props = {
      userId: '97f36061-52fb-4474-88f2-fd286311ff1d',
    };
    const wrapper = shallow(<HeaderBreadCrumb {...props} />);
    const tab = wrapper.find('Tabs');
    tab.simulate('change', 'credentials');
    wrapper.update();
    expect(wrapper.props().activeKey).toEqual('credentials');
    tab.simulate('change', 'details');
    wrapper.update();
    expect(wrapper.props().activeKey).toEqual('details');
    tab.simulate('change', 'groups');
    wrapper.update();
    expect(wrapper.props().activeKey).toEqual('groups');
    wrapper.unmount();
  });
});
