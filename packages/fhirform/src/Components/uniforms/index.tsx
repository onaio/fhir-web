import React from 'react';
import { AutoForm, AutoField, DateField,  } from 'uniforms-antd';
import Ajv from 'ajv';
import { JSONSchemaBridge } from 'uniforms-bridge-json-schema';
import QSchema from '../../helpers/fixtures/Qschema.json';
import Qjson from '../../helpers/fixtures/Q.json';
import { easySchema, sampleJsonSchema } from './fixtures';
import { convertQuestionnaireToLForms } from '../../helpers/lforms/QtoSchema'
import { sampleCovidQ } from '../../helpers/fixtures/Q';
import { useState } from 'react';
import { createQuestionnaireResponse } from '../../helpers/lforms/schematoQ';
import './index.css';
// import {DatePicker} from 'antd';


const sampleFormSchema = convertQuestionnaireToLForms(Qjson as any) as any;
const sampleSchema = traverseSchema(sampleFormSchema, addUniformUiContextToSchema);
console.log('====>', JSON.stringify(sampleSchema))
const ajv = new Ajv({ allErrors: true, useDefaults: true, });

function createValidator(schema: object) {
  const validator = ajv.compile(sampleSchema);

  return (model: object) => {
    validator(model);
    return validator.errors?.length ? { details: validator.errors } : null;
  };
}

const schemaValidator = createValidator(sampleSchema);

export const bridge = new JSONSchemaBridge(sampleSchema, schemaValidator);

export function UniformAntd() {
  const [changed, setChanged] = useState<any>()
  const [submitted, setSubmitted] = useState<any>()
  return <>
    <h2> Uniform antd form</h2>
    <div className='json-form' style={{ display: 'flex', flexDirection: 'row', }}>


      <div style={{ padding: '10px' }}>
        <AutoField.componentDetectorContext.Provider
          value={(...args) => {
            console.log('\n\n===>', args);

            const [props, uniforms, ...rest] = args
            if(props.dataType === 'DTM' || props.dataType === 'DT' ){
              console.log('FinalProps', props)

            }
            const {componentProps, ...restProps} = props
            const finalProps = {...restProps, ...props.componentProps};
            if(finalProps.dataType === 'DTM' || finalProps.dataType === 'DT' ){
              console.log('FinalProps', finalProps)

            }
            return AutoField.defaultComponentDetector(finalProps, uniforms);
          }}
        >

          <AutoForm schema={bridge} onSubmit={(payload: any) => { setSubmitted(payload) }}
            onChangeModel={(payload: any) => { setChanged(payload); setSubmitted(createQuestionnaireResponse(payload, sampleCovidQ)) }} />
        </AutoField.componentDetectorContext.Provider>
      </div>
      <div>
        <h3>Changed</h3>
        <pre>
          {JSON.stringify(changed, undefined, 2)}
        </pre>
      </div>
      <div>
        <h3>Submitted</h3>
        <pre>
          {JSON.stringify(createQuestionnaireResponse(sampleSchema, changed), undefined, 2)}
        </pre>
      </div>
    </div>
  </>
}

/** relies on type of field, format if specified, and also the possibly optional displayControl
 * we use field to determine the general best control to use for data, then consider the formats
 * and finally check if overriden by display control, however we will disregard the displayControl
 * directive if its not compatible with either the fieldType of format.
 */




export function traverseSchema(itemSchema, callback?:(itemSchema: any) => any){
  let processedSchema: any = {};
  if (itemSchema.type === 'array'){
    const {items, ...otherFields} = itemSchema; 
    processedSchema = {...otherFields, items: traverseSchema(items, callback)};
  }
  else if(itemSchema.type === 'object'){
    const {properties, ...otherFields} = itemSchema;
    processedSchema = {...otherFields};
    processedSchema.properties = {};
    Object.values(properties).forEach((childItemSchema: any) => {
      // can be an object or an array.
      processedSchema.properties[childItemSchema.linkId] = traverseSchema(childItemSchema, callback);
    })
  }
  else{
    return callback?.(itemSchema) ?? itemSchema;
  }
  return processedSchema
}



export function addUniformUiContextToSchema(itemSchema){
  const rtn = {...itemSchema};
  rtn.uniforms = {};
  rtn.uniforms.componentProps = {}
  switch(itemSchema.dataType){
    case 'DTM':
    case 'TM':
    case 'DT':
      // rtn.uniforms.component = DateField;
      rtn.uniforms.componentProps.format="YYYY-MM-DD" // this will be a prop to the component used, but how is it going to get passed to the component
      break;
  }
  return rtn
}