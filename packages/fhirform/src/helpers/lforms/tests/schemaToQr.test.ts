import { convertLFormsToQuestionnaireResponse, createQuestionnaireResponse } from "../schematoQ";
import { qr, schema } from "./fixtures";

test("creates questionnaire Response", () => {
    const mockFormData = {
        "/G1": [
          {
            "/G1/Q1": "this fa"
          }
        ]
      }
    const response = createQuestionnaireResponse(schema, mockFormData);
  
    expect(JSON.stringify(response)).toEqual(JSON.stringify(qr));
  });
