import React from 'react';
import { shallow, mount } from 'enzyme';
import { TableActions } from '..';
import { fixManifestReleases } from '../../../../helpers/fixtures';
import toJson from 'enzyme-to-json';
import { BrowserRouter } from 'react-router-dom';

describe('components/Antd/ReleaseList', () => {
  const props = {
    file: fixManifestReleases[0],
    viewReleaseURL: '/releases',
  };

  it('renders without crashing', () => {
    shallow(<TableActions {...props} />);
  });

  it('renders correctly', () => {
    const wrapper = mount(
      <BrowserRouter>
        <TableActions {...props} />
      </BrowserRouter>
    );

    expect(toJson(wrapper.find('TableActions'))).toMatchSnapshot();

    wrapper.unmount();
  });
});
