import React from 'react';
import { mount, shallow } from 'enzyme';
import { MissionData } from '..';
import { eusmPlans, retiredDraftPlans } from '../../../ducks/planDefinitions/tests/fixtures';
import { PlanDefinition } from '@opensrp/plan-form-core';
import { act } from 'react-dom/test-utils';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetch = require('jest-fetch-mock');
const plan = eusmPlans[0] as PlanDefinition;

describe('mission data listing & download', () => {
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
      `"Mission dataFetching mission indicators dataService points visited: 0Products checked: 0Number of flagged products: 0Download mission data"`
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
      wrapper.update();
    });

    // show counts for mission data service points visited
    expect(wrapper.text()).toMatchInlineSnapshot(
      `"Mission dataService points visited: 13Products checked: 7Number of flagged products: 3Download mission data"`
    );
    expect(wrapper.find('Button').text()).toEqual('Download mission data');
    // downloads mission data
    expect(wrapper.find('a').at(0).props().href).toEqual(
      'https://opensrp-stage.smartregister.org/opensrp/rest/event/export-data?eventTypes=flag_problem,service_point_check,looks_good,record_gps&planIdentifier=335ef7a3-7f35-58aa-8263-4419464946d8'
    );
    expect(fetch.mock.calls).toEqual([
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/task/search?planIdentifier=335ef7a3-7f35-58aa-8263-4419464946d8&code=service_point_check&returnTaskCountOnly=true&status=Completed',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer null',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/task/search?planIdentifier=335ef7a3-7f35-58aa-8263-4419464946d8&code=product_check&returnTaskCountOnly=true&status=Completed',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer null',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/task/search?planIdentifier=335ef7a3-7f35-58aa-8263-4419464946d8&code=product_check&returnTaskCountOnly=true&status=Completed&businessStatus=has_problem',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer null',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
    ]);
  });

  it('shows broken page', async () => {
    missionDataPayload.forEach(() => {
      fetch.mockRejectOnce(new Error('Something went wrong'));
    });
    const wrapper = mount(<MissionData {...props} />);

    /** loading view */
    expect(wrapper.text()).toMatchInlineSnapshot(
      `"Mission dataFetching mission indicators dataService points visited: 0Products checked: 0Number of flagged products: 0Download mission data"`
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
      wrapper.update();
    });

    /** error view */
    expect(wrapper.text()).toMatchInlineSnapshot(
      `"Mission dataSomething went wrongService points visited: 0Products checked: 0Number of flagged products: 0Download mission data"`
    );
  });
  it('shows no data found', async () => {
    missionDataPayload.forEach(() => {
      fetch.once(JSON.stringify(null));
    });
    const wrapper = mount(<MissionData {...props} />);

    /** loading view */
    expect(wrapper.text()).toMatchInlineSnapshot(
      `"Mission dataFetching mission indicators dataService points visited: 0Products checked: 0Number of flagged products: 0Download mission data"`
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
      wrapper.update();
    });

    /** error view */
    expect(wrapper.text()).toMatchInlineSnapshot(
      `"Mission dataNo data foundService points visited: 0Products checked: 0Number of flagged products: 0Download mission data"`
    );
  });
  it('hides mission data section for a draft plan', async () => {
    missionDataPayload.forEach((taskCount) => {
      fetch.once(JSON.stringify(taskCount));
    });
    const plan = retiredDraftPlans[0] as PlanDefinition;
    const props = {
      plan,
    };
    const wrapper = shallow(<MissionData {...props} />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
      wrapper.update();
    });

    // renders null
    expect(wrapper.isEmptyRender()).toBe(true);
  });
  it('hides mission data section for retired', async () => {
    missionDataPayload.forEach((taskCount) => {
      fetch.once(JSON.stringify(taskCount));
    });
    const plan = retiredDraftPlans[1] as PlanDefinition;
    const props = {
      plan,
    };
    const wrapper = shallow(<MissionData {...props} />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
      wrapper.update();
    });

    // renders null
    expect(wrapper.isEmptyRender()).toBe(true);
  });
});
