import { notification } from 'antd';

/**
 * Antd notification success popup
 *
 * @param {string} message - title for popup notification
 * @param {string} description - Description for popup notification
 */
export function sendSuccessNotification(message: string, description?: string) {
  notification.success({
    message: message,
    description: description,
    duration: 2,
  });
}

/**
 * Antd notification info popup
 *
 * @param {string} message - title for popup notification
 * @param {string} description - Description for popup notification
 */
export const sendInfoNotification = (message: string, description?: string): void => {
  notification.info({
    message: message,
    description: description,
    duration: 2,
  });
};

/**
 * Antd notification warning popup
 *
 * @param {string} message - title for popup notification
 * @param {string} description - Description for popup notification
 */
export const sendWarningNotification = (message: string, description?: string): void => {
  notification.warning({
    message: message,
    description: description,
    duration: 2,
  });
};

/**
 * Antd notification error popup
 *
 * @param {string} message - title for popup notification
 * @param {string} description - Description for popup notification
 */
export const sendErrorNotification = (message: string, description?: string): void => {
  notification.error({
    message: message,
    description: description,
    duration: 2,
  });
};
