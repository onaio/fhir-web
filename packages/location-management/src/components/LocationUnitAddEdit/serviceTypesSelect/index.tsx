import { OpenSRPService } from '@opensrp/react-utils';
import { Select, SelectProps } from 'formik-antd';
import { loadSettings } from '../../../helpers/dataLoaders';
import { useEffect, useState } from 'react';
import { SERVICE_TYPES_SETTINGS_ID, SETTINGS_CONFIGURATION_TYPE } from '../../../constants';
import { sendErrorNotification } from '@opensrp/notifications';
import React from 'react';

export interface ServiceTypeSelectProps extends SelectProps {
  service: typeof OpenSRPService;
}

const defaultServiceTypeProps = {
  service: OpenSRPService,
};

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

const ServiceTypeSelect = (props: ServiceTypeSelectProps) => {
  const [loading, setLoading] = useState(true);
  const [settingsData, setSettingsData] = useState<ServiceTypesSetting[]>([]);

  useEffect(() => {
    // fetch service type settings
    loadSettings(SERVICE_TYPES_SETTINGS_ID, props.service, setSettingsData)
      .catch((err) => sendErrorNotification(err))
      .finally(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectOptions = settingsData.map((setting) => ({
    value: setting.label,
  }));

  const selectProps: SelectProps = {
    options: selectOptions,
    loading,
    ...props,
  };

  return <Select {...selectProps}></Select>;
};

ServiceTypeSelect.defaultProps = defaultServiceTypeProps;

export { ServiceTypeSelect };
