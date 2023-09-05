import { store } from '@opensrp/store';
import { Provider } from 'react-redux';
import React from 'react';
import { RoleContext, UserRole, FhirResources, Permit, IamResources } from '@opensrp/rbac';
import { history } from '@onaio/connected-reducer-registry';
import { Router } from 'react-router';

export const superUserRole = new UserRole([...FhirResources, ...IamResources], Permit.MANAGE);

export interface ContextProviderProps {
  children: JSX.Element;
}

export const ContextProvider = (props: ContextProviderProps) => {
  const { children } = props;
  return (
    <Provider store={store}>
      <Router history={history}>
        <RoleContext.Provider value={superUserRole}>{children}</RoleContext.Provider>
      </Router>
    </Provider>
  );
};
