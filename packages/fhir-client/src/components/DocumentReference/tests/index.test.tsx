import React from 'react';
import { DocumentReferenceDetails } from '../index';
import docResources from './docReference.json';
import { IfhirR4 } from '@smile-cdr/fhirts';
import { mount } from 'enzyme';

test('documentDetails works correctly', async () => {
  const wrapper = mount(
    <DocumentReferenceDetails
      documentResources={(docResources as unknown) as IfhirR4.IDocumentReference[]}
    />
  );

  expect(wrapper.find('.documentResource-container')).toHaveLength(1);
  expect(wrapper.find('.documentResource-card')).toHaveLength(4);

  wrapper.find('.documentResource-card img').forEach((img) => {
    expect(img.props().src).toMatch(/data:image\/png;base64, .*/);
  });

  wrapper.unmount();
});
