import { parseTextResponse, parseSingleErrorRow, uploadCSV } from '../dataLoaders';
import axios from 'axios';
import flushPromises from 'flush-promises';

jest.mock('axios');

/** test upload csv function */
describe('helpers/dataLoader.uploadCSV', () => {
  it('works nominally', async () => {
    const mockFile = new File([], 'sample.csv');
    const sampleResponse = {
      data: {
        rowCount: 5,
      },
    };
    (axios.post as jest.Mock).mockImplementationOnce(() => Promise.resolve(sampleResponse));
    uploadCSV(mockFile)
      .then((response) => {
        expect(response).toEqual({ rowCount: 5 });
      })
      .catch((_) => {
        fail();
      });
    await flushPromises();
  });

  it('works with bad request errors', async () => {
    const mockFile = new File([], 'sample.csv');
    const error = new Error('Error');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (error as any).response = {
      status: 400,
      data: '',
    };
    (axios.post as jest.Mock).mockImplementationOnce(() => Promise.reject(error));
    const badRequestMock = jest.fn();
    uploadCSV(mockFile, undefined, undefined, undefined, badRequestMock).catch((_) => {
      fail();
    });
    await flushPromises();
    expect(badRequestMock).toHaveBeenCalledWith({
      errors: [],
      rowsNumber: '0',
      rowsProcessed: '0',
    });
  });

  it('throws other errors', async () => {
    const mockFile = new File([], 'sample.csv');
    const error = new Error('Error');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (error as any).response = {
      status: 500,
      data: '',
    };
    (axios.post as jest.Mock).mockImplementationOnce(() => Promise.reject(error));
    const badRequestMock = jest.fn();
    uploadCSV(mockFile, undefined, undefined, undefined, badRequestMock).catch((err) => {
      expect(err.message).toEqual('Error');
    });
    await flushPromises();
  });

  it('handles request cancellation by user', async () => {
    const mockFile = new File([], 'sample.csv');
    const error = new Error('Error');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (error as any).response = {
      status: 500,
      data: '',
    };
    (axios.post as jest.Mock).mockImplementationOnce(() => Promise.reject(error));
    (axios.isCancel as jest.Mock).mockImplementationOnce(() => true);
    const requestCancelMock = jest.fn();
    uploadCSV(
      mockFile,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      requestCancelMock
    ).catch((err) => {
      expect(err.message).toEqual('Error');
    });
    await flushPromises();
    expect(requestCancelMock).toHaveBeenCalled();
  });
});

/** test upload csv function */
describe('helpers/dataLoader.parseBadResponseError', () => {
  it('parses single row data', () => {
    const sample =
      '1,"[Product ID does not exist in product catalogue, Service point ID does not exist, Donor is not valid, PO Number should be a whole number]"';
    const res = parseSingleErrorRow(sample);
    expect(res).toEqual({
      failureReason:
        'Product ID does not exist in product catalogue, Service point ID does not exist, Donor is not valid, PO Number should be a whole number',
      row: '1',
    });
  });

  it('parses full data correctly', () => {
    const sampleResponse =
      '"Total Number of Rows in the CSV ",3\r\n"Rows processed ",0\r\n"\n"\r\nRow Number,Reason of Failure\r\n1,"[Product ID does not exist in product catalogue, Service point ID does not exist, Donor is not valid, PO Number should be a whole number]"\r\n2,[Service point ID does not exist]\r\n3,"[Service point ID does not exist, UNICEF section is not valid, Donor is not valid]"\r\n';
    const result = parseTextResponse(sampleResponse);
    expect(result).toEqual({
      errors: [
        {
          failureReason:
            'Product ID does not exist in product catalogue, Service point ID does not exist, Donor is not valid, PO Number should be a whole number',
          row: '1',
        },
        { failureReason: 'Service point ID does not exist', row: '2' },
        {
          failureReason:
            'Service point ID does not exist, UNICEF section is not valid, Donor is not valid',
          row: '3',
        },
        { failureReason: '', row: '' },
      ],
      rowsNumber: '3',
      rowsProcessed: '0',
    });
  });
});
