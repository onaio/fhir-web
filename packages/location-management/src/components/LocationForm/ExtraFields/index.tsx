/** this component renders adhoc fields for arbitrary values in locationUnit.properties
 * we get the property names for the shown fields from the settings endpoint
 */
import { sendErrorNotification } from '@opensrp/notifications';
import { OpenSRPService } from '@opensrp/react-utils';
import { LOCATION_UNIT_EXTRA_FIELDS_IDENTIFIER } from '../../../constants';
import { loadSettings } from '../../../helpers/dataLoaders';
import React, { useEffect, useState } from 'react';
import { LocationSetting, validationRulesFactory } from '../utils';
import { Form, Input } from 'antd';
import { OPENSRP_API_BASE_URL } from '@opensrp/server-service';
import lang from '../../../lang';

const { List, Item: FormItem } = Form;

export interface ExtraFieldProps {
  baseURL: string;
  service: typeof OpenSRPService;
  disabled: boolean;
  hidden: boolean;
}

const defaultExtraFieldProps = {
  baseURL: OPENSRP_API_BASE_URL,
  service: OpenSRPService,
  disabled: false,
  hidden: false,
};

/** renders the extra fields form fields
 *
 * @param props - the components props
 */
const ExtraFields = (props: ExtraFieldProps) => {
  const { baseURL, service, disabled, hidden } = props;
  const [settings, setSettings] = useState<LocationSetting[]>([]);
  const validationRules = validationRulesFactory(lang);

  useEffect(() => {
    // fetch service type settings
    loadSettings(LOCATION_UNIT_EXTRA_FIELDS_IDENTIFIER, baseURL, service, setSettings)
      .catch((err) => sendErrorNotification(err.message))
      .finally(() => {
        // maybe add a loader on this section?
      });
  }, [baseURL, service]);

  return (
    <List name="extraFields">
      {(_) =>
        settings.map((setting, index) => {
          return (
            <FormItem
              key={setting.uuid}
              label={setting.label}
              name={[index, setting.label]}
              className="extra-fields"
              id={`extraFields-${index}`}
              rules={validationRules.extraFields}
              hidden={hidden}
            >
              <Input type="text" disabled={disabled} />
            </FormItem>
          );
        })
      }
    </List>
  );
};

ExtraFields.defaultProps = defaultExtraFieldProps;

export { ExtraFields };
