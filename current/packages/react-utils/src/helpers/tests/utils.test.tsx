import { getResourcesFromBundle } from '../utils';
import { careTeams } from './fixtures';
import { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';
import { downloadFile, getFileNameFromCDHHeader } from '../utils';

jest.mock('@opensrp/pkg-config', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/pkg-config')),
}));

test('getResourceFromBundle', () => {
  const response = getResourcesFromBundle<Record<string, unknown>>(careTeams as IBundle);
  expect(response).toHaveLength(6);
  expect(response.map((x) => x.id)).toEqual(['308', '325', '327', '330', '328', '326']);
});

describe('helpers/utils/downloadFile', () => {
  const testData = JSON.stringify({
    name: 'Test file',
  });

  /* eslint-disable @typescript-eslint/no-explicit-any */
  (global as any).URL.createObjectURL = jest.fn();
  (global as any).URL.revokeObjectURL = jest.fn();
  const content = JSON.parse(testData);
  const blob = new Blob([content], { type: 'application/json' });

  afterEach(() => {
    (global as any).URL.createObjectURL.mockReset();
    (global as any).URL.revokeObjectURL.mockReset();
  });

  it('should download file', (done) => {
    downloadFile(testData, 'sample-file', 'application/json');

    expect((global as any).URL.createObjectURL).toHaveBeenCalledTimes(1);
    expect((global as any).URL.createObjectURL).toHaveBeenCalledWith(blob);
    setTimeout(() => {
      expect((global as any).URL.revokeObjectURL).toHaveBeenCalledTimes(1);
      done();
    }, 200);
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

describe('helpers/utils/getFileNameFromCDHHeader', () => {
  it('should return file name from CDH headers', () => {
    const CDHeader1 = 'attachment; filename=test.pdf';
    const CDHeader2 = 'attachment;filename=test.csv';
    const CDHeader3 = 'attachment; filename=test.xhtml;some-other-value';
    expect(getFileNameFromCDHHeader(CDHeader1)).toEqual('test.pdf');
    expect(getFileNameFromCDHHeader(CDHeader2)).toEqual('test.csv');
    expect(getFileNameFromCDHHeader(CDHeader3)).toEqual('test.xhtml');
  });
});
