import exportFunction from '..';
describe('/utils/Notifications', () => {
  it('render success notification', () => {
    const successOpen = jest.spyOn(exportFunction, 'sendSuccessNotification');
    exportFunction.sendSuccessNotification('success');
    expect(successOpen).toHaveBeenCalledTimes(1);
  });

  it('render info notification', () => {
    const infoOpen = jest.spyOn(exportFunction, 'sendInfoNotification');
    exportFunction.sendInfoNotification('info');
    expect(infoOpen).toHaveBeenCalledTimes(1);
  });

  it('render warning notification', () => {
    const warnOpen = jest.spyOn(exportFunction, 'sendWarningNotification');
    exportFunction.sendWarningNotification('warning');
    expect(warnOpen).toHaveBeenCalledTimes(1);
  });

  it('render error notification', () => {
    const errorOpen = jest.spyOn(exportFunction, 'sendErrorNotification');
    exportFunction.sendErrorNotification('error');
    expect(errorOpen).toHaveBeenCalledTimes(1);
  });
});
