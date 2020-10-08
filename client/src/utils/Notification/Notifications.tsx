import { notification } from 'antd';

/**
 * antd notification success popup
 * @param message - title for popup notification
 * @param description - Description for popup notification
 */
export function sendSuccessNotification(message?: string, description?: string) {
  notification.success({
    message: message,
    description: description,
  });
}

/**
 * antd notification info popup
 * @param message - title for popup notification
 * @param description - Description for popup notification
 */
export const sendInfoNotification = (message?: string, description?: string): void => {
  notification.info({
    message: message,
    description: description,
  });
};

/**
 * antd notification warning popup
 * @param message - title for popup notification
 * @param description - Description for popup notification
 */
export const sendWarningNotification = (message?: string, description?: string): void => {
  notification.warning({
    message: message,
    description: description,
  });
};

/**
 * antd notification error popup
 * @param message - title for popup notification
 * @param description - Description for popup notification
 */
export const sendErrorNotification = (message?: string, description?: string): void => {
  notification.error({
    message: message,
    description: description,
  });
};
