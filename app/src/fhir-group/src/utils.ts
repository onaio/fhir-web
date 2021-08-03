// import FHIR from 'fhirclient';
import { Groups, GroupDetail } from '.';

/**
 * Function to load selected group for details
 *
 * @param {TableData} row data selected from the table
 */
export async function loadGroupDetails(props: {
  group: Groups;
  fhirBaseURL: string;
}): Promise<GroupDetail> {
  const { group } = props;
  //   const serve = FHIR.client(fhirBaseURL);

  return { ...group };
}
