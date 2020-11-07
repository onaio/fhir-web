import React from 'react';
import { Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { URL_ADD_LOCATIONS_UNIT } from './constants';

import LocationUnitView from './components/LocationUnitView';
import LocationUnitAdd from './components/LocationUnitAdd';

export default function LocationUnitModule() {
  let modulebaseurl = '/location';

  return (
    <BrowserRouter>
      <Switch>
        <Route path={modulebaseurl + URL_ADD_LOCATIONS_UNIT} component={LocationUnitAdd} />
        <Route exact component={LocationUnitView} />
      </Switch>
    </BrowserRouter>
  );
}
