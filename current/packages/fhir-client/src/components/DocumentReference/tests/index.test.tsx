import React from 'react';
import { DocumentReferenceDetails } from '../index';
import docResources from './docReference.json';
import { IfhirR4 } from '@smile-cdr/fhirts';
import { act } from 'react-dom/test-utils';
import toJson from 'enzyme-to-json';
import { mountWithProviders } from '../../../helpers/testUtils';
import fhir from 'fhirclient';
import flushPromises from 'flush-promises';

describe('DocumentReference', () => {
  test('documentDetails works correctly', async () => {
    window.URL.createObjectURL = jest.fn(() => 'urlObject');
    window.URL.revokeObjectURL = jest.fn();
    const mockBaseUrl = 'http://example.com';
    const wrapper = mountWithProviders(
      <DocumentReferenceDetails
        fhirBaseApiUrl={mockBaseUrl}
        documentResources={[docResources] as unknown as IfhirR4.IDocumentReference[]}
      />
    );

    const mockPdfBlob = new Blob(['some text'], { type: 'application/pdf' });

    fhir.client = () =>
      ({
        request: async () => new Response(mockPdfBlob, { status: 200 }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
    expect(wrapper.find('.doc-reference')).toHaveLength(1);
    const firstCollapseHeader = wrapper.find('.ant-collapse-header');
    expect(firstCollapseHeader).toHaveLength(1);
    expect(firstCollapseHeader.text()).toEqual('Physical  current');

    // click on header
    firstCollapseHeader.simulate('click');

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    // values
    const valuesShown = wrapper.find('.fhir-ui__Value');
    expect(valuesShown).toHaveLength(7);
    valuesShown.forEach((valueComp) => {
      expect(toJson(valueComp)).toMatchSnapshot();
    });

    // lets look at the contents table
    wrapper.find('.doc-resource__content_table tr').forEach((tr) => {
      expect(tr.text()).toMatchSnapshot('table tr');
    });

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    // document Download link
    const linkTd = wrapper
      .find('.doc-resource__content_table tr')
      .at(1)
      .find('td')
      .last()
      .find('a');

    expect(toJson(linkTd)).toMatchSnapshot();

    expect(linkTd.props().href).toEqual('urlObject');

    wrapper.unmount();
  });
});
