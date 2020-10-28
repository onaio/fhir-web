/// <reference types="react" />
import { removeKeycloakUsers, fetchKeycloakUsers, KeycloakUser } from '../../../ducks/user';
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
