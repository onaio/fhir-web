import { checkLocation, checkOrganization, checkUser } from '../duplicateChecks';

describe('name checks', () => {
  const drafts = [{ name: 'North Clinic' }, { name: 'South Clinic' }];

  it('rejects a name already in the drafts, ignoring case and spacing', () => {
    expect(checkLocation({ name: '  north   clinic ' }, drafts)).toMatch(/already in the drafts/);
  });

  it('accepts a new name', () => {
    expect(checkOrganization({ name: 'East Clinic' }, drafts)).toBeUndefined();
  });

  it('does not clash with the draft being edited', () => {
    expect(checkOrganization({ name: 'North Clinic' }, drafts, 0)).toBeUndefined();
  });

  it('still clashes with a different draft while editing', () => {
    expect(checkOrganization({ name: 'South Clinic' }, drafts, 0)).toBeDefined();
  });

  it('ignores an empty name', () => {
    expect(checkOrganization({ name: '' }, drafts)).toBeUndefined();
  });
});

describe('checkUser', () => {
  const users = [{ username: 'amy', email: 'Amy@Example.com' }, { username: 'bob' }];

  it('rejects a repeated email, ignoring case', () => {
    expect(checkUser({ username: 'new', email: 'amy@example.com' }, users)).toMatch(/email/);
  });

  it('accepts a user with no email', () => {
    expect(checkUser({ username: 'new' }, users)).toBeUndefined();
  });

  it('rejects a repeated username', () => {
    expect(checkUser({ username: 'BOB' }, users)).toMatch(/username/);
  });

  it('lets two users both have no email', () => {
    expect(checkUser({ username: 'carl' }, [{ username: 'bob' }])).toBeUndefined();
  });
});