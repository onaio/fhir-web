// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { User } from '@onaio/session-reducer';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Menu, Layout } from 'antd';
import './Header.css';
import { Link } from 'react-router-dom';

const SubMenu = Menu.SubMenu;
/** interface for Header state */
interface State {
  isOpen: boolean;
}

/** interface for HeaderProps */
export interface HeaderProps extends RouteComponentProps {
  authenticated: boolean;
  user: User;
}

/** default props for Header */
const defaultHeaderProps: Partial<HeaderProps> = {
  authenticated: false,
  user: {
    email: '',
    name: '',
    username: '',
  },
};

/** The Header component */
export class HeaderComponent extends React.Component<HeaderProps, State> {
  public static defaultProps = defaultHeaderProps;

  constructor(props: HeaderProps) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
    };
  }

  public render(): JSX.Element {
    const { authenticated, user } = this.props;
    const path = this.props.location.pathname;
    return (
      <div>
        <Layout.Header>
          <div className="logo" />
          <Menu mode="horizontal" selectedKeys={[path]}>
            <Menu.Item key="/">Home</Menu.Item>
            {authenticated ? (
              <SubMenu title={`${user.username}`} style={{ float: 'right' }}>
                <Menu.Item key="/logout">
                  <Link to="/logout">Logout</Link>
                </Menu.Item>
              </SubMenu>
            ) : (
              <Menu.Item key="/login" style={{ float: 'right' }}>
                <Link to="/login">Login</Link>
              </Menu.Item>
            )}
          </Menu>
        </Layout.Header>
      </div>
    );
  }

  private toggle() {
    this.setState({ isOpen: !this.state.isOpen });
  }
}

const Header = withRouter(HeaderComponent);

export default Header;
