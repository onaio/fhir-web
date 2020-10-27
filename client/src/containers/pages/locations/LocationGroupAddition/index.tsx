import React from 'react';
import { Helmet } from 'react-helmet';
import { KeycloakUser, getKeycloakUsersArray, getAccessToken } from '@opensrp/store';
import { PropsTypes } from '@opensrp/user-management/dist/types';
import { Store } from 'redux';
import { connect } from 'react-redux';
import Form from './Form';

interface Props {
  keycloakUsers: KeycloakUser[];
  accessToken: string;
}

export const LocationUnitGroupAdd: React.FC<Props> = (props: Props) => {
  return (
    <section>
      <Helmet>
        <title>Add Location Unit Group</title>
      </Helmet>

      <h5 className="mb-3">Add Location Unit Group</h5>

      <div className="bg-white p-5">
        <Form keycloakUsers={props.keycloakUsers} accessToken={props.accessToken} />
      </div>
    </section>
  );
};

/** Interface for connected state to props */
interface DispatchedProps {
  keycloakUsers: KeycloakUser[];
  accessToken: string;
}

// connect to store
const mapStateToProps = (state: Partial<Store>, _: PropsTypes): DispatchedProps => {
  const keycloakUsers: KeycloakUser[] = getKeycloakUsersArray(state);
  const accessToken = getAccessToken(state) as string;
  return { keycloakUsers, accessToken };
};

/** map props to action creators */
const mapDispatchToProps = {};

export const ConnectedLocationUnitGroupAdd = connect(
  mapStateToProps,
  mapDispatchToProps
)(LocationUnitGroupAdd);
