import React from 'react';
import { PreConfirmationError } from '..';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import { mount, shallow } from 'enzyme';

const history = createBrowserHistory();

describe('pre confirmation error card', () => {
  it('renders without crashing', () => {
    shallow(
      <Router history={history}>
        <PreConfirmationError />
      </Router>
    );
  });

  it('renders correctly', () => {
    const props = {
      errorObj: {
        errors: [
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
        <PreConfirmationError {...props} />
      </Router>
    );

    // full general snapshot
    expect(wrapper.text()).toMatchSnapshot('full general snapshot');

    // table with errors
    wrapper.find('tr').forEach((tr) => {
      expect(tr.text()).toMatchSnapshot('table row');
    });

    // we should have a retry button
    expect(wrapper.find('button').text).toMatchSnapshot();
  });
});
