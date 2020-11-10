import React from 'react';
import { Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { URL_LOCATION_UNIT_ADD } from './constants';

import ConnectedLocationUnitView from './components/LocationUnitView';
import LocationUnitAdd from './components/LocationUnitAdd';

/**
 * Location Unit Module
 *
 * @returns {Element} - Location Unit Module
 */
export const LocationUnitModule: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact component={LocationUnitAdd} />
        <Route exact component={ConnectedLocationUnitView} />
      </Switch>
    </BrowserRouter>
  );
};

export default LocationUnitModule;
