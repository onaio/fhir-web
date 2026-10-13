import React from 'react';
import { List, Button } from 'antd';
import { BodyLayout } from '@opensrp/react-utils';

interface DraftListProps<T> {
  drafts: T[];
  getLabel: (item: T) => string;
  onEdit: (index: number) => void;
  onRemove: (index: number) => void;
}

export function DraftList<T>({ drafts, getLabel, onEdit, onRemove }: DraftListProps<T>) {
  if (drafts.length === 0) return null;

  const pageTitle = "Drafts";
    const headerProps = {
    pageHeaderProps: {
      title: pageTitle,
      onBack: undefined,
    },
  };

  return (
    <BodyLayout headerProps={headerProps}>
    <List
      dataSource={drafts}
      renderItem={(item, index) => (
        <List.Item
          actions={[
            <Button key="edit" type="link" onClick={() => onEdit(index)}>
              Edit
            </Button>,
            <Button key="remove" type="link" danger onClick={() => onRemove(index)}>
              Remove
            </Button>,
          ]}
        >
          {getLabel(item)}
        </List.Item>
      )}
    />
    </BodyLayout>
  );
}