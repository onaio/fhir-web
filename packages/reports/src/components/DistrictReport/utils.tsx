import { OpenSRPService } from '@opensrp/server-service';
import { OPENSRP_URL_DOWNLOAD_REPORT } from '../../constants';
import { downloadFile, getFileNameFromCDHHeader } from '@opensrp/react-utils';

export const submitForm = async (
  districtId: string,
  period: string,
  accessToken: string,
  openSRPBaseURL: string
) => {
  const COMPOSED_DOWNLOAD_REPORT_URL = `${OPENSRP_URL_DOWNLOAD_REPORT}/${districtId}/${period}`;

  const serve = new OpenSRPService(accessToken, openSRPBaseURL, COMPOSED_DOWNLOAD_REPORT_URL);
  const response = await serve.download();

  // get filename from content-disposition header
  const contentDispositionHeader = response.headers.get('content-disposition');
  const fileName = contentDispositionHeader
    ? getFileNameFromCDHHeader(contentDispositionHeader)
    : `district_report_${period}.xlsx`;

  // get blob data from response
  const blob = await response.blob();

  downloadFile(blob, fileName);
};
