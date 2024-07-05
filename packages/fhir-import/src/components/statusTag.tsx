import React from 'react';
import { Tag } from 'antd';

export const ImportStatusTag = ({ statusString }: { statusString: JobStatus }) => {
    const tagStatusColor = getStatusColor(statusString)
    return (<Tag color={tagStatusColor}>
        {statusString}
    </Tag>)
}

type JobStatus =
    | 'completed'
    | 'waiting'
    | 'active'
    | 'delayed'
    | 'failed'
    | 'paused';

export function getStatusColor(statusString: JobStatus) {
    switch (statusString) {
        case "completed":
            return "success"
        case "active":
            return "processing"
        case "failed":
            return "error"
        case "paused":
            return "warning"
        default:
            return "default"
    }
}