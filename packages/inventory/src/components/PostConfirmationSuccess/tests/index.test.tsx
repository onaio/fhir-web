import { mount, shallow } from 'enzyme';
import { PostConfirmationSuccess } from '..';
import React from 'react';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';

const history = createBrowserHistory();

describe('post confirmation success card', () => {
  it('renders without crashing', () => {
    shallow(
      <Router history={history}>
        <PostConfirmationSuccess />
      </Router>
    );
  });

  it('works correctly', () => {
    const props = {
      rowsProcessed: 5,
      filename: 'processed.csv',
    };

    const wrapper = mount(
      <Router history={history}>
        <PostConfirmationSuccess {...props} />
      </Router>
    );

    // card title text
    expect(wrapper.find('.card-title').first().text()).toMatchSnapshot('card title');

    // card body
    expect(wrapper.text()).toMatchSnapshot('full snapshot');

    // expect button link
    expect(wrapper.find('button').text()).toMatchInlineSnapshot(`"Upload another file"`);
  });
});
