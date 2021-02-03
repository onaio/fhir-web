import { Select } from 'antd';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { sendErrorNotification } from '@opensrp/notifications';
import React from 'react';
import { Dictionary } from '@onaio/utils';
import { SelectProps } from 'antd/lib/select';
import { OptionData } from 'rc-select/lib/interface/';

type RawValueType = string | number | (string | number)[];

/** props for custom select component */
export interface CustomSelectProps<T = Dictionary> extends SelectProps<RawValueType> {
  loadData: (stateSetter: Dispatch<SetStateAction<T[]>>) => Promise<void>;
  getOptions: (data: T[]) => OptionData[];
  fullDataCallback?: (data: T[]) => void;
}

const defaultServiceTypeProps = {
  loadData: () => Promise.resolve(),
  getOptions: () => [],
};

/** custom select,  gets options from the api
 *
 * @param props - the component props
 */
function CustomSelect<T>(props: CustomSelectProps<T>) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<T[]>([]);
  const { loadData, getOptions, value, fullDataCallback, ...restProps } = props;

  useEffect(() => {
    loadData(setData)
      .catch((err) => sendErrorNotification(err.message))
      .finally(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const selected = data.filter((dt) => {
      const option = getOptions([dt])[0];
      return (Array.isArray(value) && value.includes(option.value)) || value === option.value;
    });
    fullDataCallback?.(selected);
  }, [data, fullDataCallback, getOptions, value]);

  const selectOptions = getOptions(data);

  const selectProps: SelectProps<RawValueType> = {
    ...restProps,
    options: selectOptions,
    loading,
    value,
  };

  return <Select {...selectProps}></Select>;
}

CustomSelect.defaultProps = defaultServiceTypeProps;

export { CustomSelect };
