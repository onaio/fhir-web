import React from 'react';
import { Helmet } from 'react-helmet';
import { getAccessToken } from '@onaio/session-reducer';
import { Store } from 'redux';
import { connect } from 'react-redux';
import Form from './Form';

interface Props {
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
        <Form accessToken={props.accessToken} />
      </div>
    </section>
  );
};

/** Interface for connected state to props */
interface DispatchedProps {
  accessToken: string;
}

// connect to store
const mapStateToProps = (state: Partial<Store>): DispatchedProps => {
  const accessToken = getAccessToken(state) as string;
  return { accessToken };
};

/** map props to action creators */
const mapDispatchToProps = {};

export const ConnectedLocationUnitGroupAdd = connect(
  mapStateToProps,
  mapDispatchToProps
)(LocationUnitGroupAdd);
