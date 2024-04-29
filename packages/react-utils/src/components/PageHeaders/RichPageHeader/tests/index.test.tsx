import React from 'react';
import { RichPageHeader } from '..';
import { render, cleanup, screen } from '@testing-library/react';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import userEvent from '@testing-library/user-event';

const history = createBrowserHistory();

const ComponentWrapper = (props) => {
  return (
    <Router history={history}>
      <RichPageHeader {...props} />
    </Router>
  );
};

afterEach(() => {
  jest.resetAllMocks();
  jest.clearAllMocks();
  jest.restoreAllMocks();
});

afterAll(() => {
  cleanup();
});

it('Renders as expected', async () => {
  const backBtnSpy = jest.spyOn(history, 'goBack');
  const pageURL = '/test/page';
  history.push(pageURL);
  render(<ComponentWrapper />);

  const container = document.querySelector('.ant-page-header');
  const breadCrumbElement = container?.querySelector('.ant-breadcrumb');
  expect(screen.getByText(/View details/)).toBeInTheDocument();
  expect(breadCrumbElement).toBeNull();

  expect(history.location.pathname).toEqual(pageURL);

  const backBtn = screen.getByRole('button');
  userEvent.click(backBtn);
  expect(backBtnSpy).toBeCalledTimes(1);
});

it('Renders as expected with props', async () => {
  const prevPageURL = '/users';
  const pageURL = `${prevPageURL}/details`;
  const breadCrumbProps = {
    items: [
      {
        title: 'Users',
        path: prevPageURL,
      },
      {
        title: 'User details',
      },
    ],
  };
  const pageHeaderProps = {
    subTitle: '1234',
  };
  const richPageHeaderProps = {
    pageHeaderProps,
    breadCrumbProps,
  };
  history.push(pageURL);
  render(<ComponentWrapper {...richPageHeaderProps} />);

  expect(screen.getByText(/View details/)).toBeInTheDocument();
  expect(screen.getByText(/123/)).toBeInTheDocument();
  expect(screen.getByText(/User details/)).toBeInTheDocument();

  expect(history.location.pathname).toEqual(pageURL);

  const usersLink = screen.getByRole('link', { name: /Users/i });
  userEvent.click(usersLink);
  expect(history.location.pathname).toEqual(prevPageURL);
});
