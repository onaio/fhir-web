import { v4 } from 'uuid';
import { KeycloakService } from '@opensrp/keycloak-service';
import {
  getUserAndGroupsPayload,
  KEYCLOAK_URL_USERS,
  KEYCLOAK_URL_USER_GROUPS,
} from '@opensrp/user-management';
import type { FormFields as UserFormFields, UserGroup } from '@opensrp/user-management';
import { practitionerUpdater } from '@opensrp/fhir-user-management';
import { generateOrgPayload, postPutOrganization } from '@opensrp/fhir-team-management';
import type { OrganizationFormFields } from '@opensrp/fhir-team-management';
import {
  submitCareTeamForm,
  preloadExistingOptionsFactory,
  processOrganizationOption,
  processPractitionerOption,
  defaultCareTeamInitialValues,
} from '@opensrp/fhir-care-team';
import type { CareTeamFormFields } from '@opensrp/fhir-care-team';
import { postPutLocationUnit } from '@opensrp/fhir-location-management';
import type { LocationFormFields } from '@opensrp/fhir-location-management';
import {
  FHIRServiceClass,
  getObjLike,
  getResourcesFromBundle,
  IdentifierUseCodes,
  parseFhirHumanName,
} from '@opensrp/react-utils';
import type { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';
import type { ILocation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ILocation';
import type { IOrganization } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IOrganization';
import type { IPractitioner } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitioner';
import type { IPractitionerRole } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitionerRole';
import type { IResource } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IResource';
import { readDrafts } from '../../components/Drafts/useDraftStore';
import { StepKey } from '../../types';
import { duplicateChecks } from './duplicateChecks';

export interface SubmitWizardArgs {
  fhirBaseURL: string;
  baseUrl: string;
  keycloakBaseURL: string;
  userGroups: UserGroup[];
}

const DRAFT_PREFIX = 'draft:';
const ID_MAP_KEY = 'wizard-submitted-ids';

type IdMap = Record<string, string>;
type Draft<T> = T & { draftId: string };
type LocationDraft = Draft<LocationFormFields & { payload: ILocation }>;
type Opt = { label: string; value: string };

const loadIdMap = (): IdMap => {
  try {
    return JSON.parse(sessionStorage.getItem(ID_MAP_KEY) ?? '{}') as IdMap;
  } catch {
    return {};
  }
};
const saveIdMap = (idMap: IdMap) => sessionStorage.setItem(ID_MAP_KEY, JSON.stringify(idMap));
export const clearIdMap = () => sessionStorage.removeItem(ID_MAP_KEY);

const keyOf = (draftId: string) => `${DRAFT_PREFIX}${draftId}`;
const record = (idMap: IdMap, key: string, value: string) => {
  idMap[key] = value;
  saveIdMap(idMap); // saved after each step, so pressing Finish again resumes instead of duplicating
};

/** "draft:<id>" -> the real id of the resource created from that draft (plain ids are returned as they are) */
const resolveId = (value: string, idMap: IdMap): string => {
  if (!value.startsWith(DRAFT_PREFIX)) return value;
  const realId = idMap[value];
  if (!realId) {
    throw new Error(
      'A drafted item refers to another draft that no longer exists. Re-select it and try again.'
    );
  }
  return realId;
};
/** same, but for fields that store "ResourceType/id" references */
const resolveRef = (value: string, idMap: IdMap, resourceType: string): string =>
  value.startsWith(DRAFT_PREFIX) ? `${resourceType}/${resolveId(value, idMap)}` : value;

/** "Practitioner/abc" -> "abc" (plain ids come back unchanged) */
const stripPrefix = (ref: string, resourceType: string) =>
  ref.startsWith(`${resourceType}/`) ? ref.slice(resourceType.length + 1) : ref;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const findPractitioner = async (baseUrl: string, keycloakId: string, variant: number) => {
  const res = await new FHIRServiceClass<IBundle>(baseUrl, 'Practitioner').list({
    identifier: keycloakId,
    _count: variant,
  });
  return getResourcesFromBundle<IPractitioner>(res)[0];
};

/** searches by id instead of using single-resource GETs, which break on the gateway's 304 -> 500 */
async function fetchByIds<T extends IResource>(
  baseUrl: string,
  resourceType: string,
  ids: string[]
): Promise<T[]> {
  if (!ids.length) return [];
  const res = await new FHIRServiceClass<IBundle>(baseUrl, resourceType).list({
    _id: ids.join(','),
    _count: ids.length,
  });
  const found = getResourcesFromBundle<T>(res);
  const missing = ids.filter((id) => !found.some((r) => r.id === id));
  if (missing.length) {
    throw new Error(`Could not find ${resourceType} ${missing.join(', ')} on the server.`);
  }
  return found;
}

let searchVariant = 20; // each search gets a different _count, so a cached result is never reused

async function findRoles(baseUrl: string, practitionerId: string) {
  const res = await new FHIRServiceClass<IBundle>(baseUrl, 'PractitionerRole').list({
    practitioner: `Practitioner/${practitionerId}`,
    _count: searchVariant++,
  });
  return getResourcesFromBundle<IPractitionerRole>(res);
}

/** gives the practitioner a role in this organization without touching the roles they hold in others */
async function assignPractitioner(
  baseUrl: string,
  organization: IOrganization,
  practitionerId: string
) {
  const roleService = new FHIRServiceClass<IPractitionerRole>(baseUrl, 'PractitionerRole');
  const orgRef = `Organization/${organization.id}`;
  const roles = await findRoles(baseUrl, practitionerId);

  if (roles.some((r) => r.organization?.reference === orgRef)) return; // already assigned, e.g. on a retry

  const organizationRef = { reference: orgRef, display: organization.name };

  // a role with no organization yet (the one the user form creates) is claimed first
  const unassigned = roles.find((r) => !r.organization?.reference);
  if (unassigned) {
    await roleService.update({ ...unassigned, organization: organizationRef });
    return;
  }

  // otherwise the practitioner already belongs to other organizations: add a role instead of moving one
  const [practitioner] = await fetchByIds<IPractitioner>(baseUrl, 'Practitioner', [practitionerId]);
  const secondary = practitioner.identifier?.find((i) => i.use === 'secondary');
  const id = v4();
  await roleService.update({
    resourceType: 'PractitionerRole',
    id,
    identifier: [{ use: 'official', value: id }, ...(secondary ? [secondary] : [])],
    active: true,
    practitioner: {
      reference: `Practitioner/${practitionerId}`,
      display: parseFhirHumanName(
        getObjLike(practitioner.name, 'use', IdentifierUseCodes.OFFICIAL)[0]
      ),
    },
    organization: organizationRef,
    ...(roles[0]?.code ? { code: roles[0].code } : {}),
  } as IPractitionerRole);
}

/** care team participants: drafted ones come from the id map, the rest are looked up for their display name */
async function buildOptions(
  rawValues: string[],
  resourceType: string,
  draftNames: Record<string, string>, // draftId -> display name
  idMap: IdMap,
  lookup: (refs: string[]) => Promise<unknown[]>
): Promise<Opt[]> {
  const existing = rawValues.filter((v) => !v.startsWith(DRAFT_PREFIX));
  let found: Opt[] = [];
  if (existing.length) {
    try {
      found = (await lookup(existing)) as Opt[];
    } catch {
      found = []; // a missing display name must not block the care team
    }
  }
  return rawValues.map((raw) =>
    raw.startsWith(DRAFT_PREFIX)
      ? {
          value: resolveRef(raw, idMap, resourceType),
          label: draftNames[raw.slice(DRAFT_PREFIX.length)] ?? resourceType,
        }
      : { value: raw, label: found.find((o) => o.value === raw)?.label ?? raw }
  );
}

async function submitLocations({ fhirBaseURL }: SubmitWizardArgs, idMap: IdMap) {
  for (const { draftId, payload } of readDrafts<LocationDraft>(StepKey.LOCATION)) {
    const key = keyOf(draftId);
    if (idMap[key]) continue;
    if (!payload) throw new Error('A location draft has no payload. Delete it and add it again.');
    await postPutLocationUnit(payload, fhirBaseURL); // PUT with a pre-generated id
    record(idMap, key, payload.id ?? 'created');
  }
}

async function submitUsers(args: SubmitWizardArgs, idMap: IdMap) {
  for (const { draftId, ...values } of readDrafts<Draft<UserFormFields>>(StepKey.USERS)) {
    const key = keyOf(draftId);
    if (idMap[key]) continue;

    // 1. keycloak user (skipped if an earlier attempt already created it)
    const keycloakKey = `${key}:keycloak`;
    const resumedRun = !!idMap[keycloakKey];
    let keycloakId = idMap[keycloakKey];
    if (!keycloakId) {
      const { keycloakUser } = getUserAndGroupsPayload(values);
      const res = await new KeycloakService(KEYCLOAK_URL_USERS, args.keycloakBaseURL).create(
        keycloakUser
      );
      const parts = res.headers.get('location')?.split('/') ?? [];
      keycloakId = parts[parts.length - 1];
      if (!keycloakId) throw new Error(`Could not read the new Keycloak id for ${values.username}.`);
      record(idMap, keycloakKey, keycloakId);
    }

    // 2. group membership (safe to repeat on a retry)
    const groupIds = values.userGroups ?? [];
    if (groupIds.length) {
      const allGroups = (await new KeycloakService(
        KEYCLOAK_URL_USER_GROUPS,
        args.keycloakBaseURL
      ).list()) as unknown as UserGroup[];
      for (const groupId of groupIds) {
        const group = allGroups.find((g) => g.id === groupId);
        if (!group) throw new Error(`User group ${groupId} no longer exists.`);
        await new KeycloakService(
          `${KEYCLOAK_URL_USERS}/${keycloakId}${KEYCLOAK_URL_USER_GROUPS}/${groupId}`,
          args.keycloakBaseURL
        ).update(group);
      }
    }

    // 3. FHIR practitioner; the updater swallows its own errors, so look it up afterwards
    let practitioner = resumedRun ? await findPractitioner(args.baseUrl, keycloakId, 1) : undefined;
    if (!practitioner) {
      await practitionerUpdater(args.baseUrl)(values, keycloakId);
      for (let attempt = 2; attempt <= 5 && !practitioner?.id; attempt++) {
        await sleep(1000);
        practitioner = await findPractitioner(args.baseUrl, keycloakId, attempt);
      }
    }
    if (!practitioner?.id) {
      throw new Error(`The practitioner for ${values.username} could not be created.`);
    }

    // the user form creates the PractitionerRole in the background; wait for it so the
    // organization step claims it instead of creating a second one
    for (let attempt = 0; attempt < 5; attempt++) {
      if ((await findRoles(args.baseUrl, practitioner.id)).length) break;
      await sleep(1000);
    }
    record(idMap, key, practitioner.id);
  }
}

async function submitOrganizations({ fhirBaseURL }: SubmitWizardArgs, idMap: IdMap) {
  for (const { draftId, ...values } of readDrafts<Draft<OrganizationFormFields>>(
    StepKey.ORGANIZATION
  )) {
    const key = keyOf(draftId);
    const rolesKey = `${key}:roles`;
    if (idMap[rolesKey]) continue; // fully done on an earlier attempt

    // same shape the form's own dropdown produces: "Practitioner/<id>"
    const members = (values.members ?? []).map((m) => resolveRef(m, idMap, 'Practitioner'));
    const resolved = { ...values, members } as OrganizationFormFields;

    // 1. the organization, recorded the moment it exists so a later failure can't create it twice
    let organization: IOrganization;
    if (idMap[key]) {
      [organization] = await fetchByIds<IOrganization>(fhirBaseURL, 'Organization', [idMap[key]]);
    } else {
      organization = await postPutOrganization(fhirBaseURL, generateOrgPayload(resolved));
      if (!organization.id) {
        throw new Error('The server did not return an id for the new organization.');
      }
      record(idMap, key, organization.id);
    }

    // 2. one role per practitioner and organization, so a practitioner can belong to several
    for (const member of members) {
      await assignPractitioner(fhirBaseURL, organization, stripPrefix(member, 'Practitioner'));
    }
    record(idMap, rolesKey, 'done');
  }
}

async function submitCareTeams({ fhirBaseURL }: SubmitWizardArgs, idMap: IdMap) {
  const t = ((s: string) => s) as unknown as Parameters<typeof submitCareTeamForm>[5];

  const orgNames: Record<string, string> = {};
  readDrafts<Draft<OrganizationFormFields>>(StepKey.ORGANIZATION).forEach((o) => {
    orgNames[o.draftId] = o.name ?? 'Organization';
  });
  const practitionerNames: Record<string, string> = {};
  readDrafts<Draft<UserFormFields>>(StepKey.USERS).forEach((u) => {
    practitionerNames[u.draftId] =
      [u.firstName, u.lastName].filter(Boolean).join(' ') || u.username;
  });

  for (const { draftId, ...values } of readDrafts<Draft<CareTeamFormFields>>(StepKey.CARE_TEAM)) {
    const key = keyOf(draftId);
    if (idMap[key]) continue;

    const orgOptions = await buildOptions(
      values.managingOrganizations ?? [],
      'Organization',
      orgNames,
      idMap,
      preloadExistingOptionsFactory(fhirBaseURL, processOrganizationOption)
    );
    const practitionerOptions = await buildOptions(
      values.practitionerParticipants ?? [],
      'Practitioner',
      practitionerNames,
      idMap,
      preloadExistingOptionsFactory(fhirBaseURL, processPractitionerOption)
    );

    await submitCareTeamForm(
      {
        ...values,
        status: values.status ?? 'active',
        managingOrganizations: orgOptions.map((o) => o.value),
        practitionerParticipants: practitionerOptions.map((o) => o.value),
        organizationParticipants: [],
      },
      defaultCareTeamInitialValues,
      fhirBaseURL,
      orgOptions as unknown as Parameters<typeof submitCareTeamForm>[3],
      practitionerOptions as unknown as Parameters<typeof submitCareTeamForm>[4],
      t
    );
    record(idMap, key, 'created');
  }
}

/** the same rules as when a draft is added, run once more before anything is created */
function validateDrafts() {
  (Object.keys(duplicateChecks) as StepKey[]).forEach((step) => {
    const drafts = readDrafts<Record<string, unknown>>(step);
    drafts.forEach((draft, i) => {
      const problem = duplicateChecks[step](draft, drafts, i);
      if (problem) throw new Error(problem);
    });
  });
}

async function runStep(name: string, fn: () => Promise<void>) {
  try {
    await fn();
  } catch (e) {
    throw new Error(`${name} step failed: ${e instanceof Error ? e.message : String(e)}`);
  }
}

export async function submitWizard(args: SubmitWizardArgs) {
  validateDrafts();
  const idMap = loadIdMap();
  await runStep('Location', () => submitLocations(args, idMap));
  await runStep('Users', () => submitUsers(args, idMap));
  await runStep('Organization', () => submitOrganizations(args, idMap));
  await runStep('Care Team', () => submitCareTeams(args, idMap));
}