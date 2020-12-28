import * as Yup from 'yup';
import React from 'react';
import { SubmitButton, Form as AntForm, Input, Radio, Select, TreeSelect } from 'formik-antd';
import { Button } from 'antd';
import { history } from '@onaio/connected-reducer-registry';
import { getUser } from '@onaio/session-reducer';
import { OpenSRPService } from '@opensrp/server-service';
import { getAccessToken } from '@onaio/session-reducer';
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
import { ERROR_OCCURED, LOCATION_HIERARCHY, LOCATION_UNIT_POST_PUT } from '../../constants';
import { v4 } from 'uuid';
import { LocationUnitGroup } from '../../ducks/location-unit-groups';
import { ParsedHierarchyNode, RawOpenSRPHierarchy } from '../../ducks/types';
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
  parentId: '',
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
  parentId: Yup.string().typeError('Parentid must be a String'),
  name: Yup.string().typeError('Name must be a String').required('Name is Required'),
  status: Yup.string().required('Status is Required'),
  type: Yup.string().typeError('Type must be a String').required('Type is Required'),
  externalId: Yup.string().typeError('External id must be a String'),
  locationTags: Yup.array().typeError('location Unit Groupss must be an Array'),
  geometry: Yup.string().typeError('location Unit Groups must be a An String'),
});
const layout = { labelCol: { span: 8 }, wrapperCol: { span: 11 } };
const offsetLayout = { wrapperCol: { offset: 8, span: 11 } };
const status = [
  { label: 'Active', value: LocationUnitStatus.ACTIVE },
  { label: 'Inactive', value: LocationUnitStatus.INACTIVE },
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

/**
 * Handle form submission
 *
 * @param {Function} setSubmitting method to set submission status
 * @param {Object} values the form fields
 * @param {string} accessToken api access token
 * @param {string} opensrpBaseURL - base url
 * @param {Array<LocationUnitGroup>} locationUnitgroup all locationUnitgroup
 * @param {string} username username of logged in user
 * @param {number} id location unit
 * @param {ExtraField} extraFields extraFields to be input with location unit
 */
export const onSubmit = async (
  setSubmitting: (isSubmitting: boolean) => void,
  values: FormField,
  accessToken: string,
  opensrpBaseURL: string,
  locationUnitgroup: LocationUnitGroup[],
  username: string,
  id?: string,
  extraFields?: ExtraField[]
) => {
  const locationUnitGroupFiler = locationUnitgroup.filter((e) =>
    (values.locationTags as number[]).includes(e.id)
  );

  const locationTag: LocationUnitTag[] = locationUnitGroupFiler.map((tag: LocationUnitTag) => ({
    id: tag.id,
    name: tag.name,
  }));

  let geographicLevel: number | undefined | void;
  if (values.parentId) {
    geographicLevel = await new OpenSRPService(accessToken, opensrpBaseURL, LOCATION_HIERARCHY)
      .read(values.parentId)
      .then((res: RawOpenSRPHierarchy) => {
        return res.locationsHierarchy.map[values.parentId as string].node.attributes
          .geographicLevel as number;
      })
      .catch(() => sendErrorNotification(ERROR_OCCURED));
  }

  const payload: (LocationUnitPayloadPOST | LocationUnitPayloadPUT) & {
    is_jurisdiction: true;
  } = {
    // eslint-disable-next-line @typescript-eslint/camelcase
    is_jurisdiction: true,
    properties: {
      geographicLevel: geographicLevel && geographicLevel >= 0 ? geographicLevel + 1 : 0,
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

  const serve = new OpenSRPService(accessToken, opensrpBaseURL, LOCATION_UNIT_POST_PUT);
  if (id) {
    await serve
      .update({ ...payload })
      .then(() => {
        sendSuccessNotification('Location Unit Updated successfully');
        setSubmitting(false);
        history.goBack();
      })
      .catch(() => {
        sendErrorNotification(ERROR_OCCURED);
        setSubmitting(false);
      });
  } else {
    await serve
      .create({ ...payload })
      .then(() => {
        sendSuccessNotification('Location Unit Created successfully');
        setSubmitting(false);
        history.goBack();
      })
      .catch(() => {
        sendErrorNotification(ERROR_OCCURED);
        setSubmitting(false);
      });
  }
};

export const Form: React.FC<Props> = (props: Props) => {
  const user = useSelector((state) => getUser(state));
  const accessToken = useSelector((state) => getAccessToken(state) as string);

  /** Function to parse the hierarchy tree into TreeSelect node format
   *
   * @param {Array<ParsedHierarchyNode>} hierarchyNode the tree node to parse
   * @returns {Array<React.ReactNode>} the parsed format of for Ant TreeSelect
   */
  function parseHierarchyNode(hierarchyNode: ParsedHierarchyNode[]): React.ReactNode[] {
    return hierarchyNode.map((node) => (
      <TreeSelect.TreeNode key={node.id} value={node.id} title={node.title}>
        {node.children ? parseHierarchyNode(node.children) : ''}
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
          accessToken,
          props.opensrpBaseURL,
          props.locationUnitGroup,
          user.username,
          props.id,
          props.extraFields
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
              placeholder="Please select"
            >
              {parseHierarchyNode(props.treedata)}
            </TreeSelect>
          </AntForm.Item>

          <AntForm.Item name="name" label="Name" required>
            <Input name="name" placeholder="Enter a location name" />
          </AntForm.Item>

          <AntForm.Item label="Status" name="status" valuePropName="checked" required>
            <Radio.Group name="status" defaultValue={props.initialValue?.status}>
              {status.map((e) => (
                <Radio name="status" key={e.label} value={e.value}>
                  {e.label}
                </Radio>
              ))}
            </Radio.Group>
          </AntForm.Item>

          <AntForm.Item name="type" label="Type" required>
            <Input name="type" placeholder="Select type" />
          </AntForm.Item>

          <AntForm.Item name="externalId" label="External ID">
            <Input name="externalId" placeholder="Select status" />
          </AntForm.Item>

          <AntForm.Item name="geometry" label="geometry">
            <Input.TextArea name="geometry" rows={4} placeholder="</> JSON" />
          </AntForm.Item>

          <AntForm.Item label="Unit Group" name="locationTags">
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
