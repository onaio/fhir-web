import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import { Router } from 'react-router';
import { PostConfirmError } from '..';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

describe('post confirmation Error card page', () => {
  it('renders without crashing', () => {
    shallow(
      <Router history={history}>
        <PostConfirmError />
      </Router>
    );
  });

  it('renders and works correctly', () => {
    const props = {
      filename: 'defective.csv',
      errorObj: {
        errors: [
          {
            failureReason:
              'Product ID does not exist in product catalogue, Service point ID does not exist, Donor is not valid, PO Number should be a whole number',
            row: '1',
          },
          { failureReason: 'Service point ID does not exist', row: '2' },
          {
            failureReason:
              'Service point ID does not exist, UNICEF section is not valid, Donor is not valid',
            row: '3',
          },
          { failureReason: '', row: '' },
        ],
        rowsNumber: '3',
        rowsProcessed: '0',
      },
    };
    const wrapper = mount(
      <Router history={history}>
        <PostConfirmError {...props} />
      </Router>
    );

    // card title text
    expect(wrapper.find('.card-title').first().text()).toMatchSnapshot('card title');

    // fix csv instructions
    expect(toJson(wrapper.find('ol'))).toMatchSnapshot('fix csv instructions');

    // Table error page
    wrapper.find('tr').forEach((tr) => {
      expect(tr.text()).toMatchSnapshot('tr');
    });
  });
});
