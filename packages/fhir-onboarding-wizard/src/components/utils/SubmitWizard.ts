import { KeycloakService } from '@opensrp/keycloak-service';
import {
  getUserAndGroupsPayload,
  KEYCLOAK_URL_USERS,
  KEYCLOAK_URL_USER_GROUPS,
} from '@opensrp/user-management';
import type { FormFields as UserFormFields, UserGroup } from '@opensrp/user-management';
import { practitionerUpdater } from '@opensrp/fhir-user-management';
import {
  generateOrgPayload,
  postPutOrganization,
  updatePractitionerRoles,
} from '@opensrp/fhir-team-management';
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
import { FHIRServiceClass, getResourcesFromBundle } from '@opensrp/react-utils';
import type { ILocation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ILocation';
import type { IPractitioner } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitioner';
import { readDrafts } from '../Drafts/useDraftStore';
import { StepKey } from '../../types';
import type { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';
import { IOrganization } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IOrganization';
import type { IResource } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IResource';

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
  saveIdMap(idMap); // persisted, so pressing Finish again resumes instead of duplicating
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

async function submitLocations({ fhirBaseURL }: SubmitWizardArgs, idMap: IdMap) {
  for (const { draftId, payload } of readDrafts<LocationDraft>(StepKey.LOCATION)) {
    const key = keyOf(draftId);
    if (idMap[key]) continue;
    await postPutLocationUnit(payload, fhirBaseURL); 
    record(idMap, key, payload.id ?? 'created');
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const findPractitioner = async (baseUrl: string, keycloakId: string, variant: number) => {
  const res = await new FHIRServiceClass<IBundle>(baseUrl, 'Practitioner').list({
    identifier: keycloakId,
    _count: variant,
  });
  return getResourcesFromBundle<IPractitioner>(res)[0];
};

async function submitUsers(args: SubmitWizardArgs, idMap: IdMap) {
  for (const { draftId, ...values } of readDrafts<Draft<UserFormFields>>(StepKey.USERS)) {
    const userValues = { ...values, enabled: values.enabled ?? true };
    const key = keyOf(draftId);
    if (idMap[key]) continue;

    // 1. keycloak user (skipped if an earlier attempt already created it)
    const keycloakKey = `${key}:keycloak`;
    const resumedRun = !!idMap[keycloakKey]; // true when an earlier Finish already created the keycloak user
    let keycloakId = idMap[keycloakKey];
    if (!keycloakId) {
      const { keycloakUser } = getUserAndGroupsPayload(userValues);
      const res = await new KeycloakService(KEYCLOAK_URL_USERS, args.keycloakBaseURL).create(
        keycloakUser
      );
      const parts = res.headers.get('location')?.split('/') ?? [];
      keycloakId = parts[parts.length - 1];
      if (!keycloakId)
        throw new Error(`Could not read the new Keycloak id for ${values.username}.`);
      record(idMap, keycloakKey, keycloakId);
    }

    // 2. group membership (idempotent, so safe to repeat on a retry)
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

    // 3. FHIR practitioner. practitionerUpdater swallows its own errors and returns nothing,
    // a brand new user cannot have a practitioner yet, so only look first when resuming
    let practitioner = resumedRun ? await findPractitioner(args.baseUrl, keycloakId, 1) : undefined;
    if (!practitioner) {
      await practitionerUpdater(args.baseUrl)(userValues, keycloakId);
      for (let attempt = 2; attempt <= 5 && !practitioner?.id; attempt++) {
        await sleep(1000);
        practitioner = await findPractitioner(args.baseUrl, keycloakId, attempt);
      }
    }
    if (!practitioner?.id) {
      throw new Error(`The practitioner for ${userValues.username} could not be created.`);
    }
    record(idMap, key, practitioner.id);
  }
}

/** "Practitioner/abc" -> "abc" (plain ids come back unchanged) */
const stripPrefix = (ref: string, resourceType: string) =>
  ref.startsWith(`${resourceType}/`) ? ref.slice(resourceType.length + 1) : ref;

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

async function submitOrganizations({ fhirBaseURL }: SubmitWizardArgs, idMap: IdMap) {
  for (const { draftId, ...values } of readDrafts<Draft<OrganizationFormFields>>(
    StepKey.ORGANIZATION
  )) {
    const key = keyOf(draftId);
    const rolesKey = `${key}:roles`;
    if (idMap[rolesKey]) continue; 

    // same shape the form's own dropdown produces: "Practitioner/<id>"
    const members = (values.members ?? []).map((m) => resolveRef(m, idMap, 'Practitioner'));
    const resolved = { ...values, members } as OrganizationFormFields;

    // 1. the organization, recorded the moment it exists so a later failure can't create it twice
    let organization: IOrganization;
    if (idMap[key]) {
      [organization] = await fetchByIds<IOrganization>(fhirBaseURL, 'Organization', [idMap[key]]);
    } else {
      organization = await postPutOrganization(fhirBaseURL, generateOrgPayload(resolved));
      if (!organization.id)
        throw new Error('The server did not return an id for the new organization.');
      record(idMap, key, organization.id);
    }

    // 2. practitioner assignments
    const practitioners = await fetchByIds<IPractitioner>(
      fhirBaseURL,
      'Practitioner',
      members.map((m) => stripPrefix(m, 'Practitioner'))
    );
    await updatePractitionerRoles(
      fhirBaseURL,
      resolved,
      { members: [] } as OrganizationFormFields,
      organization,
      practitioners,
      []
    );
    record(idMap, rolesKey, 'done');
  }
}

type Opt = { label: string; value: string };

async function buildOptions(
  rawValues: string[],
  resourceType: string,
  draftNames: Record<string, string>, 
  idMap: IdMap,
  lookup: (refs: string[]) => Promise<unknown[]>
): Promise<Opt[]> {
  // only resources picked from the server dropdown need a lookup, and only for their display name
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

export async function submitWizard(args: SubmitWizardArgs) {
  const idMap = loadIdMap();
  await submitLocations(args, idMap);
  await submitUsers(args, idMap);
  await submitOrganizations(args, idMap);
  await submitCareTeams(args, idMap);
}
