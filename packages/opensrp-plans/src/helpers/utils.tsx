import { Dictionary } from '@onaio/utils';
import { InterventionType, PlanDefinition, UseContext } from '@opensrp/plan-form-core';
import { Spin } from 'antd';
import React from 'react';
import { OPENSRP_TASK_EXPORT_DATA } from '../constants';
import {
  FLAG_PROBLEM_CODE,
  LOOKS_GOOD_CODE,
  SERVICE_POINT_CHECK_CODE,
  RECORD_GPS_CODE,
} from '@opensrp/plan-form-core';
import { HTTPMethod } from '@opensrp/server-service';
import { getFileNameFromCDHHeader, downloadFile } from '@opensrp/react-utils';
import { OpenSRPService } from './dataLoaders';

/**
 * helper to retrieve the plan Type from a plan definition object
 *
 * @param {PlanDefinition} aPlan plan definition object
 * @returns {string} plans intervention type eg FI
 */
export const getPlanType = (aPlan: PlanDefinition) => {
  return aPlan.useContext
    .filter((f: UseContext) => f.code === 'interventionType')
    .map((context) => context.valueCodableConcept)[0];
};

/**
 * Sorts plans in descending order based on field provided
 *
 * @param {PlanDefinition[]} arr plan definition array
 * @param {string} sortField Field to sort by
 * @returns {PlanDefinition[]}  sorted plans
 */
export function descendingOrderSort<T extends object>(arr: T[], sortField: string) {
  const mutableArray = ([] as T[]).concat(arr);
  // check if the provided field exists in the plans else return plansArray
  if (arr.every((plan: Dictionary) => Object.keys(plan).includes(sortField))) {
    return mutableArray.sort((firstEl: Dictionary, secondEl: Dictionary): number => {
      return Date.parse(secondEl[sortField]) - Date.parse(firstEl[sortField]);
    }) as PlanDefinition[];
  }
  return arr;
}

/**
 * a util to check if plan of type PlanDefinition is of the specified intervention type(s)
 *
 * @param {PlanDefinition} plan - the plan of interest
 * @param {InterventionType} interventionType if plan is of specified intervention type we return true
 * @returns {boolean} Returns true if plan is of specified intervention type else returns false
 */
export const isPlanDefinitionOfType = (
  plan: PlanDefinition,
  interventionType: InterventionType | InterventionType[]
) => {
  // if plan intervention is in intervention Types
  const allowedTypes = Array.isArray(interventionType) ? interventionType : [interventionType];
  const plansType = getPlanType(plan);
  return allowedTypes.includes(plansType as InterventionType);
};

/** util component shown when there is a pending promise */
export const PlanLoading = () => {
  return <Spin size="large" className="custom-spinner"></Spin>;
};

const getFetchOptions = (_: AbortSignal, accessToken: string, method: HTTPMethod): RequestInit => {
  return {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
    method,
  };
};

/**
 * download a misisons data.
 *
 * @param baseURL - opensrp server base url
 * @param plan - plan whose mission data we fetching.
 */
export const downloadMissionData = async (baseURL: string, plan: PlanDefinition) => {
  const { title, identifier } = plan;
  const fileTitle = title.replaceAll(/\\s/g, ' ').split(' ').join('_');
  const eventType = `${FLAG_PROBLEM_CODE},${SERVICE_POINT_CHECK_CODE},${LOOKS_GOOD_CODE},${RECORD_GPS_CODE}`;
  const exportPath = `${OPENSRP_TASK_EXPORT_DATA}?eventTypes=${eventType}&planIdentifier=${identifier}`;

  const serve = new OpenSRPService(exportPath, baseURL, getFetchOptions);
  const response = await serve.download();

  // get filename from content-disposition header
  const contentDispositionHeader = response.headers.get('content-disposition');
  const fileName = contentDispositionHeader
    ? getFileNameFromCDHHeader(contentDispositionHeader)
    : `${fileTitle}_${Date.now()}.zip`;

  // get blob data from response
  const blob = await response.blob();

  downloadFile(blob, fileName);
};
