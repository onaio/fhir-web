import { getUser, isAuthenticated, logOutUser, getExtraData } from '@onaio/session-reducer';
import { connect } from 'react-redux';
import { Store } from 'redux';
import Header from '../../components/page/Header';

/** Connect the component to the store */

/** map state to props
 *
 * @param {Partial<Store>} state - the redux store
 * @returns {Object} - the states
 */
const mapStateToProps = (state: Partial<Store>) => {
  const result = {
    authenticated: isAuthenticated(state),
    user: getUser(state),
    extraData: getExtraData(state),
  };
  return result;
};

const mapDispatchToProps = { logOutUser };

/** create connected component */

/** Connected Header component
 */
const ConnectedHeader = connect(mapStateToProps, mapDispatchToProps)(Header);

export default ConnectedHeader;
