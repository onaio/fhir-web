import React from 'react';
import { Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { URL_LOCATION_UNIT_ADD, URL_LOCATION_UNIT_EDIT } from './constants';

import LocationUnitView from './components/LocationUnitView';
import LocationUnitAdd from './components/LocationUnitAddEdit';

/**
 * Location Unit Module
 *
 * @returns {Element} - Location Unit Module
 */
export const LocationUnitModule: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path={URL_LOCATION_UNIT_EDIT + '/:id'} component={LocationUnitAdd} />
        <Route path={URL_LOCATION_UNIT_ADD} component={LocationUnitAdd} />
        <Route exact component={LocationUnitView} />
      </Switch>
    </BrowserRouter>
  );
};

export default LocationUnitModule;
