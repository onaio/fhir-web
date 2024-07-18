import React from 'react';
import { Tag } from 'antd';
import { JobStatus } from '../helpers/utils';

export const ImportStatusTag = ({ statusString }: { statusString: JobStatus }) => {
  const tagStatusColor = getStatusColor(statusString);
  return <Tag color={tagStatusColor}>{statusString}</Tag>;
};

/**
 * @param statusString - get tag status color for a job status
 */
export function getStatusColor(statusString: JobStatus) {
  switch (statusString) {
    case 'completed':
      return 'success';
    case 'active':
      return 'processing';
    case 'failed':
      return 'error';
    case 'paused':
      return 'warning';
    default:
      return 'default';
  }
}
