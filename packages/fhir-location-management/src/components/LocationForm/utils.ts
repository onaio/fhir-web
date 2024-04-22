import { Dictionary } from '@onaio/utils';
import { Rule } from 'rc-field-form/lib/interface';
import { TreeNode } from '../../helpers/types';
import { DataNode } from 'rc-tree-select/lib/interface';
import { v4 } from 'uuid';
import { isEmpty, isEqual } from 'lodash';
import { ILocation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ILocation';
import { FHIRServiceClass, getObjLike, getValueSetOptionsValue } from '@opensrp/react-utils';
import { LocationUnitStatus } from '../../helpers/types';
import type { TFunction } from '@opensrp/i18n';
import {
  externalId,
  geometry,
  latitude,
  serviceType,
  longitude,
  locationGeoJsonExtensionUrl,
} from '../../constants';
import { Extension } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/extension';
import { CodeableConcept } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/codeableConcept';
import { Coding } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/coding';
import {
  getAdministrativeLevelTypeCoding,
  administrativeLevelSystemUri,
  getLocationAdmLevel,
  hl7PhysicalTypeCodeSystemUri,
  eusmServicePointCodeSystemUri,
} from '@opensrp/fhir-helpers';

export type ExtraFields = Dictionary;

/** describes known fields that the form will have */
export interface LocationFormFields {
  id?: string;
  name: string;
  status: LocationUnitStatus;
  parentId?: string;
  description?: string;
  alias?: string[];
  isJurisdiction?: boolean;
  externalId?: string;
  geometry?: string;
  latitude?: number;
  longitude?: number;
  serviceType?: string;
  initObj?: ILocation;
  type?: CodeableConcept[];
}

export const defaultFormFields: LocationFormFields = {
  id: '',
  name: '',
  parentId: undefined,
  status: LocationUnitStatus.ACTIVE,
  isJurisdiction: true,
  description: undefined,
  alias: undefined,
};

/**
 * helps compute the default values of the location form field values
 *
 * @param location - the location unit
 * @param parentId - parent node id
 */
export const getLocationFormFields = (
  location?: ILocation,
  parentId?: string
): LocationFormFields => {
  if (location) {
    const { position, extension, physicalType, name, status, type, description, alias, id } =
      location;

    const geoJsonExtension = getObjLike<Extension>(
      extension,
      'url',
      locationGeoJsonExtensionUrl
    )[0] as Extension | undefined;
    const geoJsonAttachment = geoJsonExtension?.valueAttachment?.data;
    let geometryGeoJSon;
    if (geoJsonAttachment) {
      // try and parse into an object.
      geometryGeoJSon = atob(geoJsonAttachment);
    }

    const physicalTypeCoding = getObjLike(
      physicalType?.coding ?? [],
      'system',
      hl7PhysicalTypeCodeSystemUri
    )[0] as Coding | undefined;

    const servicePointTypeCodings = type?.flatMap((concept) => concept.coding ?? []);
    const serviceTypeCode = getObjLike(
      servicePointTypeCodings,
      'system',
      eusmServicePointCodeSystemUri
    )[0] as Coding | undefined;

    return {
      ...defaultFormFields,
      initObj: location,
      isJurisdiction: physicalTypeCoding?.code !== 'bu',
      name,
      status,
      geometry: geometryGeoJSon,
      parentId: parentId ?? location.partOf?.reference,
      latitude: position?.latitude,
      longitude: position?.longitude,
      serviceType: getValueSetOptionsValue(serviceTypeCode),
      alias,
      description,
      id,
    } as LocationFormFields;
  }
  return { ...defaultFormFields, parentId };
};

// TODO - dry out fhir-helpers
export const hasCode = (codeList: Coding[], coding: Coding) => {
  for (const code of codeList) {
    if (isEqual(code, coding)) {
      return true;
    }
  }
  return false;
};

/**
 * get adminLevel coding for filled form data. The admin level is computed as
 * parentNode's admin level + 1. i.e. if the parent node has an admin level.
 *
 * @param parentNode - parent node of created location
 */
export const getResourceType = (parentNode?: TreeNode) => {
  let admLevel: number | undefined;
  if (parentNode) {
    const resourceType = parentNode.model?.node?.type;
    const level = getLocationAdmLevel(resourceType);
    admLevel = level ? parseInt(level) + 1 : undefined;
  } else {
    admLevel = 0;
  }

  if (admLevel !== undefined) {
    const admLevelTypeCoding = getAdministrativeLevelTypeCoding(admLevel);
    return admLevelTypeCoding;
  }
};

/**
 * util method to generate a location unit payload from form values
 *
 * @param formValues - values from the form
 * @param initialValues - initial values
 * @param parentNode - parent node of created location
 */
export const generateLocationUnit = (
  formValues: LocationFormFields,
  initialValues: LocationFormFields,
  parentNode?: TreeNode
) => {
  const {
    id,
    name,
    status,
    description,
    alias,
    isJurisdiction,
    geometry,
    latitude,
    longitude,
    serviceType,
  } = formValues;
  const { physicalType, type, ...restOfInitObj } = initialValues.initObj ?? {};

  const adminLevelTypeCoding = getResourceType(parentNode);

  let partOf: ILocation['partOf'];
  if (parentNode) {
    // this is a user defined location
    partOf = {
      reference: parentNode.model.nodeId,
      display: parentNode.model.node.name,
    };
  }

  // sanitize fields that we will provide data for.
  const initialObTypeConcepts = (type ?? []).filter((concept) => {
    for (const coding of concept.coding ?? []) {
      if (
        [
          hl7PhysicalTypeCodeSystemUri,
          eusmServicePointCodeSystemUri,
          administrativeLevelSystemUri,
        ].includes(coding.system as string)
      ) {
        return false;
      }
    }
    return true;
  });

  /** if coding exists in type and physical  */
  const physicalTypeCoding = {
    system: hl7PhysicalTypeCodeSystemUri,
    code: isJurisdiction ? 'jdn' : 'bu',
    display: isJurisdiction ? 'Jurisdiction' : 'Building',
  };
  const payload = {
    ...restOfInitObj,
    resourceType: 'Location',
    status,
    name,
    alias,
    description,
    partOf: partOf,
    type: [...initialObTypeConcepts],
  } as ILocation;

  // update payload.type codings
  // jurisdiction or structure
  if (isJurisdiction !== undefined) {
    const physicalTypeConcept: CodeableConcept = { coding: [physicalTypeCoding] };
    (payload.type as CodeableConcept[]).push(physicalTypeConcept);
    payload.physicalType = physicalTypeConcept;
  }
  // admin level coding
  if (adminLevelTypeCoding) {
    (payload.type as CodeableConcept[]).push({ coding: [adminLevelTypeCoding] });
  }
  // service point coding.
  try {
    if (serviceType) {
      const coding = JSON.parse(serviceType) as Coding;
      (payload.type as CodeableConcept[]).push({ coding: [coding] });
    }
  } catch {
    void 0;
  }

  if (id) {
    payload.id = id;
  } else {
    payload.id = v4();
  }

  const position: ILocation['position'] = {};
  if (longitude) {
    position.longitude = longitude;
  }
  if (latitude) {
    position.latitude = latitude;
  }
  if (!isEmpty(position)) {
    payload.position = position;
  }

  const initialExtensions = initialValues.initObj?.extension ?? [];
  const remainingExtensions = initialExtensions.filter(
    (ext) => ext.url !== locationGeoJsonExtensionUrl
  );
  if (geometry) {
    // add to extension array, modify extension if one exists
    remainingExtensions.push({
      url: locationGeoJsonExtensionUrl,
      valueAttachment: {
        data: btoa(geometry),
      },
    });
  }
  if (remainingExtensions.length) {
    payload.extension = remainingExtensions;
  }

  return payload;
};

/**
 * given a value return a rejected promise if value is not as number
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

export type LocationFormFieldsType = Omit<keyof LocationFormFields, 'initObj'>;
export interface ValidationFactory {
  (t: TFunction): { [key: string]: Rule[] };
}

/**
 * factory for validation rules for LocationForm component
 *
 * @param t - language translator
 */
export const defaultValidationRulesFactory = (t: TFunction) => ({
  id: [{ type: 'string' }] as Rule[],
  parentId: [
    { type: 'string', message: t(`Parent ID can only contain letters, numbers and spaces`) },
    {
      required: false,
    },
  ] as Rule[],
  name: [
    { type: 'string', message: t(`Name can only contain letters, numbers and spaces`) },
    { required: true, message: t(`Name is required`) },
  ] as Rule[],
  alias: [
    { type: 'string', message: t(`Name can only contain letters, numbers and spaces`) },
    { required: true, message: t(`Alias is required`) },
  ] as Rule[],
  status: [{ type: 'string' }, { required: true, message: t(`Status is required`) }] as Rule[],
  isJurisdiction: [
    {
      type: 'boolean',
    },
    {
      required: false,
    },
  ] as Rule[],
  description: [{ type: 'string' }, { required: false }] as Rule[],
  [externalId]: [
    { type: 'string', message: t('External ID can only contain letters, numbers and spaces') },
  ] as Rule[],
  [serviceType]: [
    {
      required: false,
    },
  ] as Rule[],
  [geometry]: [{ type: 'string', message: t('Location Unit must be an array') }] as Rule[],
  [longitude]: [
    () => ({
      validator(_, value) {
        if (!value) {
          return Promise.resolve();
        }
        return rejectIfNan(value, t('Only decimal values allowed'));
      },
    }),
  ] as Rule[],
  [latitude]: [
    () => ({
      validator(_, value) {
        if (!value) {
          return Promise.resolve();
        }
        return rejectIfNan(value, t('Only decimal values allowed'));
      },
    }),
  ] as Rule[],
});

/**
 * factory for validation rules for LocationForm component
 *
 * @param t - language translator
 */
export const eusmServicePointValidationRules = (t: TFunction) => ({
  ...defaultValidationRulesFactory(t),
  id: [{ type: 'string' }] as Rule[],
  parentId: [
    { type: 'string', message: t(`Parent ID can only contain letters, numbers and spaces`) },
    {
      required: true,
      message: t('Please choose a parent location for this service point'),
    },
  ] as Rule[],
  [serviceType]: [
    {
      required: true,
      message: t(`service type is required`),
    },
  ] as Rule[],
});

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
      value: node.model.nodeId,
      title: node.model.node.name,
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
 * @param payload - the payload
 * @param baseUrl -  base url of api
 */
export async function postPutLocationUnit(payload: ILocation, baseUrl: string) {
  const serve = new FHIRServiceClass<ILocation>(baseUrl, 'Location');
  return serve.update(payload).catch((err: Error) => {
    throw err;
  });
}
