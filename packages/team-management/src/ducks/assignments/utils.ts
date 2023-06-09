import { RawAssignment } from '.';
// import moment from 'moment';
import dayjs from 'dayjs';

export const processRawAssignments = (rawAssignments: RawAssignment[]) => {
  return rawAssignments.map((assignment) => {
    return {
      fromDate: dayjs(assignment.fromDate).format(),
      jurisdiction: assignment.jurisdictionId,
      organization: assignment.organizationId,
      plan: assignment.planId,
      toDate: dayjs(assignment.toDate).format(),
    };
  });
};
