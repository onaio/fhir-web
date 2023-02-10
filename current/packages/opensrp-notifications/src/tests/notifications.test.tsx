import {
  sendInfoNotification,
  sendErrorNotification,
  sendSuccessNotification,
  sendWarningNotification,
} from '../notifications';
import { notification } from 'antd';

describe('notifcations/sendSuccessNotification', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const notificationSpy = jest.spyOn(notification, 'success');
  const message = 'success';
  const description = 'You profile was updated successfully';

  it('renders notification', () => {
    sendSuccessNotification(message, description);
    expect(notificationSpy).toHaveBeenCalledWith({
      message,
      duration: 2,
      description,
    });
  });

  it('renders if description is not provided', () => {
    sendSuccessNotification(message);
    expect(notificationSpy).toHaveBeenCalledWith({
      message,
      duration: 2,
      description: undefined,
    });
  });
});

describe('notifications/sendErrorNotification', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const notificationSpy = jest.spyOn(notification, 'error');
  const message = 'An error occurred';
  const description = 'The task failed successfully. We are not in hurry to fix it';

  it('renders notification', () => {
    sendErrorNotification(message, description);
    expect(notificationSpy).toHaveBeenCalledWith({
      message,
      duration: 2,
      description,
    });
  });

  it('renders if description is not provided', () => {
    sendErrorNotification(message);
    expect(notificationSpy).toHaveBeenCalledWith({
      message,
      duration: 2,
      description: undefined,
    });
  });
});

describe('notifications/sendInfoNotification', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const notificationSpy = jest.spyOn(notification, 'info');
  const message = 'Privacy violation';
  const description = 'We are seriously collecting your data';

  it('renders notification', () => {
    sendInfoNotification(message, description);
    expect(notificationSpy).toHaveBeenCalledWith({
      message,
      duration: 2,
      description,
    });
  });

  it('renders if description is not provided', () => {
    sendInfoNotification(message);
    expect(notificationSpy).toHaveBeenCalledWith({
      message,
      duration: 2,
      description: undefined,
    });
  });
});

describe('notifications/sendWarningNotification', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const notificationSpy = jest.spyOn(notification, 'warning');
  const message = 'Renew your subscription';
  const description = 'Certain services will be unavailable if you do not renew';

  it('renders notification', () => {
    sendWarningNotification(message, description);
    expect(notificationSpy).toHaveBeenCalledWith({
      message,
      duration: 2,
      description,
    });
  });

  it('renders if description is not provided', () => {
    sendWarningNotification(message);
    expect(notificationSpy).toHaveBeenCalledWith({
      message,
      duration: 2,
      description: undefined,
    });
  });
});
