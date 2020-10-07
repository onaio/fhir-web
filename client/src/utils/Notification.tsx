import { notification } from 'antd';

export const sendSuccessNotification = (message?: string, description?: string): void => {
  notification.success({
    message: message,
    description: description,
  });
};

export const sendInfoNotification = (message?: string, description?: string): void => {
  notification.info({
    message: message,
    description: description,
  });
};

export const sendWarningNotification = (message?: string, description?: string): void => {
  notification.warning({
    message: message,
    description: description,
  });
};

export const sendErrorNotification = (message?: string, description?: string): void => {
  notification.error({
    message: message,
    description: description,
  });
};
