import React from 'react';
import { GenericListTabsView } from '..';
import { Route, Router, Switch } from 'react-router';
import { createMemoryHistory } from 'history';
import { screen, fireEvent, render } from '@testing-library/react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AppWrapper = (props: any) => {
  return (
    <Switch>
      <Route exact path="/tabs">
        {(routeProps) => <GenericListTabsView {...{ ...props, ...routeProps }} />}
      </Route>
    </Switch>
  );
};

const props = {
  tabsData: [
    {
      tabViewId: 'tabView',
      sideViewQueryName: 'sideViewQuery',
      size: 'small',
      items: [
        {
          label: 'Tab A',
          key: 'tabA',
          children: <div>Tab A data</div>,
        },
        {
          label: 'Tab B',
          key: 'tabB',
          children: <div>Tab B data</div>,
        },
      ],
    },
  ],
};

it('renders correctly', async () => {
  const history = createMemoryHistory();
  history.push('/tabs?sideViewQuery=1');
  render(
    <Router history={history}>
      <AppWrapper {...props} />
    </Router>
  );

  expect(history.location.search).toEqual('?sideViewQuery=1');
  expect(screen.getByText(/Tab A data/)).toBeInTheDocument();
  // navigate to tab B
  fireEvent.click(document.querySelector('[data-node-key=tabB] .ant-tabs-tab-btn') as Element);
  expect(history.location.search).toEqual('?tabView=tabView&activeTab=tabB');
  expect(screen.getByText(/Tab B data/)).toBeInTheDocument();
  // navigate back to tab A
  fireEvent.click(document.querySelector('[data-node-key=tabA] .ant-tabs-tab-btn') as Element);
  expect(history.location.search).toEqual('?tabView=tabView&activeTab=tabA');
});

it('Sets acive tab from url', async () => {
  const history = createMemoryHistory();
  history.push('/tabs?tabView=tabView&activeTab=tabB');
  render(
    <Router history={history}>
      <AppWrapper {...props} />
    </Router>
  );

  expect(history.location.search).toEqual('?tabView=tabView&activeTab=tabB');
  expect(screen.getByText(/Tab B data/)).toBeInTheDocument();
});
