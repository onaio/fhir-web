import { store } from '@opensrp/store';
import { Provider } from 'react-redux';
import React from 'react';
import { RoleContext, UserRole, FhirResources, Permit, IamResources } from '@opensrp/rbac';
import { history } from '@onaio/connected-reducer-registry';
import { Router } from 'react-router';
import {fireEvent} from '@testing-library/react'
import userEvents from '@testing-library/user-event';

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

interface SearchableSelectValues{
  selectId: string;
  searchOptionText: string;
  fullOptionText: string
  beforeFilterOptions: string[];
  afterFilterOptions: string[];

}

export function fillSearchableSelect(tddValues: SearchableSelectValues){
  const {selectId, fullOptionText, searchOptionText, beforeFilterOptions, afterFilterOptions} = tddValues;
  
  // simulate value selection for type
  const selectComponent = document.querySelector(`input#${selectId}`)!
  fireEvent.mouseDown(selectComponent);

  let optionTexts = [
    ...document.querySelectorAll(
      `#${selectId}_list+div.rc-virtual-list .ant-select-item-option-content`
    ),
  ].map((option) => {
    return option.textContent;
  });

  expect(optionTexts).toHaveLength(beforeFilterOptions.length);
  expect(optionTexts).toEqual(beforeFilterOptions);

  // filter searching through members works
  userEvents.type(selectComponent, searchOptionText);

  // options after search
  let afterFilterOptionTexts = [
    ...document.querySelectorAll(
      `#${selectId}_list+div.rc-virtual-list .ant-select-item-option-content`
    ),
  ].map((option) => {
    return option.textContent;
  });

  expect(afterFilterOptionTexts).toEqual(afterFilterOptions);

  fireEvent.click(document.querySelector(`[title="${fullOptionText}"]`)!);
}


// TODO - extract this functionality to its own module.