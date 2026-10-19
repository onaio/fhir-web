import { StepKey } from '../..//types';

/** returns a message when the new draft matches another draft of the same step, otherwise undefined */
export type DuplicateCheck = (
  values: Record<string, unknown>,
  drafts: unknown[],
  editIndex?: number
) => string | undefined;

// ignores case, spaces at the ends and repeated spaces
const norm = (s: unknown) =>
  typeof s === 'string' ? s.trim().replace(/\s+/g, ' ').toLowerCase() : '';

// the draft being edited is left out, so saving it again is not a clash with itself
const others = (drafts: unknown[], editIndex?: number) =>
  drafts.filter((_, i) => i !== editIndex) as Record<string, unknown>[];

const byName =
  (label: string): DuplicateCheck =>
  (values, drafts, editIndex) => {
    const name = norm(values.name);
    if (!name) return undefined; // the form's own validation handles an empty name
    return others(drafts, editIndex).some((d) => norm(d.name) === name)
      ? `${label} "${String(values.name).trim()}" is already in the drafts.`
      : undefined;
  };

export const checkLocation = byName('A location named');
export const checkOrganization = byName('An organization named');
export const checkCareTeam = byName('A care team named');

export const checkUser: DuplicateCheck = (values, drafts, editIndex) => {
  const email = norm(values.email);
  const username = norm(values.username);
  for (const d of others(drafts, editIndex)) {
    if (email && norm(d.email) === email) {
      return `The email "${String(values.email).trim()}" is already used by another user in the drafts.`;
    }
    if (username && norm(d.username) === username) {
      return `The username "${String(values.username).trim()}" is already in the drafts.`;
    }
  }
  return undefined;
};

export const duplicateChecks: Record<StepKey, DuplicateCheck> = {
  [StepKey.LOCATION]: checkLocation,
  [StepKey.ORGANIZATION]: checkOrganization,
  [StepKey.CARE_TEAM]: checkCareTeam,
  [StepKey.USERS]: checkUser,
};