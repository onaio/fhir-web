import flushPromises from 'flush-promises';
import { act } from 'react-dom/test-utils';
import { downloadFile } from '../utils';
/* eslint-disable @typescript-eslint/no-explicit-any */

const testData = JSON.stringify({
  name: 'Test file',
});

describe('helpers/utils/downloadFile', () => {
  (global as any).URL.createObjectURL = jest.fn();
  (global as any).URL.revokeObjectURL = jest.fn();
  const content = JSON.parse(testData);
  const blob = new Blob([content], { type: 'application/json' });

  afterEach(() => {
    (global as any).URL.createObjectURL.mockReset();
    (global as any).URL.revokeObjectURL.mockReset();
  });

  it('should download file', async () => {
    downloadFile(testData, 'sample-file', 'application/json');

    await act(async () => {
      await flushPromises();
    });

    expect((global as any).URL.createObjectURL).toHaveBeenCalledTimes(1);
    expect((global as any).URL.createObjectURL).toHaveBeenCalledWith(blob);
    expect((global as any).URL.revokeObjectURL).toHaveBeenCalledTimes(1);
  });

  it('it should download for IE browser', () => {
    (global as any).navigator.msSaveOrOpenBlob = jest.fn().mockReturnValue(1);

    (global as any).URL.createObjectURL.mockReset();
    (global as any).URL.revokeObjectURL.mockReset();
    (global as any).navigator.msSaveOrOpenBlob.mockReset();

    downloadFile(testData, 'sample-file', 'application/json');

    expect((global as any).URL.createObjectURL).not.toHaveBeenCalled();
    expect((global as any).navigator.msSaveOrOpenBlob).toHaveBeenCalledWith(blob, 'sample-file');
  });
});
