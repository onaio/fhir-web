import React from 'react';
import { Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';

import { URL_LOCATION_GROUP_ADD, URL_LOCATION_GROUP_EDIT } from './constants';
import LocationGroupView from './components/LocationGroupView';
import LocationGroupAdd from './components/LocationGroupAdd';

/**
 * Location Group Module
 *
 * @returns {Element} - Location Group Module
 */
export const LocationGroupModule: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path={URL_LOCATION_GROUP_EDIT + '/:id'} component={LocationGroupAdd} />
        <Route path={URL_LOCATION_GROUP_ADD} component={LocationGroupAdd} />
        <Route component={LocationGroupView} />
      </Switch>
    </BrowserRouter>
  );
};

export default LocationGroupModule;
