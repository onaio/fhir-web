import { handleDownload, DownloadFile } from '../fileDownload';

const testData = JSON.stringify({
  name: 'Test file',
});

const content = JSON.parse(testData);
const blob = new Blob([content], { type: 'application/json' });

(global as any).URL.createObjectURL = jest.fn();
(global as any).URL.revokeObjectURL = jest.fn();

describe('fileDownload', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.documentElement.innerHTML = null;
  });

  it('should handle download', async () => {
    await handleDownload(testData, 'test-data.json');

    expect((global as any).URL.createObjectURL).toHaveBeenCalledTimes(1);
    expect((global as any).URL.createObjectURL).toHaveBeenCalledWith(blob);
  });

  it('should download file', () => {
    DownloadFile(blob, 'test-data.json');

    expect((global as any).URL.createObjectURL).toHaveBeenCalledTimes(1);
    expect((global as any).URL.createObjectURL).toHaveBeenCalledWith(blob);

    expect((global as any).URL.revokeObjectURL).toHaveBeenCalledTimes(1);

    expect(document.getElementsByTagName('a').length).toEqual(1);

    // find way to test actual download
  });
});
