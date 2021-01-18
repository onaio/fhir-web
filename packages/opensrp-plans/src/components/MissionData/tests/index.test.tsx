import React from 'react';
import { mount, shallow } from 'enzyme';
import { MissionData } from '..';
import { eusmPlans } from '../../../ducks/planDefinitions/tests/fixtures';
import { PlanDefinition } from '@opensrp/plan-form-core';
import { act } from 'react-dom/test-utils';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetch = require('jest-fetch-mock');
const plan = eusmPlans[0] as PlanDefinition;

describe('mission data download', () => {
  /* eslint-disable @typescript-eslint/camelcase */
  const missionDataPayload = [
    {
      total_records: 13,
      tasks: [],
    },
    {
      total_records: 7,
      tasks: [],
    },
    {
      total_records: 3,
      tasks: [],
    },
  ];
  afterEach(() => {
    fetch.resetMocks();
  });
  const props = {
    plan,
  };
  it('renders without crashing', () => {
    shallow(<MissionData {...props} />);
  });
  it('renders correctly', async () => {
    missionDataPayload.forEach((taskCount) => {
      fetch.once(JSON.stringify(taskCount));
    });
    const props = {
      plan,
    };
    const wrapper = mount(<MissionData {...props} />);

    /** loading view */
    /* eslint-disable no-irregular-whitespace */
    expect(wrapper.text()).toMatchInlineSnapshot(
      `"Mission dataFetching mission indicators dataService points visited: Products checked: Number of flagged products: Download mission data"`
    );

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    // show counts for mission data service points visited
    expect(wrapper.text()).toMatchInlineSnapshot(
      `"Mission dataService points visited: 13Products checked: 7Number of flagged products: 3Download mission data"`
    );
    expect(wrapper.find('Button').text()).toEqual('Download mission data');
  });

  it('shows broken page', async () => {
    missionDataPayload.forEach(() => {
      fetch.mockRejectOnce(new Error('Something went wrong'));
    });
    const wrapper = mount(<MissionData {...props} />);

    /** loading view */
    expect(wrapper.text()).toMatchInlineSnapshot(
      `"Mission dataFetching mission indicators dataService points visited: Products checked: Number of flagged products: Download mission data"`
    );

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    /** error view */
    expect(wrapper.text()).toMatchInlineSnapshot(
      `"Mission dataSomething went wrongService points visited: Products checked: Number of flagged products: Download mission data"`
    );
  });
  it('shows no data found', async () => {
    missionDataPayload.forEach(() => {
      fetch.once(JSON.stringify(null));
    });
    const wrapper = mount(<MissionData {...props} />);

    /** loading view */
    expect(wrapper.text()).toMatchInlineSnapshot(
      `"Mission dataFetching mission indicators dataService points visited: Products checked: Number of flagged products: Download mission data"`
    );

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    /** error view */
    expect(wrapper.text()).toMatchInlineSnapshot(
      `"Mission dataNo data foundService points visited: Products checked: Number of flagged products: Download mission data"`
    );
  });
});
