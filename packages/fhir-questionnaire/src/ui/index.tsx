import React from 'react';
import type { ReactNode } from 'react';
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

interface BadgeProps {
  children: ReactNode;
  status: 'default';
}

export const SingleKeyNestedValue = (props: KeyValuePairs) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const firstPair = Object.entries(props)[0];
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
