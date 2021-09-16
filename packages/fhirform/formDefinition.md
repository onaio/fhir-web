# Form Definition Format

The forms rendered by the LForms widget are defined in an extenstion of json schema format, While the questions can be translated directly to a json-schema presentation; fhir also defines other options that can modify how the user interacts with the question in several ways such as the cardinality of a question. Where this metadata is not directly translatable to a json-schema standard, we define custom key value pairs that represent this information in the generated json-schema.

The basic structure (some of which is optional) is shown below

PS: this is still WIP and very likely to change.

```
    {
      ...<fhir questionnaire top level data and metadata>
      "schema": string,
      "name": string,
      "title": string,
      "type": "object",
      "code": string,
      "codeSystem": string,
      "codeList": Array<object>,
      "properties": {
        "<linkId>": {
          type: [types](http://json-schema.org/understanding-json-schema/reference/type.html),
          dataType: string,
          format: string,
          title: string,
          linkId: string,
          questionCode: string
          questionCodeSystem: string,
          codeList: Array<object>,
          prefix: string | number,
          readOnly: boolean,
          pattern: Regex,
          minLength: number,
          maxLength: number,
          restrictions:{
            minInclusive: number,
            maxExclusive: number
          }
          displayControl: {
            code: string
          }
        }
      }
    }
```