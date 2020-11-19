import React from 'react';
import { Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';

import { URL_LOCATION_TAG_ADD, URL_LOCATION_TAG_EDIT } from './constants';
import LocationTagView from './components/LocationTagView';
import LocationTagAdd from './components/LocationTagAdd';

/**
 * Location Tag Module
 *
 * @returns {Element} - Location Tag Module
 */
export const LocationTagModule: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path={URL_LOCATION_TAG_EDIT + '/:id'} component={LocationTagAdd} />
        <Route path={URL_LOCATION_TAG_ADD} component={LocationTagAdd} />
        <Route component={LocationTagView} />
      </Switch>
    </BrowserRouter>
  );
};

export default LocationTagModule;
