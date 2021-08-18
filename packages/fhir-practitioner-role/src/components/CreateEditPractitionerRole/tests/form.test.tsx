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
import { PractitionerRoleForm } from '../Form';
import { getPatientName } from '../utils';
import Client from 'fhirclient/lib/Client';

/* eslint-disable @typescript-eslint/camelcase */

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

describe('components/forms/PractitionerRoleForm', () => {
  const props = {
    initialValues: defaultInitialValues,
    fhirBaseURL: 'https://r4.smarthealthit.org/',
    practitioners: fixtures.practitioners.entry.map((p) => ({
      id: p.resource.id,
      name: getPatientName(p.resource),
    })),
    organizations: fixtures.organizations.entry.map((p) => ({
      id: p.resource.id,
      name: getPatientName(p.resource),
    })),
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders without crashing', () => {
    shallow(<PractitionerRoleForm {...props} />);
  });

  it('renders correctly', async () => {
    const wrapper = mount(<PractitionerRoleForm {...props} />);
    expect(wrapper.find('Row').at(0).text()).toMatchSnapshot();
    wrapper.unmount();
  });

  it('adds new practitioner role successfully', async () => {
    nock('https://fhir.smarthealthit.org/')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .post('/PractitionerRole', (body: any) => {
        expect(body).toMatchObject({
          id: '388',
          identifier: [{ use: 'official', value: 'b3046485-1591-46b4-959f-02db30a2f622' }],
          organization: {
            reference: 'Organization/105',
          },
          resourceType: 'PractitionerRole',
          active: true,
          practitioner: { reference: 'Practitioner/206' },
        });
        return true;
      })
      .reply(200, 'Practitioner Role created successfully');

    const wrapper = mount(<PractitionerRoleForm {...props} />);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const client = new Client({} as any, {
      serverUrl: 'https://fhir.smarthealthit.org/',
    });

    const result = await client.create(fixtures.practitionerRole1);
    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    // ensure the post is made against the correct resource endpoint
    expect(result.url).toEqual('https://fhir.smarthealthit.org/PractitionerRole');

    // set form fields
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
        target: { value: ['Org A'] },
      });
    wrapper.find('form').simulate('submit');

    await act(async () => {
      await flushPromises();
    });

    wrapper.update();

    expect(wrapper.find('form').text()).toMatchInlineSnapshot(
      `"UUIDStatusActiveInactivePractitionerWard N Williams MDWard N Williams MDWard N Williams MDtest fhirtest fhirtest fhirtest fhirtest fhirtest fhirtest fhirtest fhirtest fhirtest fhirtest fhirtest fhirMr. John CenoMr. Allay AllanBobi mapesaOrganizationSavingCancel"`
    );
    wrapper.unmount();
  });

  it('edits practitioner role', async () => {
    const propEdit = {
      ...props,
      initialValues: {
        uuid: '93bc9c3d-6321-41b0-9b93-1275d7114e22',
        id: '388',
        active: true,
        practitionersId: '206',
        orgsId: '306',
      },
    };

    const wrapper = mount(<PractitionerRoleForm {...propEdit} />);

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });
    // usergroup name
    await act(async () => {
      wrapper
        .find('select')
        .first()
        .simulate('change', {
          target: { value: ['Practitioner B'] },
        });
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

  it('Practitioner Role is not created if api is down', async () => {
    const wrapper = mount(<PractitionerRoleForm {...props} />);

    await act(async () => {
      await flushPromises();
    });

    wrapper.update();

    wrapper
      .find('select')
      .first()
      .simulate('change', {
        target: { value: ['Practitioner B'] },
      });

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

    await new Promise<unknown>((resolve) => setImmediate(resolve));
    wrapper.update();
    expect(document.getElementsByClassName('ant-notification')).toHaveLength(1);
    wrapper.unmount();
  });

  it('cancel button returns user to list view', async () => {
    const historyPushMock = jest.spyOn(history, 'push');
    const wrapper = mount(
      <Router history={history}>
        <PractitionerRoleForm {...props} />
      </Router>
    );

    await act(async () => {
      await flushPromises();
    });

    wrapper.update();
    wrapper.find('.cancel-practitioner-role').at(1).simulate('click');
    wrapper.update();
    expect(historyPushMock).toHaveBeenCalledTimes(1);
    expect(historyPushMock).toHaveBeenCalledWith('/admin/PractitionerRole');
  });
});
