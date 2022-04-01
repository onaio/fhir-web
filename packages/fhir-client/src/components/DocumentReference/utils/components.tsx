/* eslint-disable @typescript-eslint/no-unnecessary-condition */
// inspired by: https://github.com/1uphealth/fhir-react/
import { Tag } from 'antd';
import React, { ReactNode } from 'react';
import { get } from 'lodash';
import { fhirR4 } from '@smile-cdr/fhirts';
import {
  fetchAttachmentForDownload,
  itemIsEmpty,
  ParsedDocReference,
  splitContentType,
} from './utils';
import { Column, TableLayout } from '@opensrp/react-utils';
import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { SyncOutlined } from '@ant-design/icons';

export interface ValueSectionProps {
  dataTestId?: string;
  children: ReactNode;
  label: string;
}

export type ValueProps = ValueSectionProps;

export const ValueSection = (props: ValueSectionProps) => {
  const { dataTestId, label, children } = props;
  return (
    <div className="fhir-ui__ValueSection" data-testid={dataTestId}>
      <label className="fhir-ui__ValueSection-label">{label}</label>
      <div className="fhir-ui__ValueSection-body">{children}</div>
    </div>
  );
};

export const Value = (props: ValueProps) => {
  const { dataTestId, children, label } = props;
  return (
    <div className="fhir-ui__Value">
      <label className="fhir-ui__Value-label">{label}</label>
      <div data-testid={dataTestId}>{children}</div>
    </div>
  );
};

export interface DocTitleProps {
  title?: string;
  status?: string;
}

export const DocTitle = ({ title, status }: DocTitleProps) => {
  return (
    <>
      {title}&nbsp;&nbsp;
      {status ? (
        <Tag>
          <span title="status"></span>
          {status}
        </Tag>
      ) : null}
    </>
  );
};

export interface CodingProps {
  coding: fhirR4.Coding;
}

/**
 * Render a Coding data type
 *
 * @param props - props for Rendering Coding
 */
export const Coding = (props: CodingProps) => {
  const { coding } = props;
  const display = get(coding, 'display', '');
  const code = get(coding, 'code', '');
  const system = get(coding, 'system', '');
  const hasAdditionalInfo = code || system;
  if (!code && !display) {
    return null;
  }
  return (
    <div className="fhir-datatype__Coding">
      {display && (
        <>
          <span className="fhir-datatype__Coding__title">{display}</span> &nbsp;
        </>
      )}
      {hasAdditionalInfo && (
        <span className="fhir-datatype__Coding__code" title={system}>
          ({code})
        </span>
      )}
    </div>
  );
};

export interface DocPropertyDisplayProps {
  parsedDoc: ParsedDocReference[0];
  fhirBaseUrl: string;
}

export const DocPropertyDisplay = (props: DocPropertyDisplayProps) => {
  const { parsedDoc, fhirBaseUrl } = props;
  const contentColumns = getColumns(fhirBaseUrl, parsedDoc.title ?? parsedDoc.id ?? '');
  return (
    <div className="doc-prop-display">
      {parsedDoc.title && (
        <h4 className="doc-resource__title">
          <DocTitle title={parsedDoc.title ?? parsedDoc.id} status={parsedDoc.status} />
        </h4>
      )}
      <div>
        {!itemIsEmpty(parsedDoc.documentType.codeList) && (
          <Value label="Document type">
            <Coding coding={parsedDoc.documentType.code}></Coding>
          </Value>
        )}
        {!itemIsEmpty(parsedDoc.securityCodes.codeList) && (
          <Value label="Security label">
            <Coding coding={parsedDoc.securityCodes.code}></Coding>
          </Value>
        )}
        {parsedDoc.createdAt && (
          <Value label="Created at">
            <span>{parsedDoc.createdAt}</span>
          </Value>
        )}
        {!itemIsEmpty(parsedDoc.context) && (
          <>
            <ValueSection label="Context">
              {!itemIsEmpty(parsedDoc.context.eventCoding) && (
                <Value label="Event" data-testid="context.event">
                  <Coding coding={parsedDoc.context.eventCoding} />
                </Value>
              )}
              {!itemIsEmpty(parsedDoc.context.facilityTypeCoding) && (
                <Value label="Facility" data-testid="context.facilityType">
                  <Coding coding={parsedDoc.context.facilityTypeCoding} />
                </Value>
              )}
              {!itemIsEmpty(parsedDoc.context.practiceSettingCoding) && (
                <Value label="Practice Setting" data-testid="context.practiceSetting">
                  <Coding coding={parsedDoc.context.practiceSettingCoding} />
                </Value>
              )}
              {(parsedDoc.context.periodStart || parsedDoc.context.periodEnd) && (
                <Value label="Period" data-testid="context.period">
                  {parsedDoc.context.periodStart} - {parsedDoc.context.periodEnd}
                </Value>
              )}
            </ValueSection>
          </>
        )}
        <ValueSection label="Content">
          <div className="doc-resource__content_table">
            <TableLayout
              datasource={parsedDoc.content}
              columns={contentColumns}
              pagination={false}
            ></TableLayout>
          </div>
        </ValueSection>
      </div>
    </div>
  );
};

/**
 * gets columns for table that shows content.attachments in a documentReference resource
 *
 * @param fhirBaseUrl - base url for fhir
 * @param docTitle - title of document, usually resource.description
 */
const getColumns = (
  fhirBaseUrl: string,
  docTitle: string
): Column<ParsedDocReference[0]['content'][0]>[] => [
  {
    title: 'S.no',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    render: function SerialNumber(_, __, index) {
      return <span>{index + 1}</span>;
    },
  },
  {
    title: 'Name',
    dataIndex: 'formatDisplay',
  },
  {
    title: 'Format',
    dataIndex: 'formatCode',
  },
  {
    className: 'doc-resource__content-table-action',
    title: 'Preview/Download',
    render: function ActionRender(fullObj: ParsedDocReference[0]['content'][0]) {
      const { attachment, formatContentType, formatCode } = fullObj;
      if (!formatContentType) {
        return null;
      }
      const { discretePart } = splitContentType(formatContentType);
      const imgSrcB64Prefix = `data:${formatContentType};base64,`;
      const filename = `${docTitle}.${formatCode}`;
      // render images using dataURL, otherwise render any other attachments using the url relative link
      const imgSrc = `${imgSrcB64Prefix} ${attachment.data}`;
      switch (discretePart) {
        case 'image':
          return <img alt={docTitle} src={imgSrc} />;
      }
      // handle only binary resources whose urls are a Binary relative path to this fhir server.
      if (attachment.binaryUrl) {
        return (
          <>
            <DownloadLink
              filename={filename}
              linkToResource={attachment?.binaryUrl}
              fhirBaseUrl={fhirBaseUrl}
            ></DownloadLink>
          </>
        );
      }
    },
  },
];

interface DownloadLinkProps {
  linkToResource: string;
  fhirBaseUrl: string;
  filename: string;
}

/**
 * link to download downloaded binary data
 *
 * @param props - Props for download link
 */
export const DownloadLink = (props: DownloadLinkProps) => {
  const { linkToResource, fhirBaseUrl, filename } = props;
  /**
   * using the url direct as a href of an anchor tag downloads the file with
   * the backend predefined filename, We have to download the file's binary data
   * and have the user download with a customizable filename
   */
  const { isLoading, data, isError } = useQuery(
    linkToResource,
    () => fetchAttachmentForDownload(fhirBaseUrl, linkToResource),
    { retry: false }
  );

  const [dataUrl, setDataUrl] = React.useState<string>();

  useEffect(() => {
    if (data) {
      const dUrl = URL.createObjectURL(data);
      setDataUrl(dUrl);
      return () => {
        URL.revokeObjectURL(dUrl);
      };
    }
  }, [data]);

  return (
    <>
      <a download={filename} className={isLoading || isError ? 'disabled-link' : ''} href={dataUrl}>
        Download
      </a>
      {isLoading && <SyncOutlined spin />}
    </>
  );
};
