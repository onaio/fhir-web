import React from 'react';
import { shallow, mount } from 'enzyme';
import { ActivateMissionCard } from '..';
import toJson from 'enzyme-to-json';
import { eusmPlans } from '../../../ducks/planDefinitions/tests/fixtures';
import { PlanDefinition, PlanStatus } from '@opensrp/plan-form-core';
import {
  FAILED_TO_ACTIVATE_MISSION,
  ONLY_DRAFT_MISSIONS_CAN_BE_ACTIVATED,
  SUCCESSFULLY_ACTIVATED_MISSION,
} from '../../../lang';
import { act } from 'react-dom/test-utils';
import * as notifications from '@opensrp/notifications';

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

const plan = eusmPlans[0];

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetch = require('jest-fetch-mock');

describe('activate mission', () => {
  it('renders without crashing', () => {
    shallow(<ActivateMissionCard />);
  });

  it('renders correctly for null plans', () => {
    const wrapper = mount(<ActivateMissionCard />);
    // should be nothing rendered
    expect(toJson(wrapper.find('.activate-plan'))).toMatchInlineSnapshot(`null`);
  });

  it('does not show for non-draft plans', () => {
    // plan is active
    const props = {
      plan: plan as PlanDefinition,
    };
    const wrapper = mount(<ActivateMissionCard {...props} />);
    expect(toJson(wrapper.find('.activate-plan'))).toMatchInlineSnapshot(`null`);
    expect(wrapper.find('button')).toHaveLength(0);
  });

  it('works correctly for draft plans', async () => {
    fetch.once(JSON.stringify({}));
    // plan is active
    const mockCallback = jest.fn();
    const sendSuccessMock = jest.spyOn(notifications, 'sendSuccessNotification');
    const mission = {
      ...plan,
      status: PlanStatus.DRAFT,
    };
    const props = {
      plan: mission as PlanDefinition,
      submitCallback: mockCallback,
    };
    const wrapper = mount(<ActivateMissionCard {...props} />);
    expect(wrapper.text().includes(ONLY_DRAFT_MISSIONS_CAN_BE_ACTIVATED)).toBeFalsy();
    // renders the activate button
    expect(wrapper.find('button')).toHaveLength(1);

    // simulate click on activate mission button
    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.find('button').simulate('click');
      wrapper.update();
    });

    const expectedMission = {
      ...mission,
      status: PlanStatus.ACTIVE,
    };

    // check if we made the correct call.
    expect(fetch.mock.calls).toEqual([
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/plans',
        {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          body: JSON.stringify(expectedMission),
          headers: {
            accept: 'application/json',
            authorization: 'Bearer null',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'PUT',
        },
      ],
    ]);

    // check callback was called
    expect(mockCallback).toHaveBeenCalledWith(expectedMission);

    expect(sendSuccessMock).toHaveBeenCalledWith(SUCCESSFULLY_ACTIVATED_MISSION);
    sendSuccessMock.mockRestore();
  });

  it('sends an error toast if error occurs', async () => {
    const errorMessage = 'Enemy contact';
    fetch.mockReject(new Error(errorMessage));
    // plan is active
    const mockCallback = jest.fn();
    const sendErrorMock = jest.spyOn(notifications, 'sendErrorNotification');
    const mission = {
      ...plan,
      status: PlanStatus.DRAFT,
    };
    const props = {
      plan: mission as PlanDefinition,
      submitCallback: mockCallback,
    };
    const wrapper = mount(<ActivateMissionCard {...props} />);

    // simulate click on activate mission button
    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.find('button').simulate('click');
      wrapper.update();
    });

    // check callback was called
    expect(mockCallback).not.toHaveBeenCalled();

    expect(sendErrorMock).toHaveBeenCalledWith(FAILED_TO_ACTIVATE_MISSION);
    sendErrorMock.mockRestore();
  });
});
