import { convertQuestionnaireToLForms } from "../QtoSchema";
import { sampleCovidQ } from "../../fixtures/Q";
import QJson from "../../fixtures/Q copy.json";

describe("converter utils", () => {
  it("flattens the questionnaire when creating linkItem map", () => {
    const response = convertQuestionnaireToLForms(QJson);
    expect(JSON.stringify(response)).toEqual(undefined);
  });
});
