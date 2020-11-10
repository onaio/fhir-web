import React from 'react';
import { Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import LocationTagView from './components/LocationTagView';

/**
 * Location Tag Module
 *
 * @returns {Element} - Location Tag Module
 */
export const LocationTagModule: React.FC = () => {
  const baseurl = '/location/group';

  return (
    <BrowserRouter>
      <Switch>
        <Route component={LocationTagView} />
      </Switch>
    </BrowserRouter>
  );
};

export default LocationTagModule;
