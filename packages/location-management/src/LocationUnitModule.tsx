import React, { useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import ConnectedLocationUnitView from './components/LocationUnitView';

export default function LocationUnitModule() {
  let modulebaseurl = '';
  useEffect(() => {
    modulebaseurl = window.location.pathname;
  }, []);

  return (
    <BrowserRouter>
      <Switch>
        <Route exact component={ConnectedLocationUnitView} />
      </Switch>
    </BrowserRouter>
  );
}
