import { OpenSRPService } from '@opensrp/server-service';
import { OPENSRP_URL_DOWNLOAD_REPORT } from '../../constants';
import { downloadFile } from '@opensrp/react-utils';

export const submitForm = async (
  districtId: string,
  period: string,
  accessToken: string,
  openSRPBaseURL: string
) => {
  const COMPOSED_DOWNLOAD_REPORT_URL = `${OPENSRP_URL_DOWNLOAD_REPORT}/${districtId}/${period}`;

  const serve = new OpenSRPService(accessToken, openSRPBaseURL, COMPOSED_DOWNLOAD_REPORT_URL);
  const blob = await serve.download();

  downloadFile(blob, `district_report_${period}.csv`);
};
