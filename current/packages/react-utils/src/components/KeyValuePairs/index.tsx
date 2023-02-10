import React from 'react';
import { Typography } from 'antd';
import './index.css';

const { Text } = Typography;

type KeyValuePairs = Record<string, string | number | boolean | JSX.Element>;

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

/**
 * Use for single key value pair
 *
 * @param props - key value pair map
 */
export const SingleKeyNestedValue = (props: KeyValuePairs) => {
  const firstPair = Object.entries(props)[0];
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (firstPair === undefined) return null;
  const [key, value] = firstPair;
  return (
    <dl className="singleKeyValue">
      <div className="singleKeyValue-pair">
        <dt className="singleKeyValue-pair__label">
          <Text type={'secondary'}>{key}</Text>
        </dt>
        <dd className="singleKeyValue-pair__value">
          <Text>{value}</Text>
        </dd>
      </div>
    </dl>
  );
};

/**
 * Dryed out util for displaying keyValue ui for an obj
 *
 * @param obj - obj with info to be displayed
 */
export const renderObjectAsKeyvalue = (obj: Record<string, unknown>) => {
  return (
    <>
      {Object.entries(obj).map(([key, value]) => {
        const props = {
          [key]: value,
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
