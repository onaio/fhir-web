import { R4 } from '@ahryman40k/ts-fhir-types';
import { uuid } from 'uuidv4';
import { transform } from 'lodash';

export interface FhirJsonSchema {
  type?: string;
  title?: string;
  properties?: any;
  required?: string[];
}

export interface FhirJsonField {
  type?: string;
  title?: string;
  default?: string;
  description?: string;
  minimum?: number;
  maximum?: number;
  minLength?: number;
}


const JSON_SCHEMA_OBJECT_CONST = 'object';
// const JSON_SCHEMA_ARRAY_CONST = 'array';

export const itemIsGroup = (item: R4.IQuestionnaire_Item) => {
  return item.type === 'group';
};

export const generateItemSchema = (
  item: R4.IQuestionnaire_Item,
  altLinkId: string = ''
) => {
  let itemLinkId =
    typeof item.linkId === 'undefined' ? altLinkId : item.linkId.toString();

  return { [itemLinkId]: GetItemProperties(item) };
};

// refactor this with lodash.transform
const transformItems = (items: any[], parentLinkId = '') => {
  let accumulator = {};
  items.forEach((item, index) => {
    const currentGroupLinkId = `${parentLinkId}/G${index}`;
    const currentItemLinkId = `${parentLinkId}/Q${index}`;
    accumulator = {
      ...accumulator,
      ...(itemIsGroup(item)
        ? generateGroupSchema(item, currentGroupLinkId)
        : generateItemSchema(item, currentItemLinkId)),
    };
  });

  return accumulator;
};

export const generateGroupSchema = (
  group: R4.IQuestionnaire_Item,
  altLinkId: string = ''
) => {
  // convert a full group item into a json schema to be appended back to the parent json schema
  // use sequential numbers instead of GUIDS
  const jsonSchema = {} as any;
  // const uiSchema = {};
  const groupLinkId =
    typeof group.linkId === 'undefined' ? altLinkId : group.linkId.toString();
  const groupTitle =
    typeof group.text === 'undefined' ? altLinkId : group.text.toString();

  jsonSchema[groupLinkId] = {};
  jsonSchema[groupLinkId].type = JSON_SCHEMA_OBJECT_CONST;
  jsonSchema[groupLinkId].title = groupTitle;
  // should properties always be added even when this group item does not have questions
  jsonSchema[groupLinkId].properties = transformItems(
    group.item ?? [],
    altLinkId
  );

  return jsonSchema;
};

export const generateFormSchema = (fhirQuestionnaire: R4.IQuestionnaire) => {
  // const jsonSchema = {
  //   type: 'object',
  //   title: '',
  //   description: '',
  // };
  // const jsonSchemaProperties = {};
  let ALL_PROPERTIES: any = {};
  let requiredProperties: string[] = [];
  let UISchema: any = {};

  /**
   * lets think about creating the questionnaire response, will have formData
   * and the schema. The schema and formData are not going to be really different.
   * we can generate the data model alongside the schema, then have a function that
   * merges the formData with the pre-generated questionnaireResponse
   *
   * we can create different routines to generate the questionnaire response from the
   * formData
   *
   * we start with formData, but also realize that some data going int the questionnaireresponse
   * could come from the questionnaire itself and from external context like logged in practitioner.
   *
   */

  let fhirJsonSchema: FhirJsonSchema = {
    type: 'object',
    title: fhirQuestionnaire.id?.toString(),
    properties: transformItems(fhirQuestionnaire.item ?? []),
    required: requiredProperties,
  };

  return fhirJsonSchema;
};

/**
 * Takes a R4.IQuestionnaire_Item and returns a json schema for that item
 * @param {R4.IQuestionnaire_Item} item
 *
 * @returns {FhirJsonField} properties
 */
const GetItemProperties = (item: R4.IQuestionnaire_Item) => {
  const properties = ProcessQuestionnaireItem(item);
  const itemOptions = GetOptions(item);

  if (itemOptions !== '') {
    return { ...properties, ...itemOptions };
  }

  return properties;
};

/**
 * Takes a R4.IQuestionnaire_Item and returns the VueFormGeneratorField
 * @param {R4.IQuestionnaire_Item} item
 *
 * @returns {VueFormGeneratorField}
 */
const ProcessQuestionnaireItem = (item: R4.IQuestionnaire_Item) => {
  let ff_field: FhirJsonField = {
    type: GetControlType(item),
    title: item.text?.toString(),
  };
  return ff_field;
};

const GetOptions = (item: R4.IQuestionnaire_Item) => {
  let enumOptions: (string | number)[] = [];
  let enumNames: string[] = [];

  if (typeof item.answerOption !== 'undefined') {
    item.answerOption?.forEach(function(choice, _) {
      let code =
        typeof choice.valueCoding === 'undefined'
          ? ''
          : GetControlType(item) === 'integer'
          ? choice.valueCoding.code && parseInt(choice.valueCoding.code)
          : choice.valueCoding.code?.toString();

      enumOptions.push(typeof code === 'undefined' ? '' : code);

      let display = choice.valueCoding?.display?.toString();
      if (display !== undefined) {
        enumNames.push(display);
      }
    });

    const options = {
      enum: enumOptions,
      enumNames,
    };

    const ext: R4.IExtension = (item.extension || [])[0];
    const coding: R4.ICoding = (ext?.valueCodeableConcept?.coding || [])[0];

    if (coding?.code === EXTENSION_CHECKBOX) {
      return {
        uniqueItems: true,
        items: {
          type: 'string',
          ...options,
        },
      };
    }

    return options;
  }
  return '';
};

const GetWidget = (item: R4.IQuestionnaire_Item) => {
  if (
    item.type === R4.Questionnaire_ItemTypeKind._date ||
    item.type === R4.Questionnaire_ItemTypeKind._dateTime ||
    item.type === R4.Questionnaire_ItemTypeKind._time
  ) {
    return 'datetime';
  }
  if (
    item.type == R4.Questionnaire_ItemTypeKind._choice ||
    item.type == R4.Questionnaire_ItemTypeKind._openChoice ||
    item.type == R4.Questionnaire_ItemTypeKind._integer
  ) {
    const ext: R4.IExtension = (item.extension || [])[0];
    const coding: R4.ICoding = (ext?.valueCodeableConcept?.coding || [])[0];

    if (coding?.code && extensionToWidget[coding?.code]) {
      return extensionToWidget[coding?.code];
    }
  }
  // if (item.type === R4.Questionnaire_ItemTypeKind._boolean) {
  //   return 'boolean';
  // }
  return '';
};

type TUIOptions = {
  unit?: string;
  step?: number;
  min?: number;
  max?: number;
};

const GetUIOptions = (item: R4.IQuestionnaire_Item) => {
  const extensions = item.extension;

  return extensions?.reduce((uiOptions: TUIOptions, ext) => {
    const splitUrl = ext?.url?.split('/');
    const extensionName = splitUrl && splitUrl[splitUrl.length - 1];

    switch (extensionName) {
      case 'questionnaire-unit':
        uiOptions['unit'] = ext?.valueCoding?.display;
        break;
      case 'questionnaire-sliderStepValue':
        uiOptions['step'] = ext?.valueInteger;
        break;
      case 'minValue':
        uiOptions['min'] = ext?.valueInteger;
        break;
      case 'maxValue':
        uiOptions['max'] = ext?.valueInteger;
        break;
      default:
        break;
    }

    return uiOptions;
  }, {});
};

export const generateItemResponse = (
  item: R4.IQuestionnaire_Item,
  altLinkId: string
) => {
  let itemLinkId =
    typeof item.linkId === 'undefined' ? altLinkId : item.linkId.toString();
  return { linkId: itemLinkId, ...CreateResponseItem(item) };
};

export const generateGroupResponse = (
  group: R4.IQuestionnaire_Item,
  altLinkId: string
) => {
  // convert a full group item into a json schema to be appended back to the parent json schema
  // use sequential numbers instead of GUIDS
  const jsonSchema = {} as any;
  // const uiSchema = {};
  const groupLinkId =
    typeof group.linkId === 'undefined' ? altLinkId : group.linkId.toString();
  const groupTitle =
    typeof group.text === 'undefined' ? altLinkId : group.text.toString();

  // jsonSchema = {};
  jsonSchema.linkId = groupLinkId;
  jsonSchema.text = groupTitle;
  // should properties always be added even when this group item does not have questions
  jsonSchema.item = getResponseItem(group.item ?? [], altLinkId);

  return jsonSchema;
};

// refactor this with lodash.transform
export const getResponseItem = (items: any[], parentLinkId = '') => {
  let accumulator = [] as any;
  items.forEach((item, index) => {
    const currentGroupLinkId = `${parentLinkId}/G${index}`;
    const currentItemLinkId = `${parentLinkId}/Q${index}`;
    let oSpread;
    if(itemIsGroup(item)){
      console.log('====>', generateGroupResponse, generateItemResponse);
      oSpread = generateGroupResponse(item, currentGroupLinkId)
    }else{
      console.log('====>', generateItemResponse, generateItemResponse);
      oSpread = generateItemResponse(item, currentItemLinkId)
    }
    accumulator = [
      ...accumulator,
      ...[oSpread],
    ];
  });

  return accumulator;
};

export const generateQResponseModel = (ques: R4.IQuestionnaire) => {
  // reparse the questionnaire while creating the questionnaire response
  let fhirQuestionnaireResponse: R4.IQuestionnaireResponse = {
    resourceType: 'QuestionnaireResponse',
    item: getResponseItem(ques.item ?? []), // todo
    status: R4.QuestionnaireResponseStatusKind._inProgress,
  };
  // if value in formData is not defined we will not be adding the question/answer combo to
  // the questionnaireResponse

  return fhirQuestionnaireResponse;
};

export const generateQR = (
  formData: Record<string, any>,
  quest: R4.IQuestionnaire
) => {
  // merge schema and formData
  // generate another schema while checking if there are data entries in formData.
  const qrModel = generateQResponseModel(quest);

  // could explore how proxies can be used, the formData could act as a proxy to the
  // questionnaireResponse

  // the formData should have the same generateQResponseModel
  let formDataSection = { ...formData };
  const processItems = (item) => {
    item.forEach((it, index) => {
      const thisItemsLinkId = it.linkId!;
      if (!formDataSection[thisItemsLinkId]) {
        return;
      } else {
        if (it.item) {
          formDataSection = formDataSection[thisItemsLinkId];
          processItems(it.item);
        }
        else{
          if(it.answer === undefined){console.log('ItemAnswer', it)}
          const answerKey = Object.keys(it.answer[0])[0];
          item[index] = {...it, answer: [{[answerKey]: formDataSection[thisItemsLinkId]}]}
          return;
        }
      }
    });
  }
    processItems(qrModel.item);
    return qrModel
};

const GetControlType = (item: R4.IQuestionnaire_Item) => {
  // if (
  //   item.type == R4.Questionnaire_ItemTypeKind._date ||
  //   item.type == R4.Questionnaire_ItemTypeKind._dateTime ||
  //   item.type == R4.Questionnaire_ItemTypeKind._time
  // ) {
  //   return 'dateTimePicker';
  // }

  if (
    item.type == R4.Questionnaire_ItemTypeKind._choice ||
    item.type == R4.Questionnaire_ItemTypeKind._openChoice
  ) {
    const ext: R4.IExtension = (item.extension || [])[0];
    const coding: R4.ICoding = (ext?.valueCodeableConcept?.coding || [])[0];

    if (coding?.code === EXTENSION_CHECKBOX) {
      return 'array';
    }

    if (coding?.code === EXTENSION_SLIDER) {
      return 'integer';
    }
  }

  if (item.type === R4.Questionnaire_ItemTypeKind._boolean) {
    return 'boolean';
  }

  if (item.type == R4.Questionnaire_ItemTypeKind._decimal) {
    return 'number';
  }

  if (item.type == R4.Questionnaire_ItemTypeKind._integer) {
    return 'integer';
  }

  return 'string';
};

const GetValueType = (item: R4.IQuestionnaire_Item) => {
  switch (item.type) {
    case R4.Questionnaire_ItemTypeKind._date:
      return 'item.answer[0].valueDate';
    case R4.Questionnaire_ItemTypeKind._time:
      return 'item.answer[0].valueTime';
    case R4.Questionnaire_ItemTypeKind._dateTime:
      return 'item.answer[0].valueDateTime';
    case R4.Questionnaire_ItemTypeKind._integer:
      return 'item.answer[0].valueInteger';
    case R4.Questionnaire_ItemTypeKind._decimal:
      return 'item.answer[0].valueDecimal';
    case R4.Questionnaire_ItemTypeKind._boolean:
      return 'item.answer[0].valueBoolean';
    case R4.Questionnaire_ItemTypeKind._choice:
    case R4.Questionnaire_ItemTypeKind._openChoice:
      return 'item.answer[0].valueCoding';
    default:
      return 'item.answer[0].valueString';
  }
};

const CreateResponseItem = (item: R4.IQuestionnaire_Item) => {
  let responseItem: R4.IQuestionnaireResponse_Item = {
    linkId: item.linkId,
    text: item.text,
    answer: [],
  };

  var key = GetOnlyValueType(GetValueType(item));
  let ans: R4.IQuestionnaireResponse_Answer = {};

  switch (item.type) {
    case R4.Questionnaire_ItemTypeKind._choice:
    case R4.Questionnaire_ItemTypeKind._openChoice:
      const option = (item.answerOption || [])[0];
      ans[key] = Object.keys(option?.valueCoding || {}).reduce(
        (acc, prop) => ({ ...acc, [prop]: '' }),
        {}
      );
      break;

    default:
      ans[key] = '';
      break;
  }

  responseItem.answer?.push(ans);
  return responseItem;
};

/**
 *
 * @param valueType {string} full model path
 *
 * @returns {sting} just the type
 */
const GetOnlyValueType = (valueType: string) => {
  var pieces = valueType.split(/[\s.]+/); // Split on .
  return pieces[pieces.length - 1];
};

const EXTENSION_DROPDOWN = 'drop-down';
const EXTENSION_RADIOBUTTON = 'radio-button';
const EXTENSION_CHECKBOX = 'check-box';
const EXTENSION_SLIDER = 'slider';
const extensionToWidget = {
  [EXTENSION_DROPDOWN]: 'select',
  [EXTENSION_RADIOBUTTON]: 'radio',
  [EXTENSION_CHECKBOX]: 'checkboxes',
  [EXTENSION_SLIDER]: 'range',
};


export const _createLinkIdItemMap = function (qResource) {
  var traverse = function traverse(itemArray, collection) {
    itemArray.forEach(function (item) {
      collection[item.linkId] = item;

      if (item.item) {
        traverse(item.item, collection);
      }
    });
    return collection;
  };

  var ret = {};

  if (qResource.item) {
    ret = traverse(qResource.item, ret);
  }

  return ret;
};