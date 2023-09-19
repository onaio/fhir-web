import { UserRole } from '../index';

describe('user role definition', () => {
  it('empty userRole', () => {
    const userRole = new UserRole();
    // expect(userRole.hasPermissions("")).toBeFalsy();
    expect(userRole.hasPermissions('iam_user.read')).toBeFalsy();
    expect(userRole.hasPermissions([])).toBeTruthy();
  });

  it('create role is not included as part of read', () => {
    const readUserRole = UserRole.fromPermissionStrings('iam_user.read');
    expect(readUserRole?.hasPermissions('iam_user.create')).toBeFalsy();
  });
});
