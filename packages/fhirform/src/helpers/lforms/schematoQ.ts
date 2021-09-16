import {isEmpty, transform, get} from 'lodash';


function processQuestionResponse(itemSchema, formData){
  if(typeof formData[itemSchema.linkId] === 'undefined'){
    return undefined
  }
  if(itemSchema.type === 'boolean'){
    return processBooleanItemSchema(itemSchema, formData);
  }
  if(itemSchema.type === 'number'){
    return processIntegerItemSchema(itemSchema, formData);
  }
   return processStringItemSchema(itemSchema,formData);
 }
 
/**
* Convert LForms captured data to FHIR SDC QuestionnaireResponse
* @param lfData a LForms form object
* @param noExtensions a flag that a standard FHIR Questionnaire is to be created without any extensions.
*  The default is false.
* @param subject A local FHIR resource that is the subject of the output resource.
*  If provided, a reference to this resource will be added to the output FHIR
*  resource when applicable.
* @returns {{}}
*/
export function convertLFormsToQuestionnaireResponse(schema, formData, noExtensions=true, ) {
 var target = {};
 // merge formData with schema to mergedSchema
 const mergedSchema = schema      
 
 if (schema) {
//    var source = lfData.getFormData(true,true,true);
//    console.log('SOURCE@ ===>', source)
//    this._processRepeatingItemValues(source);



   setResponseFormLevelFields(target, mergedSchema, noExtensions);

  //  if (mergedSchema.items && Array.isArray(mergedSchema.items)) {
  //    var tmp = processResponseItem(mergedSchema, true);
  //    if(tmp && tmp.item && tmp.item.length) {
  //      target.item = tmp.item;
  //    }
  //  }

  const {properties} = schema;
  const rtn = {} as any;

  if(properties){
    rtn.item = [];
    Object.values(properties).forEach(itemSchema => {
      console.log('PROCESSED', processItemSchema(itemSchema, formData))
      const processed = processItemSchema(itemSchema, formData)
      if(Array.isArray(processed)){
        rtn.item = [...rtn.item, ...processed];
      }else rtn.item.push(processItemSchema(itemSchema, formData))
    })
  }

  return {...target, ...rtn}
  
 }

 function processItemSchema(itemSchema, formData) 
 {
  // item schema can either be question, group or an array
  // lets handle group
  // TODO : defensive programming
  let rtn: any = getItemLevelFields(itemSchema)
   if(itemSchema.type === 'object'){
    const {properties} = itemSchema;
    rtn.item = Object.values(properties).map((childQuestion) => processItemSchema(childQuestion, formData))
   }
   else if(itemSchema.type === "array"){
     rtn = [];
     if(itemSchema.dataType === 'CNE' || itemSchema.dataType === 'CWE'){
       rtn.push(processQuestionResponse(itemSchema, formData))
     }
     else{
       // http://community.fhir.org/t/questionnaire-repeating-groups-what-is-the-correct-format/2276
      const {items, linkId} = itemSchema;
      const responses = formData[linkId] ?? [];
      console.log('===>', items, linkId, responses, rtn, itemSchema, responses.length);
      for (let i = 0; i < responses.length; i++ ){
        rtn.push(processItemSchema(items, formData))
      }
     }

   }else{
     const itemResponse = processQuestionResponse(itemSchema, formData);
     if(itemResponse)
      rtn.item = [itemResponse]
   }
   return rtn;
 }



 // FHIR doesn't allow null values, strip them out.
    pruneNulls(target);

//  if (subject)
//    target["subject"] = LForms.Util.createLocalFHIRReference(subject); // leave it to the person generating the data

//  this._commonExport._setVersionTag(target); // Sets the LForms version tag on a FHIR resource to indicate
 return target;
};

function getItemLevelFields(itemSchema){
  return {
    linkId: itemSchema.linkId,
    text: itemSchema.title,
  }
}



function processStringItemSchema(itemSchema, formData){

  return {
    ...getItemLevelFields(itemSchema),
    answer:[
      {valueString: formData[itemSchema.linkId]}
    ]
  }
}


function processIntegerItemSchema(itemSchema, formData){
  return {
    ...getItemLevelFields(itemSchema),
    answer:[
      {ValueInteger: formData[itemSchema.linkId]}
    ]
  }
}

function processBooleanItemSchema(itemSchema, formData){
  return {
    ...getItemLevelFields(itemSchema),
    answer:[
      {valueBoolean: formData[itemSchema.linkId]}
    ]
  }
}

/** maybe we can parse them per response, create a map of 
 * which schemaFormData processors that will be called for 
 * what respective dataTypes and formats
 */



  /**
   * Utility to walkthrough recurively through each element in a collection
   *
   * @param collectionObj
   */
   function pruneNulls (collectionObj) {
    if (Array.isArray(collectionObj)) {
      for(var i = collectionObj.length - 1; i >= 0; i--) {
        if(collectionObj[i] === null || collectionObj[i] === undefined ) {
          collectionObj.splice(i, 1);
        }
        else if(typeof collectionObj[i] === 'object') {
          pruneNulls(collectionObj[i]);
        }
      }
    }
    else if (collectionObj && typeof collectionObj === 'object') {
      var keys = Object.keys(collectionObj);
      keys.forEach(function (key) {
        if(collectionObj[key] === null || collectionObj[key] === undefined) {
          delete collectionObj[key];
        }
        else if (typeof collectionObj[key] === 'object') {
         pruneNulls(collectionObj[key]);
        }
      });
    }
  }


/**
   * Group values of the questions that have the same linkId
   * @param item an item in the LForms form object or a form item object
   * @private
   *
   */
 function processRepeatingItemValues(item) {
    if (item.items) {
      for (var i=0, iLen=item.items.length; i<iLen; i++) {
        var subItem = item.items[i];
        // if it is a question and it repeats
        if (subItem.dataType !== 'TITLE' && subItem.dataType !== 'SECTION' && questionRepeats(subItem)) {
          var linkId = subItem.linkId;
          item._repeatingItems = item._repeatingItems || {};
          item._repeatingItems[linkId] = item._repeatingItems[linkId] || [];
          item._repeatingItems[linkId].push(subItem);
        }
        // if it's a section or a question that has children items
        if(lfHasSubItems(subItem)) {
          processRepeatingItemValues(subItem);
        }
      }
    }
  };


  /**
   * Set form level attribute
   * @param target a QuestionnaireResponse object
   * @param noExtensions  a flag that a standard FHIR Questionnaire is to be created without any extensions.
   *        The default is false.
   * @param schema a LForms form object

   * @private
   */
function setResponseFormLevelFields(target, schema, noExtensions) {
    // var sdcVersion = '2.7';
    // var fhirVersionNum = '4.0';
    // const QRProfile = 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaireresponse|' + sdcVersion,
    // const stdQRProfile = 'http://hl7.org/fhir/' + fhirVersionNum + '/StructureDefinition/QuestionnaireResponse',

    // resourceType
    target.resourceType = "QuestionnaireResponse";

    // meta
    // var profile = noExtensions ? stdQRProfile : QRProfile;
    // target.meta = target.meta ? target.meta : {};
    // target.meta.profile = target.meta.profile ? target.meta.profile : [profile];

    // "identifier": - not including identifier in QuestionnaireResponse per LF-1183
    //target.identifier = {
    //  "system": LForms.Util.getCodeSystem(source.codeSystem),
    //  "value": source.code
    //};

    // status, required
    // "in-progress", "completed", "amended"
    target.status = "completed";

    // authored, required
    target.authored = new Date().toISOString();

    // questionnaire , required
    // We do not have the ID at this point, so leave it unset for now.  Note
    // that the format has also changed from Reference to canonical in R4.
    /*
    target.questionnaire = {
      // questionnaireId should be an id of a related existing questionnaire resource stored in the server
      "reference": "Questionnaire/{{questionnaireId}}"
    };
    */
  };


  /**
   * Set the given key/value to the object if the value is not undefined, not null, and not an empty string.
   * @param obj the object to set the key/value on. It can be null/undefined, and if so, a new object will
   *        be created and returned (only if the value is valid).
   * @param key the key for the given value to be set to the given object, required.
   * @param value the value to be set to the given object using the given key.
   * @return if the input object is not null/undefined, it will be returned;
   *         if the input object is null/undefined:
   *         - return the given object as is if the value is invalid, or
   *         - a newly created object with the given key/value set.
   * @private
   */

   function setIfHasValue (obj, key, value) {
    if (value !== undefined && value !== null && value !== '') {
      if (!obj) {
        obj = {};
      }

      obj[key] = value;
    }

    return obj;
  };

    /**
   * Check if an lform item has sub-items, that is, having an "items" field whose value is an array with non-zero length.
   * @param item the item to be checked for the presense of sub-items.
   * @return {*|boolean} true if the item has sub-items, false otherwise.
   * @private
   */


     function lfHasSubItems(item) {
        return item && item.items && Array.isArray(item.items) && item.items.length > 0; // use tsc to parse
      };



      /**
   * Process an item of the form or the form itself - if it's the form itself, the form-level
   * properties will not be set here and will need to be managed outside of this function.
   * If the lforms item is repeatable, this function handles one particular occurrence of the item.
   * @param lfItem an item in LForms form object, or the form object itself
   * @param isForm optional, default false. If true, the given item is the form object itself.
   * @returns {{}} the converted FHIR item
   * @private
   */


  function processResponseItem (lfItem, isForm=false) {

    var targetItem: any = isForm || lfItem.dataType === 'TITLE' ? {} : {
      linkId: lfItem.linkId,
      text: lfItem.question
    }; // just handle/convert the current item's value, no-recursion to sub-items at this step.

    if (!isForm && lfItem.dataType !== 'TITLE' && lfItem.dataType !== 'SECTION') {
      setIfHasValue(targetItem, 'answer', lfItemValueToFhirAnswer(lfItem));
    }

    if (lfHasSubItems(lfItem)) {
      var fhirItems: any = [];

      for (var i = 0; i < lfItem.items.length; ++i) {
        var lfSubItem = lfItem.items[i];

        if (!lfSubItem._isProcessed) {
          var linkId = lfSubItem.linkId;
          var repeats = lfItem._repeatingItems && lfItem._repeatingItems[linkId];

          if (repeats) {
            // Can only be questions here per _processRepeatingItemValues
            var fhirItem = {
              // one FHIR item for all repeats with the same linkId
              linkId: linkId,
              text: lfSubItem.question,
              answer: []
            };

            for (var rpt = 0; rpt < repeats.length; ++rpt) {
              var rptItem = repeats[rpt];

              var tmpFhirItem = processResponseItem(rptItem);

              if (tmpFhirItem.answer) {
                // TODO: not sure how to handle cases when both (lforms) question and answer repeat.
                // For now, just put all the answers from question and answer repeats into the answer (array).
                Array.prototype.push.apply(fhirItem.answer, tmpFhirItem.answer);
              }

              rptItem._isProcessed = true;
            }

            fhirItems.push(fhirItem);
            delete lfItem._repeatingItems[linkId]; // cleanup, no longer needed
          } else {
            var _fhirItem = processResponseItem(lfSubItem);

            fhirItems.push(_fhirItem);
          }
        }

        if (lfSubItem._isProcessed) {
          delete lfSubItem._isProcessed; // cleanup, no longer needed
        }
      }

      if (fhirItems.length > 0) {
        if (!isForm && lfItem.dataType !== 'SECTION') {
          // Question repeat is handled at the "parent level"; TODO: not sure how to handle answer repeat here,
          // assuming it isn't possible for an item to have answer repeat and sub-items at the same time.
          targetItem.answer = targetItem.answer || [];
          targetItem.answer[0] = targetItem.answer[0] || {};
          targetItem.answer[0].item = fhirItems;
        } else {
          targetItem.item = fhirItems;
        }
      }
    }

    return targetItem;
  };

  const lformsTypesToFHIRFields = {
    "attachment": "Attachment",
    "INT": 'Integer',
    "REAL": 'Decimal',
    "DT": 'Date',
    "DTM": 'DateTime',
    "TM": 'Time',
    "ST": 'String',
    "TX": 'String',
    "BL": 'Boolean',
    "URL": 'Url',
    "CNE": 'Coding',
    "CWE": 'Coding',
    "QTY": 'Quantity'
  };


    /**
   * Converting the given item's value to FHIR QuestionaireResponse.answer (an array).
   * This is almost straightly refactored out of the original function self._handleAnswerValues.
   * This function only looks at the item value itself and not its sub-items, if any.
   * Here are the details for a single value's conversion (to an element in the returned answer array)
   * - For item data type quantity (QTY), a valueQuantity answer element will be created IF
   *   either (or both) item value or item unit is available.
   * - For item data types boolean, decimal, integer, date, dateTime, instant, time, string, attachment, and url,
   *   it will be converted to a FHIR value{TYPE} entry if the value is not null, not undefined, and not
   *   an empty string.
   * - For CNE and CWE, a valueCoding entry is created IF at least one of the item value's code, text, or system
   *   is available
   * - No answer entry will be created in all other cases, e.g., for types reference, title, section, etc.
   * @param item the item whose value is to be converted
   * @return the converted FHIR QuestionnaireResponse answer (an array), or null if the value is not converted -
   *         see the function description above for more details.
   * @private
   */


     function lfItemValueToFhirAnswer(item) {
        // item could have an empty value if its sub-item has a value
        if (item.value === undefined || item.value === null || item.value === '') return null;
    
        var dataType = getAssumedDataTypeForExport(item);
    
        var values = answerRepeats(item) ? item.value : [item.value];
        var answers: any[] = [];
    
        for (var i = 0; i < values.length; ++i) {
          var itemValue = values[i];
    
          if (itemValue !== undefined && itemValue !== null && itemValue !== '') {
            var answer: any = null; // for Coding
    
            if (dataType === 'CWE' || dataType === 'CNE') {
              // for CWE, the value could be string if it is a user typed, not-on-list value
              if (dataType === 'CWE' && typeof itemValue === 'string') {
                answer = {
                  "valueString": itemValue
                };
              } else if (isEmpty(itemValue)) {
                // var answerCoding = setIfHasValue(null, 'system', LForms.Util.getCodeSystem(itemValue.system));
    
                let answerCoding = setIfHasValue(null, 'code', itemValue.code);
                answerCoding = setIfHasValue(answerCoding, 'display', itemValue.text);
                answer = setIfHasValue(null, 'valueCoding', answerCoding);
              }
            } // for Quantity
            else if (dataType === "QTY") {
              // For now, handling only simple quantities without the comparators.
              // [{
              //   // from Element: extension
              //   "value" : <decimal>, // Numerical value (with implicit precision)
              //   "comparator" : "<code>", // < | <= | >= | > - how to understand the value
              //   "unit" : "<string>", // Unit representation
              //   "system" : "<uri>", // Code System that defines coded unit form
              //   "code" : "<code>" // Coded form of the unit
              // }]
              answer = setIfHasValue(null, 'valueQuantity', makeValueQuantity(itemValue, item.unit));
            } // for boolean, decimal, integer, date, dateTime, instant, time, string, uri, attachment
            else if (lformsTypesToFHIRFields[dataType]) {
              var valueKey = getValueKeyByDataType("value", item);
    
              answer = _defineProperty({}, valueKey, itemValue);
            }
    
            if (answer !== null) {
              answers.push(answer);
            }
          }
        }
    
        return answers.length === 0 ? null : answers;
      };


    /**
     * Check if a LForms item has repeating questions
     * @param item a LForms item
     * @returns {*|boolean}
     * @private
     */
  
    function questionRepeats (item) {
      return item && item.questionCardinality && item.questionCardinality.max && (item.questionCardinality.max === "*" || parseInt(item.questionCardinality.max) > 1);
    };
    /**
     * Check if a LForms item has repeating answers
     * @param item a LForms item
     * @returns {*|boolean}
     * @private
     */
  
  
    // what's the difference between answer repeats and question Repeats
    function answerRepeats (item) {
      return item && item.answerCardinality && item.answerCardinality.max && (item.answerCardinality.max === "*" || parseInt(item.answerCardinality.max) > 1);
    };


    /**
   * Set unit attributes to a given FHIR quantity.
   *
   * @param fhirQuantity - FHIR Quantity object
   * @param lfUnit - Lforms unit, which includes name, code and system.
   * @private
   */


  function setUnitAttributesToFhirQuantity (fhirQuantity, lfUnit) {
    if (fhirQuantity && lfUnit) {
      if (lfUnit.name) {
        fhirQuantity.unit = lfUnit.name;
      }

      if (lfUnit.code) {
        fhirQuantity.code = lfUnit.code;
      } // Unit system is optional. It was using a default system before,
      // Now we have an defined system field, read it from data and
      // not assume a default.


      if (lfUnit.system) {
        fhirQuantity.system = lfUnit.system;
      }
    }
  };


    /**
   * Make a FHIR Quantity for the given value and unit info.
   * @param value optional, must be an integer or decimal
   * @param itemUnit optional, lform data item.unit (that has a name property)
   * @param unitSystem optional, overrides any system in itemUnit.
   * @return a FHIR quantity or null IFF the given value is not a number (parseFloat() returns NaN).
   * @private
   */


     function makeValueQuantity (value, itemUnit, unitSystem=undefined) {
        var fhirQuantity: any = {};
        var floatValue = parseFloat(value);
    
        if (!isNaN(floatValue)) {
          fhirQuantity.value = floatValue;
        }
    
        if (itemUnit) {
          setUnitAttributesToFhirQuantity(fhirQuantity, itemUnit);
    
          if (unitSystem) {
            fhirQuantity.system = unitSystem;
          }
        }
    
        return Object.keys(fhirQuantity).length > 0 ? fhirQuantity : null;
      };



        /**
   * Create a key from data type to be used in a hash
   * @param prefix a prefix to be added to the key
   * @param item a LForms item
   * @returns {*}
   * @private
   */


  function getValueKeyByDataType (prefix, item) {
    // prefix could be 'value', 'initial', 'answer'
    if (!prefix) {
      prefix = "value";
    }

    var fhirType = getFhirDataType(item);

    var dataType = fhirType === 'quantity' ? 'QTY' : item.dataType;
    var valueKey = lformsTypesToFHIRFields[dataType];
    return prefix + valueKey;
  };


  const lformsTypesToFHIRTypes = {
    "SECTION": 'group',
    "TITLE": 'display',
    "ST": 'string',
    "BL": 'boolean',
    "REAL": 'decimal',
    "INT": 'integer',
    "DT": 'date',
    "DTM": 'dateTime',
    "TM": 'time',
    "TX": 'text',
    "URL": 'url',
    "CNE": 'choice',
    "CWE": 'open-choice',
    "QTY": 'quantity',
    "attachment": 'attachment'
  };


    /**
   * Convert LForms data type to FHIR SDC data type
   * @param item an item in the LForms form object
   * @returns {string}
   * @private
   */


     function getFhirDataType (item) {
        var dataType = getAssumedDataTypeForExport(item);
    
        var type = lformsTypesToFHIRTypes[dataType]; // default is string
    
        if (!type) {
          type = 'string';
        }
    
        return type;
      };


      /**
   * Determine how an item's data type should be for export.
    If number type has multiple units, change it to quantity type. In such a case,
   multiple units are converted to quesionnaire-unitOption extension and the default unit
   would go into initial.valueQuantity.unit.
   For single unit numbers, use the same type, whose unit will be in questionnaire-unit extension.
    * @param item an item in the LForms form object
   * @returns {string} dataType - Data type in lforms
   * @private
   */


  function getAssumedDataTypeForExport (item) {
    var dataType = item.dataType;

    if ((item.dataType === 'REAL' || item.dataType === 'INT') && item.units && item.units.length > 1) {
      dataType = 'QTY';
    }

    return dataType;
  };


  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




/**
* Convert LForms captured data to FHIR SDC QuestionnaireResponse
* @param lfData a LForms form object
* @param noExtensions a flag that a standard FHIR Questionnaire is to be created without any extensions.
*  The default is false.
* @param subject A local FHIR resource that is the subject of the output resource.
*  If provided, a reference to this resource will be added to the output FHIR
*  resource when applicable.
* @returns {{}}
*/
export function createQuestionnaireResponse(schema, formData, noExtensions=true, ) {
  var target = {};
  // merge formData with schema to mergedSchema
  const mergedSchema = schema      
  
  if (schema) {
 //    var source = lfData.getFormData(true,true,true);
 //    console.log('SOURCE@ ===>', source)
 //    this._processRepeatingItemValues(source);
 
 
 
    setResponseFormLevelFields(target, mergedSchema, noExtensions);
 
   //  if (mergedSchema.items && Array.isArray(mergedSchema.items)) {
   //    var tmp = processResponseItem(mergedSchema, true);
   //    if(tmp && tmp.item && tmp.item.length) {
   //      target.item = tmp.item;
   //    }
   //  }
 
   // invariant -  first level itemSchema will be always an object.
   const {properties} = schema;
   const rtn = {} as any;
 
   if(properties){
     rtn.item = [];
     Object.values(properties).forEach((itemSchema: any) => {
       const processed = processISchema(itemSchema, formData ?? {}, itemSchema.linkId)
       if(typeof processed !== 'undefined'){
         if(Array.isArray(processed)){
  
           rtn.item = [...rtn.item, ...processed];
         }else rtn.item.push(processed)
       }
     })
   }
 
   return {...target, ...rtn}
   
  }}

  function processISchema(itemSchema, formData, key?: string){
    // item schema can either be question, group or an array
    // lets handle group
    // TODO : defensive programming
    const formDataOfInterest = key ? formData[key]: formData;
    if(!formDataOfInterest){
      return
    }
    let rtn: any = getItemLevelFields(itemSchema)
     if(itemSchema.type === 'object'){
       const {properties} = itemSchema;
       rtn.item = Object.values(properties).map((childQuestion) => processISchema(childQuestion, formDataOfInterest)).filter(x => !!x)
      }
      else if(itemSchema.type === "array"){
       rtn = [];
       if(itemSchema.dataType === 'CNE' || itemSchema.dataType === 'CWE'){
         const processedItemResponse = processQuestionResponse(itemSchema, formData);
         if(processedItemResponse){

           rtn.push(processQuestionResponse(itemSchema, formData))
         }
         else return undefined
       }
       else{
         // http://community.fhir.org/t/questionnaire-repeating-groups-what-is-the-correct-format/2276
        const {items} = itemSchema;
        const responses = formDataOfInterest ?? [];
        // console.log('===>', items, linkId, responses, rtn, itemSchema, responses.length);
        for (let i = 0; i < responses.length; i++ ){
          const processedItemResponse = processISchema(items, formDataOfInterest,  i.toString());
          if(processedItemResponse){

            rtn.push(processISchema(items, formDataOfInterest,  i.toString()))
          }else return
        }
       }
  
     }else{
       const itemResponse = processQuestionResponse(itemSchema, formDataOfInterest);
       if(itemResponse)
        return itemResponse
        else return undefined
     }
     return rtn;
   }