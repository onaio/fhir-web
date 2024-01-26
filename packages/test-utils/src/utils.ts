import {fireEvent} from '@testing-library/react'
import userEvents from '@testing-library/user-event';

export interface SearchableSelectValues{
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
  