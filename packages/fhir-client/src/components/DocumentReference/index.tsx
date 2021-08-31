/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import React from 'react';
import { Collapse } from 'antd';
import { IfhirR4 } from '@smile-cdr/fhirts';
import { processDocumentReferences } from './helpers/utils';
import { DocPropertyDisplay, DocTitle } from './helpers/components';

const { Panel } = Collapse;

export interface DocumentReferenceDetailsProps {
  documentResources: IfhirR4.IDocumentReference[];
  fhirBaseApiUrl: string;
}

/** Renders details within a documentReference resource
 *
 * @param props - the props
 */
export const DocumentReferenceDetails = (props: DocumentReferenceDetailsProps) => {
  const { documentResources, fhirBaseApiUrl } = props;
  const extractedDocValues = processDocumentReferences(documentResources);

  return (
    <div className="doc-reference">
      <Collapse accordion={true}>
        {extractedDocValues.map((doc) => {
          return (
            <Panel
              header={<DocTitle title={doc.title ?? doc.id} status={doc.status} />}
              data-test-id={doc.id}
              key={doc.id as string}
            >
              <DocPropertyDisplay parsedDoc={doc} fhirBaseUrl={fhirBaseApiUrl} />
            </Panel>
          );
        })}
      </Collapse>
      ,
    </div>
  );
};
