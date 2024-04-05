/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

export interface SearchableSelectValues {
  selectId: string;
  searchOptionText: string;
  fullOptionText: string;
  beforeFilterOptions: string[];
  afterFilterOptions: string[];
}

/**
 * @param searchableSelectOptions options
 */
export function fillSearchableSelect(searchableSelectOptions: SearchableSelectValues) {
  const { selectId, fullOptionText, searchOptionText, beforeFilterOptions, afterFilterOptions } =
    searchableSelectOptions;

  // simulate value selection for type
  const selectComponent = document.querySelector(`input#${selectId}`)!;
  fireEvent.mouseDown(selectComponent);

  const optionTexts = [
    ...document.querySelectorAll(
      `#${selectId}_list+div.rc-virtual-list .ant-select-item-option-content`
    ),
  ].map((option) => {
    return option.textContent;
  });

  expect(optionTexts).toHaveLength(beforeFilterOptions.length);
  expect(optionTexts).toEqual(beforeFilterOptions);

  // filter searching through members works
  userEvent.type(selectComponent, searchOptionText);

  // options after search
  const afterFilterOptionTexts = [
    ...document.querySelectorAll(
      `#${selectId}_list+div.rc-virtual-list .ant-select-item-option-content`
    ),
  ].map((option) => {
    return option.textContent;
  });

  expect(afterFilterOptionTexts).toEqual(afterFilterOptions);

  fireEvent.click(document.querySelector(`[title="${fullOptionText}"]`)!);
}
