import * as Yup from 'yup';
import React from 'react';
import { SubmitButton, Form as AntForm, Input, Radio, Select, TreeSelect } from 'formik-antd';
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
import { LOCATION_UNIT_POST_PUT } from '../../constants';
import {
  ACTIVE,
  INACTIVE,
  ERROR_EXTERNAL_ID_STRING,
  ERROR_GEOMETRY_STRING,
  ERROR_LOCATION_TAGS_ARRAY,
  ERROR_NAME_REQUIRED,
  ERROR_NAME_STRING,
  ERROR_OCCURED,
  ERROR_PARENTID_STRING,
  ERROR_STATUS_REQUIRED,
  ERROR_TYPE_REQUIRED,
  ERROR_TYPE_STRING,
  MESSAGE_LOCATION_UNIT_UPDATED,
  MESSAGE_LOCATION_UNIT_CREATED,
  PLEASE_SELECT,
  NAME,
  STATUS,
  SAVING,
  SAVE,
  TYPE,
  EXTERNAL_ID,
  SELECT_TYPE,
  SELECT_STATUS,
  GEOMETRY,
  UNIT_GROUP,
  CANCEL,
} from '../../lang';
import { v4 } from 'uuid';
import { LocationUnitGroup } from '../../ducks/location-unit-groups';
import { ParsedHierarchyNode } from '../../ducks/locationHierarchy/types';
import { sendErrorNotification, sendSuccessNotification } from '@opensrp/notifications';
import { Dictionary } from '@onaio/utils';

export interface FormField extends Dictionary<string | number | number[] | undefined> {
  name: string;
  status: LocationUnitStatus;
  type: string;
  parentId?: string;
  externalId?: string;
  locationTags?: number[];
  geometry?: string;
}

const defaultFormField: FormField = {
  name: '',
  status: LocationUnitStatus.ACTIVE,
  type: '',
};

export interface Props {
  id?: string;
  initialValue?: FormField;
  extraFields?: ExtraField[];
  locationUnitGroup: LocationUnitGroup[];
  treedata: ParsedHierarchyNode[];
  opensrpBaseURL: string;
}

/** yup validations for practitioner data object from form */
const userSchema = Yup.object().shape({
  parentId: Yup.string().typeError(ERROR_PARENTID_STRING),
  name: Yup.string().typeError(ERROR_NAME_STRING).required(ERROR_NAME_REQUIRED),
  status: Yup.string().required(ERROR_STATUS_REQUIRED),
  type: Yup.string().typeError(ERROR_TYPE_STRING).required(ERROR_TYPE_REQUIRED),
  externalId: Yup.string().typeError(ERROR_EXTERNAL_ID_STRING),
  locationTags: Yup.array().typeError(ERROR_LOCATION_TAGS_ARRAY),
  geometry: Yup.string().typeError(ERROR_GEOMETRY_STRING),
});
const layout = { labelCol: { span: 8 }, wrapperCol: { span: 11 } };
const offsetLayout = { wrapperCol: { offset: 8, span: 11 } };
const status = [
  { label: ACTIVE, value: LocationUnitStatus.ACTIVE },
  { label: INACTIVE, value: LocationUnitStatus.INACTIVE },
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
 * @param {string} opensrpBaseURL - base url
 * @param {Array<LocationUnitGroup>} locationUnitgroup all locationUnitgroup
 * @param {Array<ParsedHierarchyNode>} treedata ParsedHierarchyNode nodes to get geolocation from
 * @param {string} username username of logged in user
 * @param {ExtraField} extraFields extraFields to be input with location unit
 * @param {number} id location unit
 * @returns {void} return nothing
 */
export async function onSubmit(
  setSubmitting: (isSubmitting: boolean) => void,
  values: FormField,
  opensrpBaseURL: string,
  locationUnitgroup: LocationUnitGroup[],
  treedata: ParsedHierarchyNode[],
  username: string,
  extraFields?: ExtraField[],
  id?: string
) {
  const locationUnitGroupFiler = locationUnitgroup.filter((e) =>
    values.locationTags?.includes(e.id)
  );

  const locationTag: LocationUnitTag[] = locationUnitGroupFiler.map((tag: LocationUnitTag) => ({
    id: tag.id,
    name: tag.name,
  }));

  let geographicLevel = 0;
  if (values.parentId) {
    const parent = findParentGeoLocation(treedata, values.parentId);
    if (parent !== undefined) geographicLevel = parent + 1;
    else throw new Error(ERROR_OCCURED); // stops execution because this is unlikely thing to happen and shouldn't send error to server
  }

  const payload: (LocationUnitPayloadPOST | LocationUnitPayloadPUT) & {
    is_jurisdiction: true;
  } = {
    // eslint-disable-next-line @typescript-eslint/camelcase
    is_jurisdiction: true,
    properties: {
      geographicLevel: geographicLevel,
      username: username,
      externalId: values.externalId,
      parentId: values.parentId ? values.parentId : '',
      name: values.name,
      // eslint-disable-next-line @typescript-eslint/camelcase
      name_en: values.name,
      status: values.status,
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

  const serve = new OpenSRPService(LOCATION_UNIT_POST_PUT, opensrpBaseURL);
  if (id) {
    await serve
      .update({ ...payload })
      .then(() => {
        sendSuccessNotification(MESSAGE_LOCATION_UNIT_UPDATED);
        history.goBack();
      })
      .catch(() => sendErrorNotification(ERROR_OCCURED));
  } else {
    await serve
      .create({ ...payload })
      .then(() => {
        sendSuccessNotification(MESSAGE_LOCATION_UNIT_CREATED);
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

  return (
    <Formik
      initialValues={props.initialValue ? props.initialValue : defaultFormField}
      validationSchema={userSchema}
      onSubmit={(
        values: FormField,
        { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
      ) =>
        onSubmit(
          setSubmitting,
          values,
          props.opensrpBaseURL,
          props.locationUnitGroup,
          props.treedata,
          user.username,
          props.extraFields,
          props.id
        )
      }
    >
      {({ isSubmitting, handleSubmit }) => (
        <AntForm requiredMark={'optional'} {...layout} onSubmitCapture={handleSubmit}>
          <AntForm.Item label="Parent" name="parentId" required>
            <TreeSelect
              name="parentId"
              style={{ width: '100%' }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder={PLEASE_SELECT}
            >
              {parseHierarchyNode(props.treedata)}
            </TreeSelect>
          </AntForm.Item>

          <AntForm.Item name="name" label={NAME} required>
            <Input name="name" placeholder="Enter a location name" />
          </AntForm.Item>

          <AntForm.Item label={STATUS} name="status" valuePropName="checked" required>
            <Radio.Group name="status" defaultValue={props.initialValue?.status}>
              {status.map((e) => (
                <Radio name="status" key={e.label} value={e.value}>
                  {e.label}
                </Radio>
              ))}
            </Radio.Group>
          </AntForm.Item>

          <AntForm.Item name="type" label={TYPE} required>
            <Input name="type" placeholder={SELECT_TYPE} />
          </AntForm.Item>

          <AntForm.Item name="externalId" label={EXTERNAL_ID}>
            <Input name="externalId" placeholder={SELECT_STATUS} />
          </AntForm.Item>

          <AntForm.Item name="geometry" label={GEOMETRY}>
            <Input.TextArea name="geometry" rows={4} placeholder="</> JSON" />
          </AntForm.Item>

          <AntForm.Item label={UNIT_GROUP} name="locationTags">
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
            <SubmitButton id="submit">{isSubmitting ? SAVING : SAVE}</SubmitButton>
            <Button id="cancel" onClick={() => history.goBack()} type="dashed">
              {CANCEL}
            </Button>
          </AntForm.Item>
        </AntForm>
      )}
    </Formik>
  );
};

export default Form;
