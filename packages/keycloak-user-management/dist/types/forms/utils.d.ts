import { KeycloakUser } from '@opensrp/store';
import { Dictionary } from '@onaio/utils';
import { Dispatch, SetStateAction } from 'react';
import { KeycloakService } from '@opensrp/keycloak-service';
export declare const submitForm: (
  values: Partial<KeycloakUser>,
  accessToken: string,
  keycloakBaseURL: string,
  keycloakServiceClass: typeof KeycloakService,
  setIsSubmitting: Dispatch<SetStateAction<boolean>>,
  userId?: string | undefined
) => void;
/** interface user action */
export interface UserAction {
  alias: string;
  name: string;
  providerId: string;
  enabled: boolean;
  defaultAction: boolean;
  priority: number;
  config: Dictionary;
}
export declare const fetchRequiredActions: (
  accessToken: string,
  keycloakBaseURL: string,
  setUserActionOptions: Dispatch<SetStateAction<UserAction[]>>,
  keycloakServiceClass: typeof KeycloakService
) => void;
