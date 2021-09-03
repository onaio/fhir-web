import React from 'react';
import { AutoForm } from 'uniforms-antd';
import Ajv from 'ajv';
import { JSONSchemaBridge } from 'uniforms-bridge-json-schema';
import QSchema from '../../helpers/fixtures/Qschema.json';
import Qjson from '../../helpers/fixtures/Q.json';
import { easySchema, sampleJsonSchema } from './fixtures';
import {generateFormSchema, generateQR} from '../../helpers/converter';
import {convertQuestionnaireToLForms} from '../../helpers/lforms/QtoSchema'
import { sampleCovidQ } from '../../helpers/fixtures/Q';
import { useState } from 'react';


const sampleFormSchema = convertQuestionnaireToLForms(Qjson as any) as any;
const sampleSchema = sampleFormSchema
console.log('====>', JSON.stringify(sampleSchema))
const ajv = new Ajv({ allErrors: true, useDefaults: true });

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
  const [changed, setChanged]= useState<any>()
  const [submitted, setSubmitted]= useState<any>()

return <>
 <h2> Uniform antd form</h2>
  <div className='json-form' style={{ display: 'flex', flexDirection: 'row', }}>


    <div style={{padding: '10px'}}>
    <AutoForm schema={bridge} onSubmit={(payload: any) => {setSubmitted(payload)}} 
    onChangeModel={(payload: any) => {setChanged(payload); setSubmitted(generateQR(payload, sampleCovidQ))} }/>
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
            {JSON.stringify(submitted, undefined, 2)}
        </pre>
    </div>
</div>
</>
}