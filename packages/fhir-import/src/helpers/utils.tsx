export interface WorkflowDescription {
  "workflowId": string;
  "status": string;
  "workflowType": string;
  "dateStarted": number;
  "dateEnded": number;
  "dateCreated": number;
  "statusReason": any;
  filename: string;
}


export function formatTimestamp(timestamp: number, locale = 'en-US') {
  const date = new Date(timestamp);
  return date.toLocaleString(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}