export interface WorkflowDescription {
  workflowId: string;
  status: JobStatus;
  workflowType: string;
  dateStarted: number;
  dateEnded: number;
  dateCreated: number;
  statusReason?: { stdout: string; stderr: string };
  filename: string;
  author: string;
}

export type JobStatus = 'completed' | 'waiting' | 'active' | 'delayed' | 'failed' | 'paused';

/**
 * @param timestamp - timestamp to format
 */
export function formatTimestamp(timestamp: number) {
  return new Date(timestamp).toLocaleString();
}
