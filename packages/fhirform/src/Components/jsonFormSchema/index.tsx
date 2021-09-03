import React, { Component } from "react";
import { useState } from "react";
import { render } from "react-dom";
import './index.css';
// import Form from "react-jsonschema-form";
import { model1FormData, model1Schema, model1UiSchema } from "./fixtures";
import { withTheme } from '@rjsf/core';
import { Theme as AntDTheme } from '@rjsf/antd';
import 'antd/dist/antd.css';

// Make modifications to the theme with your own fields and widgets

const Form = withTheme(AntDTheme);

const schema: any = {
    title: "Todo Tasks",
    type: "object",
    required: ["title"],
    properties: {
        title: { type: "string", title: "Title", default: "A new task" },
        done: { type: "boolean", title: "Done?", default: false }
    }
};

const formData = {
    title: "First task",
    done: true
};
/** 
 * type system is not inbuilt
 * still using class lifecycle methods
 */

const log = (type: any) => console.log.bind(console, type);

export function JsonFormRender() {
    const [changed, setChanged] = useState<any>();
    const [submitted, setSubmitted] = useState();

    return <>
    <h2> React Json schema form</h2>
    <div className='json-form' style={{ display: 'flex', flexDirection: 'row', }}>
        <div>
            <Form className="form" schema={model1Schema}
            uiSchema={model1UiSchema}
                formData={changed?.formData ?? model1FormData}
                onChange={data => setChanged(data)}
                onSubmit={log("submitted")}
                onError={log("errors")} />
        </div>
        <div>
            <pre>
                {JSON.stringify(changed, undefined, 2)}
            </pre>
        </div>
        <div>
            <pre>
                {JSON.stringify(submitted, undefined, 2)}
            </pre>
        </div>
    </div>
    </>
}
