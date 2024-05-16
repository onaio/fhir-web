import React from 'react';
import './index.css';
import { Descriptions, DescriptionsProps, Typography } from 'antd';

const { Text } = Typography;

export type SingleKeyValueClassOptions = 'light' | 'default';
export type SingleKeyValueClass = Record<SingleKeyValueClassOptions, string>;
export type KeyValuePairs = Record<string, React.ReactNode>;
export interface SingleKeyNestedValueProps extends DescriptionsProps {
  theme?: SingleKeyValueClassOptions;
  data: KeyValuePairs;
}
export interface ListFlatKeyValuesProps {
  data: KeyValuePairs;
  classnames?: string;
  theme?: SingleKeyValueClassOptions;
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
 * @param props - component data and theme
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

/**
 * Dryed out util for displaying keyValue ui under antD Description component
 *
 * @param props - component data and theme
 */
export const KeyValuesDescriptions = (props: SingleKeyNestedValueProps) => {
  const {
    data,
    theme,
    column = { xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 3 },
    ...extraProps
  } = props;
  return (
    <Descriptions size="small" column={column} {...extraProps}>
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

/**
 * Use for displaying single key value pair on same line
 *
 * @param props - data and styling class for the component
 */
export const SingleFlatKeyValue = (props: SingleKeyNestedValueProps) => {
  const { data, theme = 'default' } = props;
  const firstPair = Object.entries(data)[0];
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (firstPair === undefined) return null;
  const [key, value] = firstPair;
  const keyClass = `singleFlat-key__${theme}`;
  const valueClass = `singleFlat-value__${theme}`;

  return (
    <Text>
      <span className={keyClass}>{key}</span>: <span className={valueClass}>{value}</span>
    </Text>
  );
};

/**
 * Use for displaying multiple key value pair
 * Each key value pair is displayed on it's own line
 *
 * @param props - data and styling class for the component
 */
export const ListFlatKeyValues = (props: ListFlatKeyValuesProps) => {
  const { data, classnames, theme } = props;
  return (
    <div className={classnames}>
      {Object.entries(data).map(([key, value]) => {
        const keyValuePairing = { data: { [key]: value } };
        return (
          <React.Fragment key={key}>
            <SingleFlatKeyValue theme={theme} {...keyValuePairing} />
            <br></br>
          </React.Fragment>
        );
      })}
    </div>
  );
};
