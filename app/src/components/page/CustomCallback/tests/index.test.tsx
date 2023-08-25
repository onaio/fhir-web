import { mount } from 'enzyme';
import React from 'react';
import { MemoryRouter, RouteComponentProps } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';
import { authenticateUser } from '@onaio/session-reducer';
import * as notifications from '@opensrp/notifications';
import { store } from '@opensrp/store';
import { history } from '@onaio/connected-reducer-registry';
import { SuccessfulLoginComponent, UnSuccessfulLogin } from '..';
import { URL_EXPRESS_LOGIN } from '../../../../constants';
import { Provider } from 'react-redux';
import { CallbackComponent } from '../../../../App/fhir-apps';

jest.mock('../../../../configs/env', () => ({
  ENABLE_OPENSRP_OAUTH: true,
  OPENSRP_API_BASE_URL: 'https://test.smartregister.org/opensrp/rest/',
  DOMAIN_NAME: 'http://localhost:3000',
  OPENSRP_OAUTH_SCOPES: ['read', 'profile'],
}));

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

const App = () => {
  return (
    <Routes>
      <Route path="/callback" element={SuccessfulLoginComponent} />
      {/* tslint:disable-next-line: jsx-no-lambda */}
      <Route path="/failedCallback" element={UnSuccessfulLogin} />
      {/* tslint:disable-next-line: jsx-no-lambda */}
      <Route path="/login" element={() => <div id="login" />} />
      {/* tslint:disable-next-line: jsx-no-lambda */}
      <Route path="/teams" element={() => <div id="teams" />} />
      {/* tslint:disable-next-line: jsx-no-lambda */}
      <Route path="/plans/update/:id" element={() => <div id="plans" />} />
      {/* tslint:disable-next-line: jsx-no-lambda */}
      <Route path="/" element={() => <div id="home" />} />
    </Routes>
  );
};
const realLocation = window.location;
describe('src/components/page/CustomCallback.SuccessfulLogin', () => {
  beforeAll(() => {
    store.dispatch(
      authenticateUser(
        true,
        {
          email: 'bob@example.com',
          name: 'Bobbie',
          username: 'RobertBaratheon',
        },
        {
          roles: ['ROLE_EDIT_KEYCLOAK_USERS'],
          username: 'superset-user',
          user_id: 'cab07278-c77b-4bc7-b154-bcbf01b7d35b',
        }
      )
    );
  });
  afterEach(() => {
    window.location = realLocation;
  });
  it('renders correctly', () => {
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: `/callback`, search: '', hash: '', state: {} }]}>
          <App />
        </MemoryRouter>
      </Provider>
    );
    // should redirect to home
    expect(wrapper.find('#home')).toHaveLength(1);
  });

//   it('redirects to home if next page is /', () => {
//     const mockNotificationSuccess = jest.spyOn(notifications, 'sendSuccessNotification');
//     const wrapper = mount(
//       <Provider store={store}>
//         <MemoryRouter
//           initialEntries={[{ pathname: `/callback`, search: '?next=/', hash: '', state: {} }]}
//         >
//           <App />
//         </MemoryRouter>
//       </Provider>
//     );
//     // should redirect to home
//     expect(wrapper.find('#home')).toHaveLength(1);
//     expect(mockNotificationSuccess).toHaveBeenCalledWith('Welcome back, RobertBaratheon');
//   });

//   it('redirects if next page is provided; nominal', () => {
//     const wrapper = mount(
//       <MemoryRouter
//         initialEntries={[{ pathname: `/callback`, search: '?next=%2Fteams', hash: '', state: {} }]}
//       >
//         <App />
//       </MemoryRouter>
//     );
//     // should redirect to teams
//     expect(wrapper.find('#teams')).toHaveLength(1);
//     expect(wrapper.find('#home')).toHaveLength(0);
//   });

//   it('redirects if next page is provided, tougher case', () => {
//     const wrapper = mount(
//       <MemoryRouter
//         initialEntries={[
//           {
//             hash: '',
//             pathname: `/callback`,
//             search: '?next=%2Fplans%2Fupdate%2Fbc78591f-df79-45a7-99e4-c1fbeda629e2',
//             state: {},
//           },
//         ]}
//       >
//         <App />
//       </MemoryRouter>
//     );
//     // should redirect to plans
//     expect(wrapper.find('#plans')).toHaveLength(1);
//   });
//   it('redirect to login if redirect path doesnt exist', () => {
//     // const hrefMock = jest.fn();
//     // applyHrefMock(hrefMock);
//     const wrapper = mount(
//       <MemoryRouter
//         initialEntries={[{ pathname: `/callback`, search: '?next=%2F', hash: '', state: {} }]}
//       >
//         <App />
//       </MemoryRouter>
//     );
//     expect(wrapper.find('#home')).toHaveLength(1);
//   });
// });

// describe('src/components/page/CustomCallback.UnsuccessfulLogin', () => {
//   const ActualWindowLocation = window.location;
//   afterAll(() => {
//     window.location = ActualWindowLocation;
//   });
//   delete (window as any).location;
//   const applyHrefMock = (mock: jest.Mock) => {
//     (window.location as unknown) = {
//       set href(url: string) {
//         mock(url);
//       },
//     };
//   };

//   afterEach(() => {
//     jest.clearAllMocks();
//     jest.resetAllMocks();
//   });

//   it('renders unsuccessful login correctly', () => {
//     const hrefMock = jest.fn();
//     applyHrefMock(hrefMock);
//     mount(
//       <MemoryRouter
//         initialEntries={[{ pathname: `/failedCallback`, search: '', hash: '', state: {} }]}
//       >
//         <App />
//       </MemoryRouter>
//     );
//     expect(hrefMock).toBeCalledWith(URL_EXPRESS_LOGIN);
//   });

//   it('Appends correct path when searchParams is given', () => {
//     const hrefMock = jest.fn();
//     applyHrefMock(hrefMock);
//     mount(
//       <MemoryRouter
//         initialEntries={[
//           { pathname: `/failedCallback`, search: '?next=%2Fteams', hash: '', state: {} },
//         ]}
//       >
//         <App />
//       </MemoryRouter>
//     );
//     expect(hrefMock).toBeCalledWith(`${URL_EXPRESS_LOGIN}?next=%2Fteams`);
//   });

//   it('Redirects only to login if searchParam url is not allowable', () => {
//     const hrefMock = jest.fn();
//     applyHrefMock(hrefMock);
//     mount(
//       <MemoryRouter
//         initialEntries={[
//           {
//             hash: '',
//             pathname: `/failedCallback`,
//             search: '?next=%2Flogout',
//             state: {},
//           },
//         ]}
//       >
//         <App />
//       </MemoryRouter>
//     );
//     expect(hrefMock).toBeCalledWith(URL_EXPRESS_LOGIN);
//   });

//   it('Correctly sets oauth scopes', async () => {
//     const routeProps = {
//       history,
//       location: {
//         hash: '',
//         pathname: '/',
//         search: '?next=%2F',
//         state: {},
//       },
//       match: {
//         params: { id: 'OpenSRP' },
//       },
//     } as RouteComponentProps<{ id: string }>;

//     const wrapper = mount(
//       <Provider store={store}>
//         <MemoryRouter initialEntries={[{ pathname: `/` }]}>
//           <CallbackComponent {...routeProps} />
//         </MemoryRouter>
//       </Provider>
//     );
//     wrapper.update();
//     expect((wrapper.find('OauthCallback').props() as any).providers['OpenSRP'].scopes).toEqual([
//       'read',
//       'profile',
//     ]);
//     wrapper.unmount();
//   });
});
