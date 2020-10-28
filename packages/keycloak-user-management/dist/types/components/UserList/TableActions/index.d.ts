/// <reference types="react" />
import { KeycloakUser, removeKeycloakUsers } from '@opensrp/store';
/** interface for component props */
export interface Props {
  removeKeycloakUsersCreator: typeof removeKeycloakUsers;
  accessToken: string;
  keycloakBaseURL: string;
  record: KeycloakUser;
  isLoadingCallback: (loading: boolean) => void;
}
/**
 * Component TableActions
 *
 * @param {React.PropsTypes} props - component props
 * @returns {Element} - actions
 */
declare const TableActions: (props: Props) => JSX.Element;
export { TableActions };
