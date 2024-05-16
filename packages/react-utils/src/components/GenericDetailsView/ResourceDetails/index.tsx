import { DescriptionsProps, Divider, Tag, Typography } from 'antd';
import React from 'react';
import {
  KeyValuesDescriptions,
  ListFlatKeyValues,
  SingleKeyNestedValue,
} from '../../KeyValuePairs';
import '../index.css';

const { Text } = Typography;

export interface ResourceDetailsProps {
  title: React.ReactNode;
  headerLeftData: Record<string, React.ReactNode>;
  headerLeftDataClasses?: string;
  headerRightData?: Record<string, React.ReactNode | undefined>;
  headerActions?: React.ReactNode;
  status?: {
    title: string;
    color: string;
  };
  bodyData: Record<string, React.ReactNode>;
  footer?: React.ReactNode;
  descriptionProps?: DescriptionsProps;
}

export const ResourceDetails = (props: ResourceDetailsProps) => {
  const {
    title,
    headerLeftData,
    headerRightData,
    headerActions,
    bodyData,
    footer,
    status,
    headerLeftDataClasses,
    descriptionProps,
  } = props;
  return (
    <div data-testid="details-section" className="details-section">
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <div className="header-top">
          <Text strong>
            <span className="title">{title}</span>
            {status && (
              <Tag className="status" color={status.color}>
                {status.title}
              </Tag>
            )}
          </Text>
          {headerActions && <>{headerActions}</>}
        </div>

        <div className="header-bottom">
          <ListFlatKeyValues
            theme="light"
            classnames={headerLeftDataClasses}
            data={headerLeftData}
          />
          {headerRightData && (
            <div style={{ textAlign: 'right' }}>
              <SingleKeyNestedValue theme="light" data={headerRightData} />
            </div>
          )}
        </div>
      </div>
      <Divider className="divider" />
      <KeyValuesDescriptions {...descriptionProps} theme="default" data={bodyData} />
      {footer && (
        <>
          <Divider className="divider" />
          {footer}
        </>
      )}
    </div>
  );
};
