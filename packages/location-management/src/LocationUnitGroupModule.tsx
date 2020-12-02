import React from 'react';
import { Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';

import { URL_LOCATION_UNIT_GROUP_ADD, URL_LOCATION_UNIT_GROUP_EDIT } from './constants';
import LocationUnitGroupView from './components/LocationUnitGroupView';
import LocationUnitGroupAdd from './components/LocationUnitGroupAddEdit';

/**
 * Location Unit Group Module
 *
 * @returns {Element} - Location Unit Group Module
 */
export const LocationUnitGroupModule: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path={URL_LOCATION_UNIT_GROUP_EDIT + '/:id'} component={LocationUnitGroupAdd} />
        <Route path={URL_LOCATION_UNIT_GROUP_ADD} component={LocationUnitGroupAdd} />
        <Route component={LocationUnitGroupView} />
      </Switch>
    </BrowserRouter>
  );
};

export default LocationUnitGroupModule;
