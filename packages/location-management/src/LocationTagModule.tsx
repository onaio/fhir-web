import React from 'react';
import { Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { URL_ADD_LOCATIONS_TAG } from './constants';
import { Link } from 'react-router-dom';

import LocationTagAdd from './components/LocationTagAdd';

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
        <Route path={baseurl + URL_ADD_LOCATIONS_TAG} component={LocationTagAdd} />
        <Route
          render={() => (
            <div>
              <Link to={baseurl + URL_ADD_LOCATIONS_TAG} className="admin-link">
                locations unit group
              </Link>
            </div>
          )}
        />
      </Switch>
    </BrowserRouter>
  );
};

export default LocationTagModule;
