/** use for assigning organizations and jurisdictions in eusm assignments table */
import React, { useState } from 'react';
import { Button, Modal, Alert, Select } from 'antd';
import { useHandleBrokenPage } from '@opensrp/react-utils';
import lang from '../../lang';

/** describes how options should be formatted when passed to EditAssignment modals */
export interface SelectOption {
  key?: string;
  label: string;
  value: string;
}

export interface EditAssignmentsModalProps {
  saveHandler?: (selectedOptions: SelectOption | SelectOption[]) => Promise<void | Error>;
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
  invokeText: lang.EDIT_TEAMS,
  modalTitle: lang.EDIT_TEAMS,
  placeHolder: lang.SELECT,
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
    invokeText,
    modalTitle,
    placeHolder,
    disabled,
  } = props;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const { handleBrokenPage, broken, errorMessage } = useHandleBrokenPage();
  const [selectedOptions, setSelectedOptions] = useState<SelectOption | SelectOption[]>(
    existingOptions
  );

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

  const handleChange = (_: string[], options: SelectOption | SelectOption[]) =>
    setSelectedOptions(options);
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
        cancelText={lang.CANCEL}
        okText={lang.SAVE}
      >
        {broken ? (
          <Alert style={{ marginBottom: '8px' }} message={errorMessage} type="error" />
        ) : null}
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          placeholder={placeHolder}
          defaultValue={defaultValue}
          onChange={handleChange}
          options={options}
          showSearch={true}
          filterOption={optionFilter}
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
export const optionFilter = (input: string, option?: SelectOption) => {
  return option?.label.toLowerCase().includes(input.toLowerCase()) ?? false;
};
