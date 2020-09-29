import { mount } from 'enzyme';
import React from 'react';
import { shallow } from 'enzyme';
import { Route, Switch } from 'react-router-dom';
import NotFound from '..';

const NotFoundLocation = 'pageurlwhichisnotavalible';

const App: React.FC = () => {
  return (
    <Switch>
      {/* tslint:disable-next-line: jsx-no-lambda */}
      <Route path="/" component={() => <div id="home" />} />
      {/* tslint:disable-next-line: jsx-no-lambda */}
      <Route path={`/${NotFoundLocation}`} component={() => <NotFound />} />
    </Switch>
  );
};

describe('src/components/NotFound', () => {
  beforeEach(() => {
    window.location.pathname = NotFoundLocation;
  });

  it('renders correctly', () => {
    const wrapper = mount(<App />);
    // should redirect to home
    expect(wrapper.find('.ant-result-404')).toHaveLength(1);
  });

  it('redirects to home', () => {
    const mockCallBack = jest.fn();

    const wrapper = shallow(<App />);
    wrapper.find('button').simulate('click');
    expect(mockCallBack.mock.calls).toHaveLength(1);

    expect(wrapper.find('.ant-result-404')).toHaveLength(0);
    expect(wrapper.find('#home')).toHaveLength(1);
  });
});
