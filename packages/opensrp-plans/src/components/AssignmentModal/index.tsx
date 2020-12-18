/** use for assigning organizations and jurisdictions in eusm assignments table */
import React, { useState } from 'react';
import { Button, Modal, Alert, Select } from 'antd';
import { useHandleBrokenPage } from '@opensrp/react-utils';
import { CANCEL, EDIT_TEAMS, SAVE, SELECT } from '../../lang';
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
  invokeText: EDIT_TEAMS,
  modalTitle: EDIT_TEAMS,
  placeHolder: SELECT,
  disabled: false,
};

/** Modal component used for either locations or teams assignments
 *
 * @param props - props
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
  const [selectedOptions, setSelectedOptions] = useState<SelectOption[]>(existingOptions);

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
        cancelText={CANCEL}
        okText={SAVE}
      >
        {broken ? (
          <Alert style={{ marginBottom: '8px' }} message={errorMessage} type="error" />
        ) : null}
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          placeholder={placeHolder}
          defaultValue={defaultValue}
          onChange={handleChange as SelectProps<Dictionary[], string[]>['onChange']}
          options={options}
        />
      </Modal>
    </>
  );
}

EditAssignmentsModal.defaultProps = defaultProps;

export { EditAssignmentsModal };
