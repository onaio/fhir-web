import React from 'react';
import { Form } from 'antd';
import { Rule } from 'antd/lib/form';
import { PRODUCT, SELECT } from '../../../lang';
import { ConnectedProductSelect, OptionValueProperty } from '../ProductSelect';
import { OpenSRPService } from '../../../helpers/dataLoaders';

/** interaface for component props **/
export interface ControlledProductSelectProps {
  openSRPBaseURL: string;
  name: string;
  id: string;
  openSRPService: typeof OpenSRPService;
  optionValueProperty: OptionValueProperty;
  rules?: Rule[];
  label?: string;
  placeHolder?: string;
}

export const defaultControlledProductSelectProps: ControlledProductSelectProps = {
  openSRPBaseURL: '',
  name: '',
  id: '',
  label: PRODUCT,
  placeHolder: SELECT,
  openSRPService: OpenSRPService,
  rules: [],
  optionValueProperty: 'productName',
};

const ControlledProductSelect: React.FC<ControlledProductSelectProps> = (
  props: ControlledProductSelectProps
) => {
  const {
    name,
    id,
    label,
    rules,
    openSRPBaseURL,
    placeHolder,
    openSRPService,
    optionValueProperty,
  } = props;
  const productSelectProps = {
    openSRPBaseURL,
    placeHolder,
    openSRPService,
    optionValueProperty,
  };

  return (
    <Form.Item name={name} id={id} label={label} rules={rules}>
      <ConnectedProductSelect {...productSelectProps} />
    </Form.Item>
  );
};

ControlledProductSelect.defaultProps = defaultControlledProductSelectProps;

export { ControlledProductSelect };
