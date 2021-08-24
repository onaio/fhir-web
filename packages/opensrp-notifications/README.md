# Notifications

The package contains utility functions for displaying notifications

## Installation

```sh
yarn add @opensrp-web/notifications
```

## Usage

The following available functions support different types of notifications:

`sendSuccessNotification`: Used to display a success popup

`sendInfoNotification`: Used to display an information popup

`sendWarningNotification`: Used to display a warning popup

`sendErrorNotification`: Used to display an error popup

Each of these methods accepts the following arguments:

1. `message`: **string**

This is the notification title and is required

2. `description`: **string**

This is the content of the notification. It's optional. A blank body will be displayed if it's not
provided.

### Code examples

```ts
/**
 * antd notification popup.
 *
 * @param {user} user details object
 */
export const openNotification = (user: User): void => {
  sendSuccessNotification(`Welcome back, ${user.username}`, 'You have 8 new messages');
};
```
