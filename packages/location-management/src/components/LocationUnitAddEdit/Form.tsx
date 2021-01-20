import * as Yup from 'yup';
import React from 'react';
import {
  SubmitButton,
  Form as AntForm,
  Input,
  Radio,
  Select,
  TreeSelect,
  FormikDebug,
} from 'formik-antd';
import { Button } from 'antd';
import { history } from '@onaio/connected-reducer-registry';
import { getUser } from '@onaio/session-reducer';
import { OpenSRPService } from '@opensrp/react-utils';
import { Formik } from 'formik';
import {
  ExtraField,
  LocationUnitPayloadPOST,
  LocationUnitPayloadPUT,
  LocationUnitStatus,
  LocationUnitSyncStatus,
  LocationUnitTag,
} from '../../ducks/location-units';
import { useSelector } from 'react-redux';
import { Geometry } from 'geojson';
import { ERROR_OCCURED, LOCATION_UNIT_POST_PUT } from '../../constants';
import { v4 } from 'uuid';
import { LocationUnitGroup } from '../../ducks/location-unit-groups';
import { ParsedHierarchyNode } from '../../ducks/locationHierarchy/types';
import { sendErrorNotification, sendSuccessNotification } from '@opensrp/notifications';
import { Dictionary } from '@onaio/utils';
import { ServiceTypeSelect } from './serviceTypesSelect';

/** describes value of location.properties.serviceTypes */

/** describes known fields that the form will have */
export interface FormFields extends Dictionary {
  name: string;
  status: LocationUnitStatus;
  type: string;
  parentId?: string;
  externalId?: string;
  locationTags?: number[];
  geometry?: string;
  isJurisdiction?: boolean;
  serviceTypes?: string;
}

const defaultFormField: FormFields = {
  name: '',
  status: LocationUnitStatus.ACTIVE,
  type: '',
  isJurisdiction: false,
  serviceTypes: '',
};

/** form props   */
export interface Props {
  id?: string;
  initialValue?: FormFields;
  extraFields?: ExtraField[];
  locationUnitGroup: LocationUnitGroup[];
  treeData: ParsedHierarchyNode[];
  openSRPBaseURL: string;
  hiddenFields: string[];
  serviceTypes: string[];
}

/** yup validations for practitioner data object from form */
const userSchema = Yup.object().shape({
  parentId: Yup.string().typeError('Parent ID must be a String'),
  name: Yup.string().typeError('Name must be a String').required('Name is Required'),
  status: Yup.string().required('Status is Required'),
  type: Yup.string().typeError('Type must be a String').required('Type is Required'),
  externalId: Yup.string().typeError('External id must be a String'),
  locationTags: Yup.array().typeError('location Unit Groups must be an Array'),
  geometry: Yup.string().typeError('location Unit Groups must be a An String'),
  isJurisdiction: Yup.boolean().required('isJurisdiction is required'),
  serviceTypes: Yup.string().when('isJurisdiction', {
    is: false,
    then: Yup.string().required('Service Types is required'),
  }),
});

const layout = { labelCol: { span: 8 }, wrapperCol: { span: 11 } };
const offsetLayout = { wrapperCol: { offset: 8, span: 11 } };
const status = [
  { label: 'Active', value: LocationUnitStatus.ACTIVE },
  { label: 'Inactive', value: LocationUnitStatus.INACTIVE },
];

// value options for isJurisdiction questions
const locationCategoryOptions = [
  { label: 'Service point', value: false },
  { label: 'Jurisdiction', value: true },
];

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

/** Function to find geolocation of a node by passing its id
 *
 * @param {Array<ParsedHierarchyNode>} tree Array of ParsedHierarchyNodes to find node from
 * @param {string} id id of the node
 * @returns {number | null} return geolocation if found else return null
 */
export function findParentGeoLocation(tree: ParsedHierarchyNode[], id: string): number | undefined {
  const map: (number | undefined)[] = tree.flatMap((node) => {
    if (node.id === id) return node.node.attributes.geographicLevel;
    else if (node.children) return findParentGeoLocation(node.children, id);
    else return undefined;
  });

  const filter = map.filter((e) => e !== undefined);
  return filter[0];
}

/** Handle form submission
 *
 * @param {Function} setSubmitting method to set submission status
 * @param {Object} values the form fields
 * @param {string} openSRPBaseURL - base url
 * @param {Array<LocationUnitGroup>} locationUnitGroup all locationUnitgroup
 * @param {Array<ParsedHierarchyNode>} treeData ParsedHierarchyNode nodes to get geolocation from
 * @param {string} username username of logged in user
 * @param {ExtraField} extraFields extraFields to be input with location unit
 * @param {number} id location unit
 * @returns {void} return nothing
 */
export async function onSubmit(
  setSubmitting: (isSubmitting: boolean) => void,
  values: FormFields,
  openSRPBaseURL: string,
  locationUnitGroup: LocationUnitGroup[],
  treeData: ParsedHierarchyNode[],
  username: string,
  extraFields?: ExtraField[],
  id?: string
) {
  const locationUnitGroupFiler = locationUnitGroup.filter((e) =>
    values.locationTags?.includes(e.id)
  );

  const locationTag: LocationUnitTag[] = locationUnitGroupFiler.map((tag: LocationUnitTag) => ({
    id: tag.id,
    name: tag.name,
  }));

  let geographicLevel = 0;
  if (values.parentId) {
    const parent = findParentGeoLocation(treeData, values.parentId);
    if (parent !== undefined) geographicLevel = parent + 1;
    else throw new Error(ERROR_OCCURED); // stops execution because this is unlikely thing to happen and shouldn't send error to server
  }

  const payload: (LocationUnitPayloadPOST | LocationUnitPayloadPUT) & {
    is_jurisdiction: boolean;
    properties: {
      serviceTypes?: { name: string }[];
    };
  } = {
    // eslint-disable-next-line @typescript-eslint/camelcase
    is_jurisdiction: values.isJurisdiction as boolean,
    properties: {
      geographicLevel: geographicLevel,
      username: username,
      externalId: values.externalId,
      parentId: values.parentId ? values.parentId : '',
      name: values.name,
      // eslint-disable-next-line @typescript-eslint/camelcase
      name_en: values.name,
      status: values.status,
      ...(values.serviceTypes ? { serviceTypes: [{ name: values.serviceTypes }] } : {}),
    },
    id: id ? id : v4(),
    syncStatus: LocationUnitSyncStatus.SYNCED,
    type: values.type,
    locationTags: locationTag,
    geometry: values.geometry ? (JSON.parse(values.geometry) as Geometry) : undefined,
  };

  extraFields?.forEach(({ key }) => {
    // assumes the data to be string or number as for now we only use input type number and text
    payload.properties[key] = values[key] as string | number;
  });

  removeEmptykeys(payload);

  const serve = new OpenSRPService(LOCATION_UNIT_POST_PUT, openSRPBaseURL);
  if (id) {
    await serve
      .update({ ...payload })
      .then(() => {
        sendSuccessNotification('Location Unit Updated successfully');
        history.goBack();
      })
      .catch(() => sendErrorNotification(ERROR_OCCURED));
  } else {
    await serve
      .create({ ...payload })
      .then(() => {
        sendSuccessNotification('Location Unit Created successfully');
        history.goBack();
      })
      .catch(() => sendErrorNotification(ERROR_OCCURED));
  }

  setSubmitting(false);
}

export const Form: React.FC<Props> = (props: Props) => {
  const user = useSelector((state) => getUser(state));

  /** Function to parse the hierarchy tree into TreeSelect node format
   *
   * @param {Array<ParsedHierarchyNode>} hierarchyNode the tree node to parse
   * @returns {Array<React.ReactNode>} the parsed format of for Ant TreeSelect
   */
  function parseHierarchyNode(hierarchyNode: ParsedHierarchyNode[]): React.ReactNode[] {
    return hierarchyNode.map((node) => (
      <TreeSelect.TreeNode key={node.id} value={node.id} title={node.title}>
        {node.children ? parseHierarchyNode(node.children) : null}
      </TreeSelect.TreeNode>
    ));
  }

  /** function to filter options from the select or not
   *
   * @param {string} input value
   * @param {any} option .
   * @returns {boolean} return weather option will be included in the filtered set;
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function filterFunction(input: string, option: any): boolean {
    return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  }

  /** helper to check if a field should be rendered
   *
   * @param name - name that has been bound to the field
   */
  const isHidden = (name: string) => props.hiddenFields.includes(name);

  return (
    <Formik
      initialValues={props.initialValue ? props.initialValue : defaultFormField}
      validationSchema={userSchema}
      onSubmit={(
        values: FormFields,
        { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
      ) =>
        onSubmit(
          setSubmitting,
          values,
          props.openSRPBaseURL,
          props.locationUnitGroup,
          props.treeData,
          user.username,
          props.extraFields,
          props.id
        )
      }
    >
      {({ isSubmitting, handleSubmit }) => (
        <AntForm requiredMark={'optional'} {...layout} onSubmitCapture={handleSubmit}>
          <FormikDebug />
          <AntForm.Item hidden={isHidden('parentId')} label="Parent" name="parentId" required>
            <TreeSelect
              name="parentId"
              style={{ width: '100%' }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="Please select"
            >
              {parseHierarchyNode(props.treeData)}
            </TreeSelect>
          </AntForm.Item>

          <AntForm.Item hidden={isHidden('name')} name="name" label="Name" required>
            <Input name="name" placeholder="Enter a location name" />
          </AntForm.Item>

          <AntForm.Item
            hidden={isHidden('status')}
            label="Status"
            name="status"
            valuePropName="checked"
            required
          >
            <Radio.Group
              name="status"
              defaultValue={props.initialValue?.status}
              options={status}
            ></Radio.Group>
          </AntForm.Item>

          <AntForm.Item
            hidden={isHidden('isJurisdiction')}
            label="Location Category"
            name="isJurisdiction"
            id="isJurisdiction"
          >
            <Radio.Group name="isJurisdiction" options={locationCategoryOptions}></Radio.Group>
          </AntForm.Item>

          <AntForm.Item hidden={isHidden('type')} name="type" label="Type" required>
            <Input name="type" placeholder="Select type" />
          </AntForm.Item>

          <AntForm.Item
            hidden={isHidden('serviceTypes')}
            name="serviceTypes"
            id="serviceTypes"
            label="Type"
            required
          >
            <ServiceTypeSelect name="serviceTypes" />
          </AntForm.Item>

          <AntForm.Item hidden={isHidden('externalId')} name="externalId" label="External ID">
            <Input name="externalId" placeholder="Select status" />
          </AntForm.Item>

          <AntForm.Item hidden={isHidden('geometry')} name="geometry" label="geometry">
            <Input.TextArea name="geometry" rows={4} placeholder="</> JSON" />
          </AntForm.Item>

          <AntForm.Item hidden={isHidden('locationTags')} label="Unit Group" name="locationTags">
            <Select
              name="locationTags"
              mode="multiple"
              allowClear
              showSearch
              placeholder="Enter a location group name"
              optionFilterProp="children"
              filterOption={filterFunction}
            >
              {props.locationUnitGroup.map((e) => (
                <Select.Option key={e.id} value={e.id}>
                  {e.name}
                </Select.Option>
              ))}
            </Select>
          </AntForm.Item>

          {props.extraFields?.map((field) => (
            <AntForm.Item
              hidden={isHidden('extraFields')}
              key={field.key}
              name={field.key}
              label={field.label}
              wrapperCol={field.label ? { span: 11 } : { offset: 8, span: 11 }}
            >
              <Input
                name={field.key}
                type={field.type}
                defaultValue={field.value}
                placeholder={field.description}
              />
            </AntForm.Item>
          ))}

          <AntForm.Item name="buttons" {...offsetLayout}>
            <SubmitButton id="submit">{isSubmitting ? 'Saving' : 'Save'}</SubmitButton>
            <Button id="cancel" onClick={() => history.goBack()} type="dashed">
              Cancel
            </Button>
          </AntForm.Item>
        </AntForm>
      )}
    </Formik>
  );
};

export default Form;
