import React from 'react';
import './index.css';

export type SingleKeyValueClassOptions = 'light' | 'default';
export type SingleKeyValueClass = Record<SingleKeyValueClassOptions, string>;
export type KeyValuePairs = Record<string, string | number | boolean | JSX.Element | undefined>;
export interface SingleKeyNestedValueProps {
  theme?: SingleKeyValueClassOptions;
  data: KeyValuePairs;
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

/**
 * Use for single key value pair
 *
 * @param props - key value pair map
 */
export const SingleKeyNestedValue = (props: SingleKeyNestedValueProps) => {
  const { data, theme = 'default' } = props;
  const firstPair = Object.entries(data)[0];
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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
