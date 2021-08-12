import React from 'react';
import { Card } from 'antd';
import { Dictionary } from '@onaio/utils';
import { transform } from 'lodash';
import { IfhirR4 } from '@smile-cdr/fhirts';
import { format } from 'date-fns';

export interface DocumentReferenceDetailsProps {
  documentResources: IfhirR4.IDocumentReference[];
}

/**
 * Extract attachments from a documentReference Resource
 *
 * @param resources - an array of documentReference
 */
const getAttachments = (resources: IfhirR4.IDocumentReference[]) => {
  return resources.map((resource) => {
    const { id, meta } = resource;
    const lastUpdated = meta?.lastUpdated
      ? format(new Date(meta.lastUpdated), 'yyyy-MM-dd HH:mm:ss')
      : undefined;
    const resourceAttachments = resource.content;
    const parsedAttachments = transform(
      resourceAttachments,
      (acc: Dictionary, resAttachment, _) => {
        const mimeType = resAttachment.attachment.contentType;
        if (!mimeType) {
          return false;
        }
        if (!acc[mimeType]) {
          acc[mimeType] = {};
        }
        acc[mimeType] = { url: resAttachment.attachment.data };
      },
      {}
    );
    return { id, lastUpdated, parsedAttachments };
  });
};

/** Renders details within a documentReference resource
 *
 * @param props - the props
 */
export const DocumentReferenceDetails = (props: DocumentReferenceDetailsProps) => {
  const { documentResources } = props;

  // using a very restrictive check of mime type image/png to identify qr code attachment
  const qrCodeMimeType = 'image/png';
  const imgSrcB64Prefix = 'data:image/png;base64,';
  const hasQrAttachment = (att: ReturnType<typeof getAttachments>[0]) =>
    !!att.parsedAttachments[qrCodeMimeType];

  return (
    <div className="documentResource-container">
      {getAttachments(documentResources).map((attach) => {
        if (hasQrAttachment(attach)) {
          const cardProps = {
            bordered: false,
            cover: (
              <img
                alt={attach.id}
                src={`${imgSrcB64Prefix} ${attach.parsedAttachments[qrCodeMimeType].url}`}
              />
            ),
          };
          return (
            <Card {...cardProps} key={attach.id} className="documentResource-card">
              <Card.Meta title={attach.id} description={attach.lastUpdated} />
            </Card>
          );
        }
        return undefined;
      })}
    </div>
  );
};
