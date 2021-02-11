import { Dictionary } from '@onaio/utils';
import {
  LocationUnit,
  LocationUnitStatus,
  LocationUnitSyncStatus,
  LocationUnitTag,
} from '../../ducks/location-units';
import { Rule } from 'rc-field-form/lib/interface';
import { TreeNode } from '../../ducks/locationHierarchy/types';
import { DataNode } from 'rc-tree-select/lib/interface';
import { v4 } from 'uuid';
import { Geometry } from 'geojson';
import {
  ERROR_PARENTID_STRING,
  ERROR_NAME_STRING,
  ERROR_NAME_REQUIRED,
  ERROR_STATUS_REQUIRED,
  ERROR_TYPE_STRING,
  ERROR_EXTERNAL_ID_STRING,
  ERROR_LOCATION_TAGS_ARRAY,
  ERROR_LOCATION_CATEGORY_REQUIRED,
  ERROR_SERVICE_TYPES_REQUIRED,
} from '../../lang';

export enum FormInstances {
  CORE = 'core',
  EUSM = 'eusm',
}

export type ExtraFields = Dictionary;

/** describes known fields that the form will have */
export interface LocationFormFields {
  instance?: FormInstances;
  id?: string;
  name: string;
  status: LocationUnitStatus;
  type: string;
  parentId?: string;
  externalId?: string;
  locationTags?: number[];
  geometry?: string;
  isJurisdiction?: boolean;
  serviceType?: string;
  extraFields: ExtraFields[];
  username?: string;
}

interface BaseSetting {
  key: string;
  description: string;
  uuid: string;
  settingsId: string;
  settingIdentifier: string;
  settingMetadataId: string;
  v1Settings: false;
  resolveSettings: false;
  documentId: string;
  serverVersion: number;
}

/** describes a single settings object as received from location settings api */
export interface LocationSetting extends BaseSetting {
  label: string;
}

/** describes a single settings object as received from service types settings api */
export interface ServiceTypeSetting extends BaseSetting {
  value: string;
}

export const defaultFormField: LocationFormFields = {
  instance: FormInstances.CORE,
  name: '',
  status: LocationUnitStatus.ACTIVE,
  type: '',
  isJurisdiction: true,
  serviceType: '',
  locationTags: [],
  externalId: '',
  extraFields: [],
  username: '',
};

/** helps compute the default values of the location form field values
 *
 * @param location - the location unit
 * @param instance - the form instance
 * @param isJurisdiction - whether location is jurisdiction or structure
 */
export const getLocationFormFields = (
  location?: LocationUnit,
  instance: FormInstances = FormInstances.CORE,
  isJurisdiction = true
): LocationFormFields => {
  const commonValues = {
    instance,
    isJurisdiction,
  };
  if (!location) {
    return {
      ...defaultFormField,
      ...commonValues,
    };
  }
  const {
    name,
    status,
    parentId,
    username,
    externalId,
    type,
    ...restProperties
  } = location.properties;
  const formFields = {
    ...defaultFormField,
    ...commonValues,
    id: location.id,
    locationTags: location.locationTags?.map((loc) => loc.id),
    geometry: JSON.stringify(location.geometry),
    type: location.type,
    name,
    username,
    status,
    parentId,
    externalId,
    serviceType: type,
    extraFields: Object.entries(restProperties).map(([key, val]) => ({ [key]: val })),
  };

  return formFields;
};

/** removes empty undefined and null objects before they payload is sent to server
 *
 * @param {any} obj object to remove empty keys from
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function removeEmptykeys(obj: any) {
  Object.entries(obj).forEach(([key, value]) => {
    if (typeof value === 'undefined') delete obj[key];
    else if (value === '' || value === null) delete obj[key];
    else if (typeof value === 'object') {
      // if datatype is object this clearly means that either the value is an array or a json object
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const valueObj = value as { [key: string]: any } | any[];
      if (typeof valueObj.length !== 'undefined' && valueObj.length === 0) delete obj[key];
      else removeEmptykeys(value);
    }
  });
}

/**
 * util method to generate a location unit payload from form values
 *
 * @param formValues - values from the form
 * @param nameOfUser - the name of the user
 * @param selectedTags - the selected location tags
 * @param parentNode - selected node to be the parent node
 */
export const generateLocationUnit = (
  formValues: LocationFormFields,
  nameOfUser?: string,
  selectedTags: LocationUnitTag[] = [],
  parentNode?: TreeNode
): LocationUnit => {
  const {
    serviceType,
    id,
    externalId,
    parentId,
    name,
    status,
    type,
    geometry,
    extraFields,
    username,
  } = formValues;
  const parentGeographicLevel = parentNode?.model.node.attributes.geographicLevel ?? -1;
  const thisGeoLevel = (parentGeographicLevel as number) + 1;

  const thisLocationsId = id ? id : v4();

  // set username from values for edit mode, otherwise get it from props through args
  const uName = id ? username : nameOfUser ?? '';

  const initialPayload = {
    properties: {
      geographicLevel: thisGeoLevel,
      username: uName,
      externalId: externalId,
      parentId: parentId ?? '',
      name,
      // eslint-disable-next-line @typescript-eslint/camelcase
      name_en: name,
      status: status,
      type: serviceType,
    },
    id: thisLocationsId,
    syncStatus: LocationUnitSyncStatus.SYNCED,
    type: type,
    locationTags: selectedTags,
    geometry: geometry ? (JSON.parse(geometry) as Geometry) : undefined,
  };

  extraFields.forEach((obj) => {
    // assumes the data to be string or number as for now we only use input type number and text
    Object.keys(obj).forEach((key) => {
      (initialPayload.properties as Dictionary)[key] = obj[key];
    });
  });

  //TODO: - mutable operation.
  removeEmptykeys(initialPayload);
  return initialPayload;
};

/**
 * service types options from settings
 *
 * @param data - the settings array to convert to select options
 */
export function getServiceTypeOptions(data: ServiceTypeSetting[]) {
  return data.map((setting) => ({
    value: setting.value,
    label: setting.value,
  }));
}

/** validation rules for LocationForm component */
export const validationRules = {
  instance: [{ type: 'enum', enum: Object.values(FormInstances), required: true }] as Rule[],
  id: [{ type: 'string' }] as Rule[],
  parentId: [
    { type: 'string', message: ERROR_PARENTID_STRING },
    ({ getFieldValue }) => {
      const instance = getFieldValue('instance');
      if (instance === FormInstances.EUSM)
        return {
          required: true,
        };
      return {
        required: false,
      };
    },
  ] as Rule[],
  name: [
    { type: 'string', message: ERROR_NAME_STRING },
    { required: true, message: ERROR_NAME_REQUIRED },
  ] as Rule[],
  status: [{ type: 'string' }, { required: true, message: ERROR_STATUS_REQUIRED }] as Rule[],
  type: [
    { type: 'string' },
    ({ getFieldValue }) => {
      const instance = getFieldValue('instance');
      if (instance === FormInstances.CORE)
        return {
          required: true,
          message: ERROR_TYPE_STRING,
        };
      return {
        required: false,
      };
    },
  ] as Rule[],
  externalId: [{ type: 'string', message: ERROR_EXTERNAL_ID_STRING }] as Rule[],
  locationTags: [{ type: 'array', message: ERROR_LOCATION_TAGS_ARRAY }] as Rule[],
  geometry: [{ type: 'string', message: ERROR_LOCATION_TAGS_ARRAY }] as Rule[],
  isJurisdiction: [
    {
      type: 'boolean',
    },
    ({ getFieldValue }) => {
      const id = getFieldValue('id');
      const isCreateMode = !id;
      if (isCreateMode)
        return {
          required: true,
          message: ERROR_LOCATION_CATEGORY_REQUIRED,
        };
      return {
        required: false,
      };
    },
  ] as Rule[],

  serviceTypes: [
    ({ getFieldValue }) => {
      const instance = getFieldValue('instance');
      if (instance === FormInstances.EUSM)
        return {
          required: true,
          message: ERROR_SERVICE_TYPES_REQUIRED,
        };
      return {
        required: false,
      };
    },
  ] as Rule[],
  extraFields: [
    {
      required: false,
    },
  ],
};

/** gets location tag options for location form location tags select field
 *
 * @param tags - location unit tags
 *
 */
export const getLocationTagOptions = (tags: LocationUnitTag[]) => {
  return tags.map((locationTag) => {
    return {
      label: locationTag.name,
      value: locationTag.id,
    };
  });
};

/**
 * generates tree select options
 *
 * @param trees - an array of parsed trees
 * @param parentIdDisabledCallback - callback to help determine disabled status of nodes in treeSelect
 */
export const treeToOptions = (
  trees: TreeNode[],
  parentIdDisabledCallback?: (node: TreeNode) => boolean
): DataNode[] => {
  const recurseCreateOptions = (node: TreeNode) => {
    const optionValue: Dictionary = {
      value: node.model.id,
      title: node.model.label,
      ...(parentIdDisabledCallback ? { disabled: parentIdDisabledCallback(node) } : {}),
    };
    if (node.hasChildren()) {
      optionValue.children = node.children.map(recurseCreateOptions);
    }
    return optionValue;
  };
  return trees.map(recurseCreateOptions);
};
