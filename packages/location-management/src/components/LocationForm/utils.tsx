import { Dictionary } from '@onaio/utils';
import { SETTINGS_CONFIGURATION_TYPE } from '../../constants';
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
  serviceTypes?: string[] | string;
  extraFields: ExtraFields[];
  username?: string;
}

/** describes a single settings object as received from settings api */
export interface Setting {
  key: string;
  label: string;
  description: string;
  uuid: string;
  settingsId: string;
  settingIdentifier: string;
  settingMetadataId: string;
  v1Settings: false;
  resolveSettings: false;
  documentId: string;
  serverVersion: number;
  type: typeof SETTINGS_CONFIGURATION_TYPE;
}

export const defaultFormField: LocationFormFields = {
  instance: FormInstances.CORE,
  name: '',
  status: LocationUnitStatus.ACTIVE,
  type: '',
  isJurisdiction: false,
  serviceTypes: '',
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
    serviceTypes,
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
    serviceTypes: serviceTypes?.map((type) => type.name) ?? [],
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
    serviceTypes,
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
  const geographicLevel = parentNode?.model.node.geographicLevel ?? 0;

  // transform into an array for easier processing
  const serviceTypesValues = serviceTypes
    ? Array.isArray(serviceTypes)
      ? serviceTypes
      : Array(serviceTypes)
    : [];
  const serviceTypesPayload =
    serviceTypesValues.length > 0 ? serviceTypesValues.map((type) => ({ name: type })) : [];

  const thisLocationsId = id ? id : v4();

  // set username from values for edit mode, otherwise get it from props through args
  const uName = id ? username : nameOfUser ?? '';

  const initialPayload = {
    properties: {
      geographicLevel,
      username: uName,
      externalId: externalId,
      parentId: parentId ?? '',
      name,
      // eslint-disable-next-line @typescript-eslint/camelcase
      name_en: name,
      status: status,
      serviceTypes: serviceTypesPayload,
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
export function getServiceTypeOptions(data: Setting[]) {
  return data.map((setting) => ({
    value: setting.label,
    label: setting.label,
  }));
}

/** validation rules for LocationForm component */
export const validationRules = {
  instance: [{ type: 'enum', enum: Object.values(FormInstances), required: true }] as Rule[],
  id: [{ type: 'string' }] as Rule[],
  parentId: [{ type: 'string', message: 'Parent ID must be a string' }] as Rule[],
  name: [
    { type: 'string', message: 'Name must be a string' },
    { required: true, message: 'Name is required' },
  ] as Rule[],
  status: [{ type: 'string' }, { required: true, message: 'Status is Required' }] as Rule[],
  type: [
    { type: 'string' },
    ({ getFieldValue }) => {
      const instance = getFieldValue('instance');
      if (instance === FormInstances.CORE)
        return {
          required: true,
          message: 'Type is required',
        };
      return {
        required: false,
      };
    },
  ] as Rule[],
  externalId: [{ type: 'string', message: 'External id must be a String' }] as Rule[],
  locationTags: [{ type: 'array', message: 'Location units must be an array' }] as Rule[],
  geometry: [{ type: 'string', message: 'location Unit Groups must be a An String' }] as Rule[],
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
          message: 'Location category is required',
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
          message: 'Service Types is required',
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

/** generates tree select options
 *
 * @param trees - an array of parsed trees
 */
export const treeToOptions = (trees: TreeNode[]): DataNode[] => {
  const recurseCreateOptions = (node: TreeNode) => {
    const optionValue: Dictionary = {
      value: node.model.id,
      title: node.model.label,
    };
    if (node.hasChildren()) {
      optionValue.children = node.children.map(recurseCreateOptions);
    }
    return optionValue;
  };
  return trees.map(recurseCreateOptions);
};
