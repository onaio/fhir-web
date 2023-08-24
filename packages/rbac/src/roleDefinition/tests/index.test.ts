import { UserRole } from '../index';

describe('user role definition', () => {
  it('empty userRole', () => {
    const userRole = new UserRole();
    // expect(userRole.hasPermissions("")).toBeFalsy();
    expect(userRole.hasPermissions('iam_user.read')).toBeFalsy();
    expect(userRole.hasPermissions([])).toBeTruthy();
  });
});
