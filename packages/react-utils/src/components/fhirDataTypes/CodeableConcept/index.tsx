import { CodeableConcept as TCodeableConcept } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/codeableConcept';
import { Tooltip } from 'antd';
import { Coding } from '../Coding';
import { Typography } from 'antd';
import React from 'react';

const { Text } = Typography;

export interface CodeableConceptProps {
  concept: TCodeableConcept;
}

export const CodeableConcept = (props: CodeableConceptProps) => {
  const { concept } = props;
  const { coding, text } = concept;

  const codingsTitle = (
    <>
      {(coding ?? []).map((coding, index) => (
        <>
          <Coding key={`coding-${index}`} coding={coding}></Coding>,{' '}
        </>
      ))}
    </>
  );
  return <Tooltip title={codingsTitle} color='white'>{text ? <Text>{text}</Text> : codingsTitle}</Tooltip>;
};
