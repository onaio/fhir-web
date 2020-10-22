/// <reference types="react" />
import { fetchKeycloakUsers, KeycloakUser, removeKeycloakUsers } from '@opensrp/store';
/** interface for component props */
export interface Props {
  fetchKeycloakUsersCreator: typeof fetchKeycloakUsers;
  removeKeycloakUsersCreator: typeof removeKeycloakUsers;
  accessToken: string;
  keycloakBaseURL: string;
  record: KeycloakUser;
}
/**
 * Component TableActions
 *
 * @param {React.PropsTypes} props - component props
 * @returns {Element} - actions
 */
declare const TableActions: (props: Props) => JSX.Element;
export { TableActions };
