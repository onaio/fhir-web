import React from 'react';
import { Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';

import LocationUnitView from './components/LocationUnitView';

export default function LocationUnitModule() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact component={LocationUnitView} />
      </Switch>
    </BrowserRouter>
  );
}
