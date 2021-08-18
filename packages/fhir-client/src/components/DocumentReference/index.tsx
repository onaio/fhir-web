import React from 'react';
import { Card, Typography } from 'antd';
import { IfhirR4, fhirR4 } from '@smile-cdr/fhirts';
import { format } from 'date-fns';
import { CardProps } from 'antd/lib/card';
import { FilePdfOutlined } from '@ant-design/icons';
import { findObj } from './helpers/utils';

const { Text } = Typography;

export interface DocumentReferenceDetailsProps {
  documentResources: IfhirR4.IDocumentReference[];
}

/** parses docResources and extracts attachment data, filtering out those with empty string data uris
 *
 * @param docResources - documentReference resource array
 */
const getValidAttachments = (docResources: IfhirR4.IDocumentReference[]) => {
  // using a very restrictive check of mime type image/png to identify qr code attachment
  const qrCodeMimeType = 'image/png';
  const pdfMimeType = 'application/pdf';
  return docResources
    .map((docResource) => {
      const { id, meta } = docResource;
      const lastUpdated = meta?.lastUpdated
        ? format(new Date(meta.lastUpdated), 'yyyy-MM-dd HH:mm:ss')
        : undefined;
      const qrAttachment = findObj(docResource.content, {
        'attachment.contentType': qrCodeMimeType,
      }) as fhirR4.DocumentReferenceContent | undefined;
      const pdfAttachment = findObj(docResource.content, {
        'attachment.contentType': pdfMimeType,
      }) as fhirR4.DocumentReferenceContent | undefined;

      return {
        id,
        lastUpdated,
        qrAttachment,
        pdfAttachment,
      };
    })
    .filter(
      (parsedAttachment) =>
        parsedAttachment.qrAttachment?.attachment.data ||
        parsedAttachment.pdfAttachment?.attachment?.data
    );
};

/** Renders details within a documentReference resource
 *
 * @param props - the props
 */
export const DocumentReferenceDetails = (props: DocumentReferenceDetailsProps) => {
  const { documentResources } = props;
  const imgSrcB64Prefix = 'data:image/png;base64,';
  const pdfSrcB64Prefix = 'data:application/pdf;base64,';
  const validAttachments = getValidAttachments(documentResources);

  return (
    <div className="documentResource-container">
      {validAttachments.map((attachment) => {
        const { qrAttachment, pdfAttachment, id, lastUpdated } = attachment;

        const cardProps: CardProps = { bordered: true, id, className: 'documentResource-card' };
        if (qrAttachment && qrAttachment.attachment.data) {
          cardProps.cover = (
            <img alt={attachment.id} src={`${imgSrcB64Prefix} ${qrAttachment.attachment.data}`} />
          );

          return (
            <Card {...cardProps} key={id}>
              <div className="documentResource-card__meta">
                <div>
                  <Text strong>{id}</Text>
                  <Text type="secondary"> ({lastUpdated})</Text>
                </div>
                {pdfAttachment && pdfAttachment.attachment.data ? (
                  <a
                    download={`${id}.pdf`}
                    href={`${pdfSrcB64Prefix}${pdfAttachment.attachment.data}`}
                  >
                    {' '}
                    <FilePdfOutlined /> Download pdf{' '}
                  </a>
                ) : undefined}
              </div>
            </Card>
          );
        }

        return undefined;
      })}
    </div>
  );
};
