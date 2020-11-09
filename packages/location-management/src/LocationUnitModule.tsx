import React from 'react';
import { Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { URL_ADD_LOCATIONS_UNIT } from './constants';

import ConnectedLocationUnitView from './components/LocationUnitView';
import LocationUnitAdd from './components/LocationUnitAdd';

/**
 * Location Unit Module
 *
 * @returns {Element} - Location Unit Module
 */
export const LocationUnitModule: React.FC = () => {
  const baseurl = '/location/unit';

  return (
    <BrowserRouter>
      <Switch>
        <Route path={baseurl + URL_ADD_LOCATIONS_UNIT} component={LocationUnitAdd} />
        <Route exact component={ConnectedLocationUnitView} />
      </Switch>
    </BrowserRouter>
  );
};

export default LocationUnitModule;
