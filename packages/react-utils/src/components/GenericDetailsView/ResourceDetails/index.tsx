import React from 'react';
import { DescriptionsProps, Divider, Tag, Typography } from 'antd';
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
  bodyData: Record<string, React.ReactNode> | (() => React.ReactNode);
  footer?: React.ReactNode;
  theme?: 'default' | 'light';
  column?: DescriptionsProps['column']; // Add column prop here
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
    theme = 'default',
    column,
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
      {typeof bodyData === 'function' ? (
        bodyData()
      ) : (
        <KeyValuesDescriptions theme={theme} data={bodyData} column={column} />
      )}
      {footer && (
        <>
          <Divider className="divider" />
          {footer}
        </>
      )}
    </div>
  );
};
