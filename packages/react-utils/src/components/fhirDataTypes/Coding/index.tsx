import { Coding as TCoding } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/coding';
import { Typography } from 'antd';
import React from 'react';

const { Text } = Typography;

export interface CodingProps {
  coding: TCoding;
}

export const Coding = (props: CodingProps) => {
  const { display, system, code } = props.coding;
  let valueStr = '';

  if (display) {
    valueStr += display;
  }
  if (system) {
    valueStr += `(${system}|${code ? code : ''})`;
  }
  return <Text>{valueStr}</Text>;
};
