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
  const modulebaseurl = '/location/group';

  return (
    <BrowserRouter>
      <Switch>
        <Route path={modulebaseurl + URL_ADD_LOCATIONS_TAG + '/:id'} component={LocationTagAdd} />
        <Route
          render={() => (
            <div>
              <Link to={modulebaseurl + URL_ADD_LOCATIONS_TAG} className="admin-link">
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
