import { Dictionary } from '@onaio/utils';
import { Rule } from 'rc-field-form/lib/interface';
import { TreeNode } from '../../helpers/types';
import { DataNode } from 'rc-tree-select/lib/interface';
import { v4 } from 'uuid';
import { get } from 'lodash';
import { IfhirR4 } from '@smile-cdr/fhirts';
import { ILocation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ILocation';
import { FHIRServiceClass } from '@opensrp/react-utils';
import { LocationUnitStatus } from '../../helpers/types';
import type { TFunction } from '@opensrp/i18n';

export type ExtraFields = Dictionary;

/** describes known fields that the form will have */
export interface LocationFormFields {
  id?: string;
  name: string;
  status: LocationUnitStatus;
  parentId?: string;
  description?: string;
  alias?: string;
  isJurisdiction: boolean;
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
  location?: IfhirR4.ILocation,
  parentId?: string
): LocationFormFields => {
  return {
    ...(location ?? defaultFormField),
    isJurisdiction: true, // TODO
    parentId: parentId ?? location?.partOf?.reference,
  } as LocationFormFields;
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
  const { id, name, status, description, alias, isJurisdiction } = formValues;

  const uuid = get(initialValues, 'identifier.0.value');
  const thisLocationsIdentifier = uuid ? uuid : v4();

  let partOf: ILocation['partOf'];
  if (parentNode) {
    // this is a user defined location
    partOf = {
      reference: parentNode.model.nodeId,
      display: parentNode.model.node.name,
    };
  }

  const payload = {
    resourceType: 'Location',
    status,
    name,
    alias,
    description,
    partOf: partOf,
    identifier: [
      {
        use: 'official',
        value: thisLocationsIdentifier,
      },
    ],
    physicalType: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/location-physical-type',
          code: isJurisdiction ? 'jdn' : 'bu',
          display: isJurisdiction ? 'Jurisdiction' : 'Building',
        },
      ],
    },
  } as ILocation;

  if (id) {
    payload.id = id;
  }

  return payload;
};

/**
 * factory for validation rules for LocationForm component
 *
 * @param t - language translator
 */
export const validationRulesFactory = (t: TFunction) => ({
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
 * @param isEdit - help decide whether to post or put plan
 */
export async function postPutLocationUnit(payload: ILocation, baseUrl: string, isEdit = true) {
  const serve = new FHIRServiceClass<ILocation>(baseUrl, 'Location');
  if (isEdit) {
    return serve.update(payload).catch((err: Error) => {
      throw err;
    });
  }
  return serve.create(payload).catch((err: Error) => {
    throw err;
  });
}
