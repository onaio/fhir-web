import { getUser, isAuthenticated, getExtraData } from '@onaio/session-reducer';
import { connect } from 'react-redux';
import { Store } from 'redux';
import Sidebar from '../../components/page/Sidebar';

/** Connect the component to the store */

/** map state to props */
const mapStateToProps = (state: Partial<Store>) => {
  const result = {
    authenticated: isAuthenticated(state),
    user: getUser(state),
    extraData: getExtraData(state),
  };
  return result;
};

const mapDispatchToProps = {};

/** create connected component */

/** Connected Sidebar component
 */
const ConnectedSidebar = connect(mapStateToProps, mapDispatchToProps)(Sidebar);

export default ConnectedSidebar;
