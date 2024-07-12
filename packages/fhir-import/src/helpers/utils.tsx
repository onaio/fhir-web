export interface WorkflowDescription {
  "workflowId": string;
  "status": string;
  "workflowType": string;
  "dateStarted": number;
  "dateEnded": number;
  "dateCreated": number;
  "statusReason"?: any;
  filename: string;
}

export function formatTimestamp(timestamp: number) {
  return new Date(timestamp).toLocaleString();
}
