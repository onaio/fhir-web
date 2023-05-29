import { RawAssignment } from '.';
import moment from 'moment';

export const processRawAssignments = (rawAssignments: RawAssignment[]) => {
  return rawAssignments.map((assignment) => {
    return {
      fromDate: moment(assignment.fromDate).format(),
      jurisdiction: assignment.jurisdictionId,
      organization: assignment.organizationId,
      plan: assignment.planId,
      toDate: moment(assignment.toDate).format(),
    };
  });
};
