// test ExportModal
import { shallow } from 'enzyme';
import React from 'react';
import Loading from '../index';

describe('components/Loading', () => {
  it('renders without crashing', () => {
    shallow(<Loading />);
  });
});
