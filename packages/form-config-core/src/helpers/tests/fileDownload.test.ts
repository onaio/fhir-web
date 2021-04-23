import { handleDownload, DownloadFile } from '../fileDownload';

const testData = JSON.stringify({
  name: 'Test file',
});

const content = JSON.parse(testData);
const blob = new Blob([content], { type: 'application/json' });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).URL.createObjectURL = jest.fn();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).URL.revokeObjectURL = jest.fn();

describe('fileDownload', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.documentElement.innerHTML = null;
  });

  it('should handle download', async () => {
    handleDownload(testData, 'test-data.json');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((global as any).URL.createObjectURL).toHaveBeenCalledTimes(1);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((global as any).URL.createObjectURL).toHaveBeenCalledWith(blob);
  });

  it('should download file', () => {
    DownloadFile(blob, 'test-data.json');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((global as any).URL.createObjectURL).toHaveBeenCalledTimes(1);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((global as any).URL.createObjectURL).toHaveBeenCalledWith(blob);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((global as any).URL.revokeObjectURL).toHaveBeenCalledTimes(1);

    expect(document.getElementsByTagName('a')).toHaveLength(1);

    // find way to test actual download
  });
});
