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
import { Geometry, Point } from 'geojson';
import { FormInstance } from 'antd/lib/form/hooks/useForm';
import { LOCATION_UNIT_TYPE } from '../../constants';
import { GetSelectedFullData } from './CustomSelect';
import { uniqBy } from 'lodash';
import type { TFunction } from '@opensrp/i18n';

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
  parentId?: string;
  externalId?: string;
  locationTags?: number[];
  geometry?: string;
  isJurisdiction: boolean;
  serviceType?: string;
  extraFields: ExtraFields[];
  username?: string;
  latitude?: string;
  longitude?: string;
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
  isJurisdiction: true,
  serviceType: undefined,
  locationTags: [],
  externalId: '',
  extraFields: [],
  username: '',
};

/**
 * helps compute the default values of the location form field values
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
  const commonValues = { instance, isJurisdiction: location?.isJurisdiction ?? isJurisdiction };
  if (!location) return { ...defaultFormField, ...commonValues };

  const { name, status, parentId, username, externalId, type, ...restProperties } =
    location.properties;

  // derive latitude and longitudes for point
  const { geometry: geoObject } = location;
  const geoJson = JSON.stringify(geoObject);
  const { longitude, latitude } = getPointCoordinates(geoJson);

  const formFields: LocationFormFields = {
    ...defaultFormField,
    ...commonValues,
    id: location.id,
    locationTags: location.locationTags?.map((loc) => loc.id),
    geometry: geoJson,
    name,
    username,
    status,
    parentId,
    externalId,
    serviceType: type,
    extraFields: Object.entries(restProperties).map(([key, val]) => ({ [key]: val })),
    longitude,
    latitude,
  };

  return formFields;
};

/**
 * removes empty undefined and null objects before they payload is sent to server
 *
 * @param {Dictionary} obj object to remove empty keys from
 */
export function removeEmptykeys(obj: Dictionary) {
  Object.entries(obj).forEach(([key, value]) => {
    if (typeof value === 'undefined') delete obj[key];
    else if (key !== 'parentId' && (value === '' || value === null)) delete obj[key];
    else if (Array.isArray(value) && value.length === 0) delete obj[key];
    // if typeof value is object and its not an array then it should be a json object
    else if (typeof value === 'object') removeEmptykeys(value);
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
  const { serviceType, id, externalId, parentId, name, status, geometry, extraFields, username } =
    formValues;

  const parentGeographicLevel = parentNode?.model.node.attributes.geographicLevel ?? 0;
  const thisGeoLevel = parentId ? (parentGeographicLevel as number) + 1 : 0;

  const thisLocationsId = id ? id : v4();

  // set username from values for edit mode, otherwise get it from props through args
  const uName = id ? username : nameOfUser ?? '';

  const initialPayload: LocationUnit = {
    properties: {
      geographicLevel: thisGeoLevel,
      username: uName,
      externalId: externalId,
      parentId: parentId ?? '',
      name,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      name_en: name,
      status: status,
      type: serviceType,
    },
    id: thisLocationsId,
    syncStatus: LocationUnitSyncStatus.SYNCED,
    type: LOCATION_UNIT_TYPE,
    locationTags: selectedTags,
    geometry: geometry ? (JSON.parse(geometry) as Geometry) : undefined,
  };

  extraFields.forEach((obj) => {
    // assumes the data to be string or number as for now we only use input type number and text
    Object.keys(obj).forEach((key) => {
      if (key === 'geographicLevel') {
        (initialPayload.properties as Dictionary)[key] = thisGeoLevel;
      } else {
        (initialPayload.properties as Dictionary)[key] = obj[key];
      }
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

/**
 * factory for validation rules for LocationForm component
 *
 * @param t - language translation string obj lookup
 */
export const validationRulesFactory = (t: TFunction) => ({
  instance: [{ type: 'enum', enum: Object.values(FormInstances), required: true }] as Rule[],
  id: [{ type: 'string' }] as Rule[],
  parentId: [
    { type: 'string', message: t('Parent ID can only contain letters, numbers and spaces') },
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
    { type: 'string', message: t('Name can only contain letters, numbers and spaces') },
    { required: true, message: t('Name is required') },
  ] as Rule[],
  status: [{ type: 'string' }, { required: true, message: t('Status is required') }] as Rule[],
  type: [
    { type: 'string' },
    ({ getFieldValue }) => {
      const instance = getFieldValue('instance');
      if (instance === FormInstances.CORE)
        return {
          required: true,
          message: t('Type can only contain letters, numbers and spaces'),
        };
      return {
        required: false,
      };
    },
  ] as Rule[],
  externalId: [
    { type: 'string', message: t('External ID can only contain letters, numbers and spaces') },
  ] as Rule[],
  locationTags: [{ type: 'array', message: t('Location Unit must be an array') }] as Rule[],
  geometry: [{ type: 'string', message: t('Location Unit must be an array') }] as Rule[],
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
          message: t('Location category is required'),
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
          message: t('Service types is required'),
        };
      return {
        required: false,
      };
    },
  ] as Rule[],
  longitude: [
    () => ({
      validator(_, value) {
        if (!value) {
          return Promise.resolve();
        }
        return rejectIfNan(value, t('Only decimal values allowed'));
      },
    }),
  ] as Rule[],
  latitude: [
    () => ({
      validator(_, value) {
        if (!value) {
          return Promise.resolve();
        }
        return rejectIfNan(value, t('Only decimal values allowed'));
      },
    }),
  ] as Rule[],
  extraFields: [
    {
      required: false,
    },
  ],
});

/**
 * given a value retrun a rejected promise if value is not parseable as number
 *
 * @param value - value to parse into string
 * @param message - error message to show
 */
const rejectIfNan = (value: string, message: string) => {
  if (isNaN(Number(value))) {
    return Promise.reject(message);
  } else {
    return Promise.resolve();
  }
};

/**
 * gets location tag options for location form location tags select field
 *
 * @param tags - location unit tags
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
 * method to get the full Location tag object once user selects an option in the select dropdown,
 * once the user selects, you only get the id of the selected object, this function will be called
 * to get the full location Tag.
 *
 * @param data - the full data objects
 * @param getOptions - function used to get the options tos how on the dropdown
 * @param value - selected value (an array for multi select otherwise a string)
 */
export const getSelectedLocTagObj: GetSelectedFullData<LocationUnitTag> = (
  data,
  getOptions,
  value
) => {
  // #595 - remove duplicate data(those that have the same id)
  const uniqData = uniqBy(data, (obj) => obj.id);
  const selected = uniqData.filter((dt) => {
    const option = getOptions([dt])[0];
    return (
      (Array.isArray(value) && option.value && value.includes(option.value)) ||
      value === option.value
    );
  });
  return selected;
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

/**
 * validate coordinates, returns true only if coordinates belong to a point
 *
 * @param geoJson - the geojson object
 */
export const cordIsPoint = (geoJson?: Partial<Geometry>) => {
  return (
    geoJson?.type === 'Point' &&
    Array.isArray(geoJson.coordinates) &&
    geoJson.coordinates.length === 2
  );
};

export const getPointCoordinates = (geoText: string) => {
  let geojson: Geometry;
  try {
    geojson = JSON.parse(geoText);
  } catch (err) {
    return {};
  }
  const isPoint = cordIsPoint(geojson);
  if (!isPoint) {
    return {};
  }
  const lng = (geojson as Point).coordinates[0];
  const lat = (geojson as Point).coordinates[1];

  const longitude = lng ? String(lng) : undefined;
  const latitude = lat ? String(lat) : undefined;

  return { longitude, latitude };
};

/**
 * handles form values change , creates a values change handler that listens for
 * changes to geometry, latitude and longitude and syncs changes across the 3 fields
 *
 * @param form - the form instance
 */
export const handleGeoFieldsChangeFactory = (form: FormInstance) => {
  return (changedValues: Partial<LocationFormFields>, allValues: LocationFormFields) => {
    /** location fields that could possible change */
    const { geometry, latitude, longitude } = changedValues;
    if (geometry !== undefined) {
      // means geometry changed
      const { longitude, latitude } = getPointCoordinates(geometry);
      form.setFieldsValue({
        longitude,
        latitude,
      });
    }

    const { geometry: existingGeo, latitude: existingLat, longitude: ExistingLng } = allValues;
    let currentGeoJson;
    try {
      currentGeoJson = JSON.parse(existingGeo ?? '{}');
    } catch (err) {
      currentGeoJson = {};
    }

    if (latitude !== undefined) {
      // means latitude changed
      const isPoint = cordIsPoint(currentGeoJson);
      const parsedLatitude = Number(latitude);
      if (isPoint) {
        const currentGeometry = { ...currentGeoJson };
        currentGeometry.coordinates[1] = parsedLatitude;
        form.setFieldsValue({
          geometry: JSON.stringify(currentGeometry),
        });
      } else {
        form.setFieldsValue({
          geometry: JSON.stringify({ type: 'Point', coordinates: [ExistingLng, parsedLatitude] }),
        });
      }
    }

    if (longitude !== undefined) {
      // means longitude changed
      const isPoint = cordIsPoint(currentGeoJson);
      const parsedLongitude = Number(longitude);
      if (isPoint) {
        const currentGeometry = { ...currentGeoJson };
        currentGeometry.coordinates[0] = Number(longitude);
        form.setFieldsValue({
          geometry: JSON.stringify(currentGeometry),
        });
      } else {
        form.setFieldsValue({
          geometry: JSON.stringify({ type: 'Point', coordinates: [parsedLongitude, existingLat] }),
        });
      }
    }
  };
};
