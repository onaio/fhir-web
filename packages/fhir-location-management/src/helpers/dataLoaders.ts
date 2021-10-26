/* eslint-disable @typescript-eslint/camelcase */
import { ACTIVE } from '../constants';

/** Abstract 2 functions; get jurisdiction at any geo-level, get hierarchy */

/** URL params for load jurisdiction request */
export interface GetLocationParams {
  is_jurisdiction?: boolean;
  return_geometry?: boolean;
  properties_filter?: string;
}

export const defaultGetLocationParams: GetLocationParams = {
  is_jurisdiction: true,
  return_geometry: false,
};

/** filter params to be added as value of properties_filter url param */
export interface ParamFilters {
  status?: string;
  geographicLevel?: number;
}

export const defaultParamFilters: ParamFilters = {
  status: ACTIVE,
};

export const defaultSettingsParams = {
  serverVersion: '0',
};

export const defaultPostLocationParams = {
  is_jurisdiction: true,
};
