import React, { useState } from 'react';
import { Alert, Button, Space, message } from 'antd';
import { useDraftStore } from '../Drafts/useDraftStore';
import { DraftList } from '../Drafts/draftList';
import type { StepConfig } from '../../types';
import { v4 } from 'uuid';

interface StepPanelProps {
  stepConfig: StepConfig;
  commonProps: Record<string, unknown>;
  onNext: (drafts: unknown[]) => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  submitting: boolean;
}

export const StepPanel: React.FC<StepPanelProps> = ({
  stepConfig,
  commonProps,
  onNext,
  onBack,
  isFirstStep,
  isLastStep,
  submitting,
}) => {
  const { drafts, addDraft, removeDraft } = useDraftStore<unknown>(stepConfig.key);
  const [editIndex, setEditIndex] = useState<number | undefined>(undefined);
  const StepComponent = stepConfig.component;

const handleAddToDraft = (values: unknown): boolean => {
  const problem = stepConfig.findDuplicate?.(values as Record<string, unknown>, drafts, editIndex);
  if (problem) {
    message.error(problem);
    return false; // tells the form to keep what was typed
  }
  const existingId =
    editIndex !== undefined ? (drafts[editIndex] as { draftId?: string })?.draftId : undefined;
  addDraft({ ...(values as object), draftId: existingId ?? v4() }, editIndex);
  setEditIndex(undefined);
  return true;
};

  return (
    <div>
      {editIndex !== undefined && (
        <Alert
          type="info"
          showIcon
          style={{ margin: '0 1rem 0.5rem' }}
          message="You are editing a draft. Add to Draft will replace it."
          action={
            <Button size="small" onClick={() => setEditIndex(undefined)}>
              Cancel edit
            </Button>
          }
        />
      )}
      <StepComponent
        key={editIndex ?? 'new'}
        initialValues={editIndex !== undefined ? drafts[editIndex] : undefined}
        onSubmit={handleAddToDraft}
        {...commonProps}
      />

      <DraftList
        drafts={drafts}
        getLabel={(item: any) => item?.name ?? item?.username ?? 'Untitled'}
        onEdit={setEditIndex}
        onRemove={removeDraft}
      />

      <Space style={{ padding: '0rem 0rem 0.6rem 1rem' }}>
        <Button onClick={onBack} disabled={isFirstStep}>
          Back
        </Button>
        <Button
          type="primary"
          loading={submitting}
          disabled={drafts.length === 0}
          onClick={() => onNext(drafts)}
        >
          {isLastStep ? 'Finish' : 'Next'}
        </Button>
      </Space>
    </div>
  );
};
