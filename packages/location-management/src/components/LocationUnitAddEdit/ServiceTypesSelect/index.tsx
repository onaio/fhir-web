import { OpenSRPService } from '@opensrp/react-utils';
import { Select, SelectProps } from 'formik-antd';
import { loadSettings } from '../../../helpers/dataLoaders';
import { useEffect, useState } from 'react';
import {
  baseURL,
  SERVICE_TYPES_SETTINGS_ID,
  SETTINGS_CONFIGURATION_TYPE,
} from '../../../constants';
import { sendErrorNotification } from '@opensrp/notifications';
import React from 'react';

/** props for service types select component */
export interface ServiceTypeSelectProps extends SelectProps {
  service: typeof OpenSRPService;
  baseURL: string;
}

const defaultServiceTypeProps = {
  service: OpenSRPService,
  baseURL: baseURL,
};

/** describes a single settings object as received from settings api */
export interface ServiceTypesSetting {
  key: string;
  label: string;
  description: string;
  uuid: string;
  settingsId: string;
  settingIdentifier: typeof SERVICE_TYPES_SETTINGS_ID;
  settingMetadataId: string;
  v1Settings: false;
  resolveSettings: false;
  documentId: string;
  serverVersion: number;
  type: typeof SETTINGS_CONFIGURATION_TYPE;
}

/** Service type select components, gets options from the api
 *
 * @param props - the component props
 */
const ServiceTypeSelect = (props: ServiceTypeSelectProps) => {
  const [loading, setLoading] = useState(true);
  const [settingsData, setSettingsData] = useState<ServiceTypesSetting[]>([]);
  const { baseURL, service, ...restProps } = props;

  useEffect(() => {
    // fetch service type settings
    loadSettings(SERVICE_TYPES_SETTINGS_ID, baseURL, service, setSettingsData)
      .catch((err) => sendErrorNotification(err.message))
      .finally(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectOptions = settingsData.map((setting) => ({
    value: setting.label,
  }));

  const selectProps: SelectProps = {
    ...restProps,
    options: selectOptions,
    loading,
  };

  return <Select {...selectProps}></Select>;
};

ServiceTypeSelect.defaultProps = defaultServiceTypeProps;

export { ServiceTypeSelect };
