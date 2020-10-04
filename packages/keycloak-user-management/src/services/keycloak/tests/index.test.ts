import { getOpenSRPUserInfo } from '@onaio/gatekeeper';
import { authenticateUser } from '@onaio/session-reducer';
import store from '../../../../../../client/src/store';
import { getDefaultHeaders, getFetchOptions, KeycloakService } from '@opensrp/keycloak-service';
import fetch from 'jest-fetch-mock';
import { OpenSRPAPIResponse } from '../../tests/fixtures/session';
import { keycloakUser } from '../../../ducks/tests/fixtures';
import { HTTPError } from '../errors';

describe('services/ducks/keycloak', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    fetch.resetMocks();
  });

  it('getDefaultHeaders works', async () => {
    const { authenticated, user, extraData } = getOpenSRPUserInfo(OpenSRPAPIResponse);
    store.dispatch(authenticateUser(authenticated, user, extraData));
    expect(getDefaultHeaders('hunter2')).toEqual({
      accept: 'application/json',
      authorization: 'Bearer hunter2',
      'content-type': 'application/json;charset=UTF-8',
    });
  });

  it('getFetchOptions works', async () => {
    const output = {
      headers: {
        accept: 'application/json',
        authorization: 'Bearer hunter2',
        'content-type': 'application/json;charset=UTF-8',
      },
      method: 'POST',
    };
    const signal = new AbortController().signal;
    expect(getFetchOptions(signal, 'hunter2', 'POST')).toEqual({ ...output });
  });

  it('KeycloakService constructor works', async () => {
    const userService = new KeycloakService(
      'hunter2',
      'users',
      'https://keycloak-test.smartregister.org/auth/realms/'
    );
    expect(userService.baseURL).toEqual('https://keycloak-test.smartregister.org/auth/realms/');
    expect(userService.endpoint).toEqual('users');
    expect(userService.generalURL).toEqual(
      'https://keycloak-test.smartregister.org/auth/realms/users'
    );
  });

  // list method

  it('KeycloakService list method works', async () => {
    fetch.mockResponseOnce(JSON.stringify([keycloakUser]));
    const userService = new KeycloakService(
      'hunter2',
      'users',
      'https://keycloak-test.smartregister.org/auth/realms/'
    );
    const result = await userService.list();
    expect(result).toEqual([keycloakUser]);
    expect(fetch.mock.calls).toEqual([
      [
        'https://keycloak-test.smartregister.org/auth/realms/users',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer hunter2',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
    ]);
  });

  it('KeycloakService list method should handle http errors', async () => {
    fetch.mockResponseOnce(JSON.stringify({}), { status: 500 });
    const userService = new KeycloakService(
      'hunter2',
      'users',
      'https://keycloak-test.smartregister.org/auth/realms/'
    );
    let error;
    try {
      await userService.list();
    } catch (e) {
      error = e;
    }
    expect(error).toEqual(
      new HTTPError({}, undefined, 'KeycloakAPIService list on users failed, HTTP status 500')
    );
  });

  //   // delete method

  it('KeycloakService delete method works', async () => {
    fetch.mockResponseOnce(JSON.stringify({}));
    const service = new KeycloakService(
      'hunter2',
      `users/${keycloakUser.id}/delete`,
      'https://keycloak-test.smartregister.org/auth/realms/'
    );
    const result = await service.delete();
    expect(result).toEqual({});
    expect(fetch.mock.calls).toEqual([
      [
        'https://keycloak-test.smartregister.org/auth/realms/users/cab07278-c77b-4bc7-b154-bcbf01b7d35b/delete',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer hunter2',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'DELETE',
        },
      ],
    ]);
  });

  it('KeycloakService delete method should handle http errors', async () => {
    fetch.mockResponseOnce(JSON.stringify({}), { status: 500 });
    const service = new KeycloakService(
      'hunter2',
      `users/${keycloakUser.id}/delete`,
      'https://keycloak-test.smartregister.org/auth/realms/'
    );
    let error;
    try {
      await service.delete();
    } catch (e) {
      error = e;
    }
    expect(error).toEqual(
      new HTTPError(
        {},
        undefined,
        `KeycloakAPIService delete on users/${keycloakUser.id}/delete failed, HTTP status 500`
      )
    );
  });

  //   // read method

  it('KeycloakService read method works', async () => {
    fetch.mockResponseOnce(JSON.stringify([keycloakUser]));
    const usersService = new KeycloakService(
      'hunter2',
      'users',
      'https://keycloak-test.smartregister.org/auth/realms/'
    );
    const result = await usersService.read(keycloakUser.id);
    expect(result).toEqual([keycloakUser]);
    expect(fetch.mock.calls).toEqual([
      [
        'https://keycloak-test.smartregister.org/auth/realms/users/cab07278-c77b-4bc7-b154-bcbf01b7d35b',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer hunter2',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
    ]);
  });

  it('KeycloakService read method handles null response', async () => {
    fetch.mockResponseOnce(JSON.stringify(null));
    const usersService = new KeycloakService(
      'hunter2',
      'users',
      'https://keycloak-test.smartregister.org/auth/realms/'
    );
    const result = await usersService.read(keycloakUser.id);
    expect(result).toEqual(null);
  });

  it('KeycloakService read method should handle http errors', async () => {
    fetch.mockResponseOnce(JSON.stringify({}), { status: 500 });
    const usersService = new KeycloakService(
      'hunter2',
      'users',
      'https://keycloak-test.smartregister.org/auth/realms/'
    );
    let error;
    try {
      await usersService.read(keycloakUser.id);
    } catch (e) {
      error = e;
    }
    expect(error).toEqual(
      new HTTPError({}, undefined, `KeycloakAPIService read on users failed, HTTP status 500`)
    );
  });

  it('KeycloakService create method works', async () => {
    fetch.mockResponseOnce(JSON.stringify([keycloakUser]), { status: 201 });
    const usersService = new KeycloakService(
      'hunter2',
      'users',
      'https://keycloak-test.smartregister.org/auth/realms/'
    );
    const result = await usersService.create(keycloakUser);
    expect(result).toEqual({});
    expect(fetch.mock.calls).toEqual([
      [
        'https://keycloak-test.smartregister.org/auth/realms/users',
        {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          body: JSON.stringify(keycloakUser),
          headers: {
            accept: 'application/json',
            authorization: 'Bearer hunter2',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'POST',
        },
      ],
    ]);
  });

  it('KeycloakService create method should handle http errors', async () => {
    fetch.mockResponseOnce(JSON.stringify({}), { status: 500 });
    const usersService = new KeycloakService(
      'hunter2',
      'users',
      'https://keycloak-test.smartregister.org/auth/realms/'
    );
    let error;
    try {
      await usersService.create({ foo: 'bar' });
    } catch (e) {
      error = e;
    }
    expect(error).toEqual(
      new HTTPError({}, undefined, 'KeycloakAPIService create on users failed, HTTP status 500')
    );
  });

  it('KeycloakService update method works', async () => {
    fetch.mockResponseOnce(JSON.stringify({}));
    const usersService = new KeycloakService(
      'hunter2',
      'users',
      'https://keycloak-test.smartregister.org/auth/realms/'
    );
    const obj = {
      ...keycloakUser,
      firstName: 'Demo1',
    };
    const result = await usersService.update(obj);
    expect(result).toEqual({});
    expect(fetch.mock.calls).toEqual([
      [
        'https://keycloak-test.smartregister.org/auth/realms/users',
        {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          body: JSON.stringify(obj),
          headers: {
            accept: 'application/json',
            authorization: 'Bearer hunter2',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'PUT',
        },
      ],
    ]);
  });

  it('KeycloakService update method should handle http errors', async () => {
    fetch.mockResponseOnce(JSON.stringify({}), { status: 500 });
    const usersService = new KeycloakService(
      'hunter2',
      'users',
      'https://keycloak-test.smartregister.org/auth/realms/'
    );
    let error;
    try {
      await usersService.update(keycloakUser);
    } catch (e) {
      error = e;
    }
    expect(error).toEqual(
      new HTTPError({}, undefined, 'KeycloakAPIService update on users failed, HTTP status 500')
    );
  });
  it('readFile works correctly', async () => {
    const mockClass = new KeycloakService(
      'hunter2',
      'users',
      'https://keycloak-test.smartregister.org/auth/realms/'
    );
    const mockReadFile = jest.fn();
    mockReadFile.mockReturnValue(
      Promise.resolve(new Blob(['greetings', 'hello'], { type: 'text/csv' }))
    );
    const result = await mockClass.readFile('');
    expect(result).toEqual(expect.any(Object));
    mockReadFile.mockRejectedValue('Error!');
    expect(result).toEqual(expect.any(Object));
  });
});
