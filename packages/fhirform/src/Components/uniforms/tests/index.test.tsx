import { traverseSchema } from '..';
import Qjson from '../../../helpers/fixtures/Q.json';
import { convertQuestionnaireToLForms } from '../../../helpers/lforms/QtoSchema';

const response = '';


test('traverse schema recreates the tree correctly', () => {
    const generatedSchema = convertQuestionnaireToLForms(Qjson as any)
    const result = traverseSchema(generatedSchema);
    // expect(JSON.stringify(result)).toEqual(response)
    expect(result).toEqual(generatedSchema)
})




