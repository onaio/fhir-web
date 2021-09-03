/* eslint-disable no-fallthrough */
import { IfhirR4 as IR4, fhirR4 as R4, IfhirR4 } from "@smile-cdr/fhirts";
import { find, isEmpty, cloneDeep } from "lodash";
import { Dictionary } from "./utils";

const fhirExtUrlCardinalityMin =
  "http://hl7.org/fhir/StructureDefinition/questionnaire-minOccurs";
const fhirExtUrlCardinalityMax =
  "http://hl7.org/fhir/StructureDefinition/questionnaire-maxOccurs";
const fhirExtUrlItemControl =
  "http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl";
const fhirExtUrlUnit =
  "http://hl7.org/fhir/StructureDefinition/questionnaire-unit";
const fhirExtUrlUnitOption =
  "http://hl7.org/fhir/StructureDefinition/questionnaire-unitOption";
const fhirExtUrlOptionPrefix =
  "http://hl7.org/fhir/StructureDefinition/questionnaire-optionPrefix";
const fhirExtVariable = "http://hl7.org/fhir/StructureDefinition/variable";
const fhirExtUrlMinValue = "http://hl7.org/fhir/StructureDefinition/minValue";
const fhirExtUrlMaxValue = "http://hl7.org/fhir/StructureDefinition/maxValue";
const fhirExtUrlMinLength = "http://hl7.org/fhir/StructureDefinition/minLength";
const fhirExtUrlRegex = "http://hl7.org/fhir/StructureDefinition/regex";
const fhirExtUrlAnswerRepeats =
  "http://hl7.org/fhir/StructureDefinition/questionnaire-answerRepeats";
const fhirExtUrlExternallyDefined =
  "http://hl7.org/fhir/StructureDefinition/questionnaire-externallydefined";
const argonautExtUrlExtensionScore =
  "http://fhir.org/guides/argonaut-questionnaire/StructureDefinition/extension-score";
const fhirExtUrlHidden =
  "http://hl7.org/fhir/StructureDefinition/questionnaire-hidden";
const fhirExtTerminologyServer =
  "http://hl7.org/fhir/StructureDefinition/terminology-server";
// const fhirExtUrlDataControl = "http://lhcforms.nlm.nih.gov/fhirExt/dataControl";
const fhirExtCalculatedExp =
  "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-calculatedExpression";
const fhirExtInitialExp =
  "http://hl7.org/fhir/StructureDefinition/questionnaire-initialExpression";
const fhirExtObsLinkPeriod =
  "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-observationLinkPeriod";
const fhirExtObsExtract =
  "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-observationExtract";
const fhirExtAnswerExp =
  "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-answerExpression";
const fhirExtChoiceOrientation =
  "http://hl7.org/fhir/StructureDefinition/questionnaire-choiceOrientation";
const fhirExtLaunchContext =
  "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-launchContext";
const fhirExtMaxSize = "http://hl7.org/fhir/StructureDefinition/maxSize";
const fhirExtMimeType = "http://hl7.org/fhir/StructureDefinition/mimeType";
const fhirExtUrlRestrictionArray = [
  fhirExtUrlMinValue,
  fhirExtUrlMaxValue,
  fhirExtUrlMinLength,
  fhirExtUrlRegex,
]; // One way or the other, the following extensions are converted to lforms internal fields

const fhirVersion = "R4";
const formLevelFields = [
  // Resource
  "id",
  "meta",
  "implicitRules",
  "language", // Domain Resource
  "text",
  "contained",
  "extension",
  "modifiedExtension", // Questionnaire
  "date",
  "version",
  "identifier",
  "code", // code in FHIR clashes with previous definition in lforms. It needs special handling.
  "subjectType",
  "derivedFrom", // New in R4
  "status",
  "experimental",
  "publisher",
  "contact",
  "description",
  "useContext",
  "jurisdiction",
  "purpose",
  "copyright",
  "approvalDate",
  "reviewDate",
  "effectivePeriod",
  "url",
];
const itemLevelIgnoredFields = ["definition"];
const fhirExtUrlOptionScore =
  "http://hl7.org/fhir/StructureDefinition/ordinalValue";
const fhirExtUrlValueSetScore = fhirExtUrlOptionScore;

/**
 *
 */

function baseFormDef() {
  // json-schema
  return {}
  return { $schema: "https://json-schema.org/draft/2019-09/schema" };
}

/**
 * Convert FHIR SQC Questionnaire to LForms definition
 *
 * @param questionnaire - FHIR Questionnaire object
 * @returns {{}} - LForms json object
 */
export function convertQuestionnaireToLForms(
  questionnaire: IR4.IQuestionnaire
) {
  let target: Record<string, any> = {};

  if (questionnaire) {
    target = baseFormDef();
    target = { ...target, ...processFormLevelFields(questionnaire) };

    const containedVS = extractContainedVS(questionnaire);

    if (questionnaire.item && questionnaire.item.length > 0) {
      var linkIdItemMap = createLinkIdItemMap(questionnaire);

      target.properties = {};

      for (var i = 0; i < questionnaire.item.length; i++) {
        var item = processQuestionnaireItem(
          questionnaire.item[i],
          containedVS,
          linkIdItemMap
        ); // no instructions on the questionnaire level
        target.properties[item.linkId] = item;
      }
    }

    target.fhirVersion = fhirVersion;
  }

  return target;
}

/**
 * Build a map of items to linkid from a questionnaire resource.
 * @param qResource - FHIR Questionnaire resource
 * @returns {*} - Hash object with link id keys pointing to their respective items.
 * @private
 */
function createLinkIdItemMap(qResource) {
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
}
/**
 *  Converts the given ValueSet into an array of answers that can be used with a prefetch autocompleter.
 * @return the array of answers, or null if the extraction cannot be done.
 */

function answersFromVS(valueSet) {
  var vs = valueSet;
  var rtn: any = [];

  if (
    vs.expansion &&
    vs.expansion.contains &&
    vs.expansion.contains.length > 0
  ) {
    vs.expansion.contains.forEach(function (vsItem) {
      var answer: any = {
        code: vsItem.code,
        text: vsItem.display,
        system: vsItem.system,
      };
      var ordExt = findObjectInArray(
        vsItem.extension,
        "url",
        fhirExtUrlValueSetScore
      );

      if (ordExt) {
        answer.score = ordExt.valueDecimal;
      }

      rtn.push(answer);
    });
  }

  return rtn.length > 0 ? rtn : null;
}

/**
 * Extract contained VS (if any) from the given questionnaire resource object.
 * @param questionnaire the FHIR questionnaire resource object
 * @return when there are contained value sets, returns a hash from the ValueSet url to the answers
 *         options object, which, in turn, is a hash with 4 entries:
 *         - "answers" is the list of LF answers converted from the value set.
 *         - "systems" is the list of code systems for each answer item; and
 *         returns undefined if no contained value set is present.
 * @private
 */

function extractContainedVS(questionnaire) {
  var answersVS;

  if (questionnaire.contained && questionnaire.contained.length > 0) {
    answersVS = {};
    questionnaire.contained.forEach(function (vs) {
      if (vs.resourceType === "ValueSet") {
        var answers = answersFromVS(vs);
        if (!answers) answers = []; // continuing with previous default; not sure if needed
        // Support both id and url based lookup - we are only supporting our non-standard url approach
        // for backward-compatibility with previous LForms versions. For more details on FHIR contained
        // resource references, please see "http://hl7.org/fhir/references.html#canonical-fragments"

        var lfVS = {
          answers: answers,
        };

        if (vs.id) {
          answersVS["#" + vs.id] = lfVS;
        }

        if (vs.url) {
          answersVS[vs.url] = lfVS;
        }
      }
    });
  }

  return answersVS;
}

/**
 * Parse form level fields from FHIR questionnaire and assign to LForms object.
 *
 * @param schema - LForms object to assign the extracted fields
 * @param questionnaire - FHIR questionnaire resource object to parse for the fields.
 */
function processFormLevelFields(questionnaire: IfhirR4.IQuestionnaire) {
  const schema = copyFields(questionnaire as any, {}, formLevelFields);

  schema["$id"] = questionnaire.url;
  schema.name = questionnaire.name; // computer friendly
  schema.title = questionnaire.title;
  schema.type = "object";

  // if (questionnaire._title) schema.obj_title = questionnaire._title; // For backward compatibility, we keep lforms.code as it is, and use lforms.codeList
  // // for storing questionnaire.code. While exporting, merge lforms.code and lforms.codeList
  // // into questionnaire.code. While importing, convert first of questionnaire.code
  // // as lforms.code, and copy questionnaire.code to lforms.codeList.

  if (questionnaire.code) {
    // Rename questionnaire code to codeList
    schema.codeList = questionnaire.code;
  }

  var codeAndSystemObj = getCode(questionnaire as any);

  if (codeAndSystemObj) {
    schema.code = codeAndSystemObj.code;
    schema.codeSystem = codeAndSystemObj.system;
  }
  return schema;
}

/**
 * Process questionnaire item recursively
 *
 * @param qItem - item object as defined in FHIR Questionnaire.
 * @param containedVS - contained ValueSet info, see _extractContainedVS() for data format details
 * @param linkIdItemMap - Map of items from link ID to item from the imported resource.
 * @returns {{}} - Converted 'item' field object as defined by LForms definition.
 * @private
 */

function processQuestionnaireItem(qItem, containedVS, linkIdItemMap): any {
  var targetItem = {}; //A lot of parsing depends on data type. Extract it first.

  processDataType(targetItem, qItem);

  processTextAndPrefix(targetItem, qItem); // this is ok.

  processCodeAndLinkId(targetItem, qItem); // this is also ok.

  processDisplayItemCode(targetItem, qItem);

  processEditable(targetItem, qItem); // this is also ok.

  processHiddenItem(targetItem, qItem);
  
  processRestrictions(targetItem, qItem);
  
  // self._processDataControl(targetItem, qItem);
  
  // processDisplayControl(targetItem, qItem);

  // processUnitList(targetItem, qItem);

  // self._processAnswers(targetItem, qItem, containedVS);

  // self._processDefaultAnswer(targetItem, qItem);

  // self._processExternallyDefined(targetItem, qItem);

  // self._processTerminologyServer(targetItem, qItem);

  // self._processSkipLogic(targetItem, qItem, linkIdItemMap);

  // self._processExtensions(targetItem, qItem);

  copyFields(qItem, targetItem, itemLevelIgnoredFields);

  processChildItems(targetItem, qItem, containedVS, linkIdItemMap);
  
  targetItem = processFHIRQuestionAndAnswerCardinality(targetItem, qItem);

  return targetItem;
}



/**
 * Parse questionnaire item for coding instructions
 *
 * @param qItem {object} - Questionnaire item object
 * @return {{}} an object contains the coding instructions info.
 * @private
 */
function processCodingInstructions(qItem) {
  // if the qItem is a "display" typed item with a item-control extension, then it meant to be a help message,
  // which in LForms is an attribute of the parent item, not a separate item.
  var ret: any = null;
  var ci = findObjectInArray(qItem.extension, "url", fhirExtUrlItemControl);
  var xhtmlFormat;

  if (qItem.type === "display" && ci) {
    // only "redering-xhtml" is supported. others are default to text
    if (qItem._text) {
      xhtmlFormat = findObjectInArray(
        qItem._text.extension,
        "url",
        "http://hl7.org/fhir/StructureDefinition/rendering-xhtml"
      );
    } // there is a xhtml extension

    if (xhtmlFormat) {
      ret = {
        codingInstructionsFormat: "html",
        codingInstructions: xhtmlFormat.valueString,
        codingInstructionsPlain: qItem.text, // this always contains the coding instructions in plain text
      };
    } // no xhtml extension, default to 'text'
    else {
      ret = {
        codingInstructionsFormat: "text",
        codingInstructions: qItem.text,
        codingInstructionsPlain: qItem.text, // this always contains the coding instructions in plain text
      };
    }
  }

  return ret;
}

/**
 *  Processes the child items of the item.
 * @param targetItem the LForms node being populated with data
 * @param qItem the Questionnaire (item) node being imported
 * @param linkIdItemMap - Map of items from link ID to item from the imported resource.
 * @param containedVS - contained ValueSet info, see _extractContainedVS() for data format details
 */
function processChildItems(targetItem, qItem, containedVS, linkIdItemMap) {
  if (Array.isArray(qItem.item)) {
    targetItem.properties = {};

    for (var i = 0; i < qItem.item.length; i++) {
      var help = processCodingInstructions(qItem.item[i]); // pick one coding instruction if there are multiple ones in Questionnaire

      if (help !== null) {
        targetItem.codingInstructions = help.codingInstructions;
        targetItem.codingInstructionsFormat = help.codingInstructionsFormat;
        targetItem.codingInstructionsPlain = help.codingInstructionsPlain;
      } else {
        var item = processQuestionnaireItem(
          qItem.item[i],
          containedVS,
          linkIdItemMap
        );

        targetItem.properties[item.linkId] = item;
      }
    }
  }
}

/**
 *  Returns the first initial quanitity for the given Questionnaire item, or
 *  null if there isn't one.
 */

function getFirstInitialQuantity(qItem) {
  return (
    (qItem.initial &&
      qItem.initial.length > 0 &&
      qItem.initial[0].valueQuantity) ||
    null
  );
}

/**
 * Parse questionnaire item for units list
 *
 * @param lfItem {object} - LForms item object to assign units
 * @param qItem {object} - Questionnaire item object
 * @private
 */
function processUnitList(lfItem, qItem) {
  var units: any[] = [];
  var defaultUnit: any = null; // The questionnaire-unitOption extension is only for item.type = quantity

  var unitOption = findObjectInArray(
    qItem.extension,
    "url",
    fhirExtUrlUnitOption,
    true
  );

  if (unitOption && unitOption.length > 0) {
    if (qItem.type !== "quantity") {
      throw new Error(
        "The extension " +
          fhirExtUrlUnitOption +
          ' can only be used with type quantity.  Question "' +
          qItem.text +
          '" is of type ' +
          qItem.type
      );
    }

    for (var i = 0; i < unitOption.length; i++) {
      var coding = unitOption[i].valueCoding;
      var lUnit = {
        name: coding.display,
        code: coding.code,
        system: coding.system,
      };
      units.push(lUnit);
    }
  } // The questionnaire-unit extension is only for item.type = integer or decimal

  var unit = findObjectInArray(qItem.extension, "url", fhirExtUrlUnit);

  if (unit) {
    if (qItem.type !== "integer" && qItem.type !== "decimal") {
      throw new Error(
        "The extension " +
          fhirExtUrlUnit +
          ' can only be used with types integer or decimal.  Question "' +
          qItem.text +
          '" is of type ' +
          qItem.type
      );
    }

    defaultUnit = {
      name: unit.valueCoding.display,
      code: unit.valueCoding.code,
      system: unit.valueCoding.system,
      default: true,
    };
    units.push(defaultUnit);
  }

  if (qItem.type === "quantity") {
    var initialQ = getFirstInitialQuantity(qItem);

    if (initialQ && initialQ.unit) {
      defaultUnit = findItem(units, "name", initialQ.unit);

      if (defaultUnit) {
        defaultUnit.default = true;
      } else {
        defaultUnit = {
          name: initialQ.unit,
          code: initialQ.code,
          system: initialQ.system,
          default: true,
        };
        units.push(defaultUnit);
      }
    }
  }

  if (units.length > 0) {
    if (!defaultUnit) {
      units[0].default = true;
    }

    lfItem.units = units;
  }
}

/**
 * Recursively find the first occurrence of an item, depth first, that matches the
 * given field value for the given field
 * @param items an array of LForms items, where an item may have its own sub-items.
 * @param key
 * @param matchingValue
 * @return {*}
 */
function findItem(items, key, matchingValue) {
  var ret = null;
  if (items) {
    for (var i = 0; !ret && i < items.length; ++i) {
      var item = items[i];
      if (item[key] === matchingValue) {
        ret = item;
      } else if (Array.isArray(item.items)) {
        ret = findItem(item.items, key, matchingValue);
      }
    }
  }

  return ret;
}

/**
 * Parse questionnaire item for "hidden" extension
 *
 * @param schema {object} - LForms item object to be assigned the _isHiddenInDef flag if the item is to be hidden.
 * @param qItem {object} - Questionnaire item object
 * @private
 * @return true if the item is hidden or if its ancestor is hidden, false otherwise
 */

function processHiddenItem(schema, qItem) {
  var ci = findObjectInArray(qItem.extension, "url", fhirExtUrlHidden);

  if (ci) {
    schema.hidden =
      typeof ci.valueBoolean === "boolean"
        ? ci.valueBoolean
        : ci.valueBoolean === "true";
  }

  return schema.hidden; // TODO: the process here is impure, why bother?
}

/**
 * Parse questionnaire item for restrictions
 *
 * @param schema {object} - LForms item object to assign restrictions
 * @param qItem {object} - Questionnaire item object
 * @private
 */
function processRestrictions(schema, qItem) {
  var restrictions = {};

  if (typeof qItem.maxLength !== "undefined") {
    schema["maxLength"] = qItem.maxLength; // integer
  }

  for (var i = 0; i < fhirExtUrlRestrictionArray.length; i++) {
    var restriction = findObjectInArray(
      qItem.extension,
      "url",
      fhirExtUrlRestrictionArray[i]
    );

    var val = getFHIRValueWithPrefixKey(restriction, /^value/);

    if (val !== undefined && val !== null) {
      if (restriction.url.match(/minValue$/)) {
        // TODO -
        // There is no distinction between inclusive and exclusive.
        // Lforms looses this information when converting back and forth.

        // restrictions that do not have a json schema equivalent will be added
        // as value of the restriction prop otherwise they will be added directly to schema
        restrictions["minInclusive"] = val; 
      } else if (restriction.url.match(/maxValue$/)) {
        restrictions["maxInclusive"] = val;
      } else if (restriction.url.match(/minLength$/)) {
        schema["minLength"] = val;
      } else if (restriction.url.match(/regex$/)) {
        schema["pattern"] = val; // TODO: can the regex be easily parsed and used form js
      }
    }
  }

  if (!isEmpty(restrictions)) {
    schema.restrictions = restrictions;
  }
}

/**
 * Parse questionnaire item for display control
 *
 * @param schema {object} - LForms item object to assign display control
 * @param qItem {object} - Questionnaire item object
 * @private
 */
function processDisplayControl(schema, qItem) {
  var itemControlType = findObjectInArray(
    qItem.extension,
    "url",
    fhirExtUrlItemControl
  );

  if (itemControlType) {
    var displayControl: any = {};

    switch (itemControlType.valueCodeableConcept.coding[0].code) {
      case "Lookup": // backward-compatibility with old export

      case "Combo-box": // backward-compatibility with old export

      case "autocomplete":
        schema.isSearchAutocomplete = true;
      // continue to drop-down case

      case "drop-down":
        displayControl.answerLayout = {
          type: "COMBO_BOX",
        };
        break;

      case "Checkbox": // backward-compatibility with old export

      case "check-box":
      case "Radio": // backward-compatibility with old export

      case "radio-button":
        displayControl.answerLayout = {
          type: "RADIO_CHECKBOX",
        };
        var answerChoiceOrientation = findObjectInArray(
          qItem.extension,
          "url",
          fhirExtChoiceOrientation
        );

        if (answerChoiceOrientation) {
          if (answerChoiceOrientation.valueCode === "vertical") {
            displayControl.answerLayout.columns = "1";
          } else if (answerChoiceOrientation.valueCode === "horizontal") {
            displayControl.answerLayout.columns = "0";
          }
        }

        break;

      case "Table": // backward-compatibility with old export

      case "gtable":
        // Not in STU3, but we'll accept it
        if (schema.dataType === "SECTION") {
          displayControl.questionLayout = "horizontal";
        }

        break;

      case "Matrix": // backward-compatibility with old export

      case "table":
        if (schema.dataType === "SECTION") {
          displayControl.questionLayout = "matrix";
        }

        break;

      default:
        displayControl = null;
    }

    if (displayControl && !isEmpty(displayControl)) {
      schema.displayControl = displayControl;
    }
  }
}


/**
 * Parse questionnaire item for editable
 *
 * @param lfItem {object} - LForms item object to assign editable
 * @param qItem {object} - Questionnaire item object
 * @private
 */
function processEditable(schema, qItem) {
  if (qItem.readOnly) {
    schema.readOnly = true;
  }
}

function processDataType(schema, qItem) {
  var { type, schemaType, schemaFormat } = getDataType(qItem);

  schema.type = schemaType;
  schema.dataType = type;
  if (schemaFormat) {
    schema.format = schemaFormat;
  }
}

/**
 * Get LForms data type from questionnaire item and any formatting tools to
 * help annotate the expected data and possibly helpful during validation.
 *
 * @param qItem {object} - Questionnaire item object
 * @private
 */

function getDataType(qItem) {
  // deprecate type
  var type = "string";
  let schemaType = "string";
  let schemaFormat;

  switch (qItem.type) {
    case "string":
      type = "ST";
      schemaType = "string";
      break;

    case "group":
      type = "SECTION";
      schemaType = "object";
      break;

    case "choice":
      type = "CNE";
      // partially supported
      break;

    case "open-choice":
      type = "CWE";
      // partially supported
      break;

    case "integer":
      type = "INT";
      schemaType = "integer";
      break;

    case "decimal":
      type = "REAL";
      schemaType = "number";
      break;

    case "text":
      type = "TX";
      schemaType = "string";
      break;

    case "boolean":
      type = "BL";
      schemaType = "boolean";
      break;

    case "date":
      type = "DT";
      schemaType = "string";
      schemaFormat = "date";
      break;

    case "dateTime":
      type = "DTM";
      schemaType = "string";
      schemaFormat = "date-time";
      break;

    case "time":
      type = "TM";
      schemaType = "string";
      schemaFormat = "time";
      break;

    case "display":
      type = "TITLE";
      schemaType = "string";
      break;

    case "url":
      type = "URL";
      schemaType = "string";
      schemaFormat = "uri";
      break;

    case "quantity":
      type = "QTY";
      schemaType = "number";
      break;

    // processing and submitting fhir attachments
    case "attachment":
      type = "attachment";
      // partially supported
      break;
  }

  return { type, schemaType, schemaFormat };
}

/**
 *  Process the text and prefix data.
 * @param schema {object} - LForms item object to receive the data
 * @param qItem {object} - Questionnaire item object (as the source)
 */

function processTextAndPrefix(schema, qItem) {
  // prefix
  if (qItem.prefix) schema.prefix = qItem.prefix; // text DNM
  schema.title = qItem.text; // Copy item extensions
}

function processCodeAndLinkId(schema, qItem) {
  if (qItem.code) {
    schema.codeList = qItem.code;
  }

  var code = getCode(qItem);

  if (code) {
    schema.questionCode = code.code;
    schema.questionCodeSystem = code.system;
    schema.questionCodeDisplay = code.display
  } // use linkId as questionCode, which should not be exported as code
  else {
    schema.questionCode = qItem.linkId;
    schema.questionCodeSystem = "LinkId";
  }

  schema.linkId = qItem.linkId;
}

/**
 * Parse 'linkId' for the LForms questionCode of a 'display' item, which does not have a 'code'
 *
 * @param lfItem {object} - LForms item object to assign questionCode
 * @param qItem {object} - Questionnaire item object
 * @private
 */
function processDisplayItemCode(lfItem, qItem) {
  if (qItem.type === "display" && qItem.linkId) {
    var codes = qItem.linkId.split("/");

    if (codes && codes[codes.length - 1]) {
      lfItem.questionCode = codes[codes.length - 1];
    }
  }
  // TODO why do we require a questionCode
}

/**
 * Do a shallow copy of specified fields from source to target.
 *
 * @param source - Source object
 * @param target - Target object
 * @param fieldList - Array of fields to copy from the source. If the field is
 * not found in the source, it is ignored.
 */
function copyFields<TSource extends Record<string, unknown>>(
  source: TSource,
  target: Record<string, unknown>,
  fieldList: (keyof TSource)[]
) {
  const newTarget = { ...target };
  fieldList.forEach((field) => {
    if (source.hasOwnProperty(field)) {
      newTarget[field as string | number] = source[field];
    }
  });
  return newTarget;
}

/**
 * Gets the first object with code and code system
 *
 * @param qItemOrResource {object} - question or item
 * @private
 */

function getCode<T extends { code: Array<R4.Coding> }>(qItemOrResource: T) {
  let code;

  if (
    qItemOrResource &&
    Array.isArray(qItemOrResource?.code) &&
    qItemOrResource?.code.length
  ) {
    code = {
      code: qItemOrResource.code[0].code,
      system: qItemOrResource.code[0].system,
      display: qItemOrResource.code[0].display
    };
  }

  return code;
}

function findObjectInArray(
  arrayLookUp: Array<any>,
  key: string | number,
  toMatchValue,
  all = false
) {
  const matched = arrayLookUp?.filter((obj) => obj[key] === toMatchValue);
  if (!all) {
    return matched?.[0];
  }
  return matched;
}

/**
 * Get a FHIR value from an object given a partial string of hash key.
 * Use it where at most only one key matches.
 *
 * @param obj {object} - Object to search
 * @param keyRegex {regex} - Regular expression to match a key.  This should
 *  be the beginning part of the key up to the type (e.g., /^value/, to match
 *  "valueQuantity").
 * @returns {*} - Corresponding value of matching key.  For complex types,
 *  such as Quantity, the type of the returned object will be present under
 *  a _type attribute.
 * @private
 */

function getFHIRValueWithPrefixKey(obj, keyRegex) {
  var ret: any = null;

  if (typeof obj === "object") {
    for (var key in obj) {
      var matchData = key.match(keyRegex);

      if (matchData) {
        ret = obj[key];

        if (ret && typeof ret === "object") {
          ret = cloneDeep(ret); // Work with clone

          ret._type = key.substring(matchData[0].length);
        }

        break;
      }
    }
  }

  return ret;
}


  // /**
  //  * Parse questionnaire item for answers list
  //  *
  //  * @param lfItem {object} - LForms item object to assign answer list
  //  * @param qItem {object} - Questionnaire item object
  //  * @param containedVS - contained ValueSet info, see _extractContainedVS() for data format details
  //  * @private
  //  */

  //  function processAnswers(lfItem, qItem, containedVS) {
  //   if (qItem.answerOption) {
  //     lfItem.answers = [];

  //     for (var i = 0; i < qItem.answerOption.length; i++) {
  //       var answer = {};
  //       var option = qItem.answerOption[i];
  //       var label = LForms.Util.findObjectInArray(option.extension, 'url', self.fhirExtUrlOptionPrefix);

  //       if (label) {
  //         answer.label = label.valueString;
  //       }

  //       var score = LForms.Util.findObjectInArray(option.extension, 'url', self.fhirExtUrlOptionScore); // Look for argonaut extension.

  //       score = !score ? LForms.Util.findObjectInArray(option.extension, 'url', self.argonautExtUrlExtensionScore) : score;

  //       if (score) {
  //         answer.score = score.valueDecimal.toString();
  //       }

  //       var optionKey = Object.keys(option).filter(function (key) {
  //         return key.indexOf('value') === 0;
  //       });

  //       if (optionKey && optionKey.length > 0) {
  //         if (optionKey[0] === 'valueCoding') {
  //           // Only one value[x] is expected
  //           if (option[optionKey[0]].code !== undefined) answer.code = option[optionKey[0]].code;
  //           if (option[optionKey[0]].display !== undefined) answer.text = option[optionKey[0]].display; // TBD- Lforms has answer code system at item level, expects all options to have one code system!

  //           if (option[optionKey[0]].system !== undefined) {
  //             answer.system = option[optionKey[0]].system;
  //           }
  //         } else {
  //           answer.text = option[optionKey[0]].toString();
  //         }
  //       }

  //       lfItem.answers.push(answer);
  //     }
  //   } else if (qItem.answerValueSet) {
  //     if (containedVS) var vs = containedVS[qItem.answerValueSet];

  //     if (vs) {
  //       // contained
  //       lfItem.answers = vs.answers;
  //     } else lfItem.answerValueSet = qItem.answerValueSet; // a URI for a ValueSet

  //   }
  // };


  /**
 * Parse questionnaire item for question cardinality and answer cardinality
 *
 * @param lfItem {object} - LForms item object to assign question cardinality
 * @param qItem {object} - Questionnaire item object
 * @private
 */
function processFHIRQuestionAndAnswerCardinality(lfItem, qItem) {
  const singleSchema = cloneDeep(lfItem);
  var min = findObjectInArray(qItem.extension, "url", fhirExtUrlCardinalityMin);
  var max = findObjectInArray(qItem.extension, "url", fhirExtUrlCardinalityMax);
  var repeats = qItem.repeats;
  var required = qItem.required;
   // CNE/CWE, repeats handled by autocompleter with multiple answers in one question

  /**
   * question with repeats will  result in question cardinality irregardless of their data type
   * question cardinality will transform to an array type schema, repeatable questions will be a repeatable object schema with max stuff
   * answer cardinality will apply on objects
   * */

  /** 
   * when question is not of choice or open ended choice, we convert schema to use an array. Cardinality will 
   * be handled using json-schema.
   * now to the question of cardinality
   */

  const minItemValue = min?.valueInteger
  const maxItems = max?.valueInteger
  let minItems: number | undefined =  undefined;
  if(required){
    if(minItemValue && minItemValue < 1){minItems = 1}
    else if(minItemValue && minItemValue > 1){minItems = minItemValue}
  }else{
    if(minItemValue){
      minItems = minItemValue
    }
  }

   if (!(lfItem.dataType === "CNE" || lfItem.dataType === "CWE")) {
     if(repeats){
       return {
         linkId: singleSchema.linkId,
         type: "array",
         items: singleSchema,
         ...(minItems ? {minItems,} : {}),
         ...(maxItems ? {maxItems,} : {}),
        //  ...(required ? {required,} : {}), // required goes somewhere else as per json-schema
       }
     }else{return singleSchema}

   }else{
     if(repeats){
       return {
         ...singleSchema,
           type: "array",
           items: {type: "string"},
           ...(minItems ? {minItems,} : {}),
         ...(maxItems ? {maxItems,} : {}),
         }
       }
       else{return singleSchema}
     }
   }