/** use for assigning organizations and jurisdictions in eusm assignments table */
import React, { useState } from 'react';
import { Button, Modal, Alert, Select } from 'antd';
import { useHandleBrokenPage } from '@opensrp/react-utils';
import { useTranslation } from '../../mls';
import { SelectProps } from 'rc-select/lib/generate';
import { Dictionary } from '@onaio/utils';

/** describes how options should be formatted when passed to EditAssignment modals */
export interface SelectOption {
  key?: string;
  label: string;
  value: string;
}

export interface EditAssignmentsModalProps {
  saveHandler?: (selectedOptions: SelectOption[]) => Promise<void | Error>;
  cancelHandler?: () => void;
  existingOptions: SelectOption[];
  options: SelectOption[];
  invokeText: string;
  modalTitle: string;
  placeHolder: string;
  disabled: boolean;
}

const defaultProps = {
  existingOptions: [],
  options: [],
  invokeText: 'Edit teams',
  modalTitle: 'Edit teams',
  placeHolder: 'Select',
  disabled: false,
};

/** Modal component used for either locations or teams assignments
 *
 * @param {object} props - props
 * @returns {Element} -
 */
function EditAssignmentsModal(props: EditAssignmentsModalProps) {
  const {
    saveHandler,
    cancelHandler,
    existingOptions,
    options,
    invokeText: invokeTextRaw,
    modalTitle: modalTitleRaw,
    placeHolder: placeholderRaw,
    disabled,
  } = props;
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const { handleBrokenPage, broken, errorMessage } = useHandleBrokenPage();
  const [selectedOptions, setSelectedOptions] = useState<SelectOption[]>(existingOptions);
  const invokeText = invokeTextRaw ? invokeTextRaw : t('Edit teams');
  const modalTitle = modalTitleRaw ? modalTitleRaw : t('Edit teams');
  const placeholder = placeholderRaw ? placeholderRaw : t('Select');
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setConfirmLoading(true);
    if (saveHandler) {
      saveHandler(selectedOptions)
        .then(() => {
          setIsModalVisible(false);
          setConfirmLoading(false);
        })
        .catch((e) => {
          handleBrokenPage(e);
        });
    }
  };

  const handleCancel = () => {
    if (cancelHandler) {
      cancelHandler();
    }
    setIsModalVisible(false);
  };

  const handleChange = (_: string[], options: SelectOption[]) => setSelectedOptions(options);
  const defaultValue = existingOptions.map((option) => option.value);

  return (
    <>
      <Button className="assign-modal" type="link" disabled={disabled} onClick={showModal}>
        {invokeText}
      </Button>
      <Modal
        title={modalTitle}
        visible={isModalVisible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        cancelText={t('Cancel')}
        okText={t('Save')}
      >
        {broken ? (
          <Alert style={{ marginBottom: '8px' }} message={errorMessage} type="error" />
        ) : null}
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          placeholder={placeholder}
          defaultValue={defaultValue}
          onChange={handleChange as SelectProps<Dictionary[], string[]>['onChange']}
          options={options}
          showSearch={true}
          filterOption={optionFilter as SelectProps<Dictionary[], string[]>['filterOption']}
        />
      </Modal>
    </>
  );
}

EditAssignmentsModal.defaultProps = defaultProps;

export { EditAssignmentsModal };

/** filters what options to show depending on the string input
 *
 * @param input - the string input
 * @param option - a single option
 */
export const optionFilter = (input: string, option: SelectOption) => {
  return option.label.toLowerCase().includes(input.toLowerCase());
};
