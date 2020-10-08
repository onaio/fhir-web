import exportFunction from '..';
describe('/utils/Notifications', () => {
  it('render success notification', () => {
    const successOpen = jest.spyOn(exportFunction, 'sendSuccessNotification');
    exportFunction.sendSuccessNotification();
    expect(successOpen).toHaveBeenCalledTimes(1);
  });

  it('render info notification', () => {
    const infoOpen = jest.spyOn(exportFunction, 'sendInfoNotification');
    exportFunction.sendInfoNotification();
    expect(infoOpen).toHaveBeenCalledTimes(1);
  });

  it('render warning notification', () => {
    const warnOpen = jest.spyOn(exportFunction, 'sendWarningNotification');
    exportFunction.sendWarningNotification();
    expect(warnOpen).toHaveBeenCalledTimes(1);
  });

  it('render error notification', () => {
    const errorOpen = jest.spyOn(exportFunction, 'sendErrorNotification');
    exportFunction.sendErrorNotification();
    expect(errorOpen).toHaveBeenCalledTimes(1);
  });
});
