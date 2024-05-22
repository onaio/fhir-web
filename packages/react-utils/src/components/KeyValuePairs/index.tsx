import React from 'react';
import './index.css';
import { Descriptions, Typography } from 'antd';

const { Text } = Typography;

export type SingleKeyValueClassOptions = 'light' | 'default';
export type SingleKeyValueClass = Record<SingleKeyValueClassOptions, string>;
export type KeyValuePairs = Record<string, React.ReactNode>;

export interface SingleKeyNestedValueProps {
  theme?: SingleKeyValueClassOptions;
  data: KeyValuePairs;
  column?: number;  // Add column prop here
}

export interface ListFlatKeyValuesProps {
  data: KeyValuePairs;
  classnames?: string;
}

const singleKeyValueClass: SingleKeyValueClass = {
  light: 'singleKeyValue-pair__light',
  default: 'singleKeyValue-pair__default',
};

export const KeyValueGrid = (props: KeyValuePairs) => {
  return (
    <dl className="keyValueGrid">
      {Object.entries(props).map(([key, value]) => {
        return (
          <div key={key} className="keyValueGrid-pair">
            <dt className="keyValueGrid-pair__label">{key}</dt>
            <dd className="keyValueGrid-pair__value">{value}</dd>
          </div>
        );
      })}
    </dl>
  );
};

export const SingleKeyNestedValue = (props: SingleKeyNestedValueProps) => {
  const { data, theme = 'default' } = props;
  const firstPair = Object.entries(data)[0];
  if (firstPair === undefined) return null;
  const [key, value] = firstPair;
  const keyValueClass = singleKeyValueClass[theme];
  return (
    <dl className="singleKeyValue">
      <div className={keyValueClass}>
        <dt>{key}</dt>
        <dd>{value}</dd>
      </div>
    </dl>
  );
};

export const renderObjectAsKeyvalue = (obj: Record<string, unknown>) => {
  return (
    <>
      {Object.entries(obj).map(([key, value]) => {
        const props = {
          data: { [key]: value } as KeyValuePairs,
        };
        return value ? (
          <div key={key} data-testid="key-value">
            <SingleKeyNestedValue {...props} />
          </div>
        ) : null;
      })}
    </>
  );
};

export const KeyValuesDescriptions = (props: SingleKeyNestedValueProps) => {
  const { data, theme, column = 3 } = props;  // Default column to 3 if not provided
  return (
    <Descriptions size="small" column={column}>  // Use column prop here
      {Object.entries(data).map(([key, value]) => {
        const keyValuePairing = { [key]: value };
        return (
          <Descriptions.Item key={key}>
            <SingleKeyNestedValue theme={theme} data={keyValuePairing} />
          </Descriptions.Item>
        );
      })}
    </Descriptions>
  );
};

export const SingleFlatKeyValue = (obj: KeyValuePairs) => {
  const firstPair = Object.entries(obj)[0];
  if (firstPair === undefined) return null;
  const [key, value] = firstPair;

  return (
    <Text>
      {key}: {value}
    </Text>
  );
};

export const ListFlatKeyValues = (props: ListFlatKeyValuesProps) => {
  const { data, classnames } = props;
  return (
    <div className={classnames}>
      {Object.entries(data).map(([key, value]) => {
        const keyValuePairing = { [key]: value };
        return (
          <React.Fragment key={key}>
            <SingleFlatKeyValue {...keyValuePairing} />
            <br />
          </React.Fragment>
        );
      })}
    </div>
  );
};
