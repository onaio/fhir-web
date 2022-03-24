import React from 'react';
import { mount, shallow } from 'enzyme';
import flushPromises from 'flush-promises';
import nock from 'nock';
import { history } from '@onaio/connected-reducer-registry';
import * as fhirCient from 'fhirclient';
import * as fixtures from './fixtures';
import { act } from 'react-dom/test-utils';
import { Router } from 'react-router';
import { defaultInitialValues } from '..';
import { CareTeamForm } from '../Form';
import { getPatientName } from '../utils';
import Client from 'fhirclient/lib/Client';

/* eslint-disable @typescript-eslint/naming-convention */

jest.mock('antd', () => {
  const antd = jest.requireActual('antd');

  /* eslint-disable react/prop-types */
  const Select = ({ children, onChange }) => {
    return <select onChange={(e) => onChange(e.target.value)}>{children}</select>;
  };

  const Option = ({ children, ...otherProps }) => {
    return <option {...otherProps}>{children}</option>;
  };
  /* eslint-disable react/prop-types */

  Select.Option = Option;

  return {
    __esModule: true,
    ...antd,
    Select,
  };
});

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

describe('components/forms/CreateTeamForm', () => {
  const props = {
    initialValues: defaultInitialValues,
    fhirBaseURL: 'https://r4.smarthealthit.org/',
    practitioners: fixtures.practitioners.entry.map((p) => ({
      id: p.resource.id,
      name: getPatientName(p.resource),
    })),
    groups: fixtures.groups.entry.map((p) => ({
      id: p.resource.id,
      name: getPatientName(p.resource),
    })),
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders without crashing', () => {
    shallow(<CareTeamForm {...props} />);
  });

  it('renders correctly', async () => {
    const wrapper = mount(<CareTeamForm {...props} />);
    expect(wrapper.find('Row').at(0).text()).toMatchSnapshot();
    wrapper.unmount();
  });

  it('form validation works for required fields', async () => {
    const wrapper = mount(<CareTeamForm {...props} />);

    wrapper.find('form').simulate('submit');

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();

    expect(wrapper.find('FormItemInput').at(1).prop('errors')).toEqual([`'name' is required`]);

    wrapper.unmount();
  });

  it('adds new care team successfully', async () => {
    nock('https://fhir.smarthealthit.org/')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .post('/CareTeam', (body: any) => {
        expect(body).toMatchObject({
          id: '308',
          identifier: [{ use: 'official', value: '93bc9c3d-6321-41b0-9b93-1275d7114e22' }],
          meta: {
            lastUpdated: '2021-06-18T06:07:29.649+00:00',
            source: '#9bf085bac3f61473',
            versionId: '4',
          },
          name: 'Care Team One',
          participant: [
            { member: { reference: 'Practitioner/206' } },
            { member: { reference: 'Practitioner/103' } },
          ],
          resourceType: 'CareTeam',
          status: 'active',
          subject: { reference: 'Group/306' },
        });
        return true;
      })
      .reply(200, 'CareTeam created successfully');

    const wrapper = mount(<CareTeamForm {...props} />);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const client = new Client({} as any, {
      serverUrl: 'https://fhir.smarthealthit.org/',
    });

    const result = await client.create(fixtures.careTeam1);
    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    // ensure the post is made against the correct resource endpoint
    expect(result.url).toEqual('https://fhir.smarthealthit.org/CareTeam');

    // set team name
    const nameInput = wrapper.find('input#name');
    nameInput.simulate('change', { target: { name: 'name', value: 'Care Team Test' } });

    // set form fields
    wrapper
      .find('input#name')
      .simulate('change', { target: { name: 'name', value: 'Care Team Test' } });
    wrapper
      .find('input[type="radio"]')
      .first()
      .simulate('change', { target: { name: 'status', checked: true } });
    wrapper
      .find('select')
      .first()
      .simulate('change', {
        target: { value: ['Practitioner A'] },
      });
    wrapper
      .find('select')
      .at(1)
      .simulate('change', {
        target: { value: ['Group A'] },
      });
    wrapper.find('form').simulate('submit');

    await act(async () => {
      await flushPromises();
    });

    wrapper.update();

    expect(wrapper.find('form').text()).toMatchInlineSnapshot(
      `"UUIDNameStatusActiveInactiveParticipantWard N Williams MDWard N Williams MDWard N Williams MDtest fhirtest fhirtest fhirtest fhirtest fhirtest fhirtest fhirtest fhirtest fhirtest fhirtest fhirtest fhirMr. John CenoMr. Allay AllanBobi mapesaAllay Allanbrian krebsmarcus brownleejulian assangeSubjectSaveCancel"`
    );
    wrapper.unmount();
  });

  it('edits care team', async () => {
    const propEdit = {
      ...props,
      initialValues: {
        uuid: '93bc9c3d-6321-41b0-9b93-1275d7114e22',
        id: '308',
        name: 'Care Team One',
        status: 'active',
        practitionersId: ['206', '103'],
        groupsId: '306',
      },
    };

    const wrapper = mount(<CareTeamForm {...propEdit} />);

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });
    // usergroup name
    await act(async () => {
      const nameInput = wrapper.find('input#name');
      nameInput.simulate('change', { target: { name: 'name', value: 'Care Team Test1' } });
    });
    wrapper.update();

    wrapper.find('form').simulate('submit');

    await act(async () => {
      await flushPromises();
    });
    wrapper.update();
    expect(document.getElementsByClassName('ant-notification')).toHaveLength(1);
    wrapper.unmount();
  });

  it('Care Team is not created if api is down', async () => {
    const wrapper = mount(<CareTeamForm {...props} />);

    await act(async () => {
      await flushPromises();
    });

    wrapper.update();

    // set usersgroup  name
    const nameInput = wrapper.find('input#name');
    nameInput.simulate('change', { target: { name: 'name', value: 'Test' } });

    wrapper.find('form').simulate('submit');
    const fhir = jest.spyOn(fhirCient, 'client');
    fhir.mockImplementation(
      jest.fn().mockImplementation(() => {
        return {
          request: jest.fn().mockRejectedValue('API is down'),
        };
      })
    );
    await act(async () => {
      wrapper.update();
    });

    await flushPromises();
    wrapper.update();
    expect(document.getElementsByClassName('ant-notification')).toHaveLength(1);
    wrapper.unmount();
  });

  it('cancel button returns user to list view', async () => {
    const historyPushMock = jest.spyOn(history, 'push');
    const wrapper = mount(
      <Router history={history}>
        <CareTeamForm {...props} />
      </Router>
    );

    await act(async () => {
      await flushPromises();
    });

    wrapper.update();
    wrapper.find('.cancel-care-team').at(1).simulate('click');
    wrapper.update();
    expect(historyPushMock).toHaveBeenCalledTimes(1);
    expect(historyPushMock).toHaveBeenCalledWith('/admin/CareTeams');
  });
});
