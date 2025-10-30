import { KeycloakService } from '@opensrp/keycloak-service';
import { KEYCLOAK_URL_USERS } from '@opensrp/user-management';
import { FHIRServiceClass, getResourcesFromBundle, IdentifierUseCodes } from '@opensrp/react-utils';
import { IPractitioner } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitioner';
import { IGroup } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IGroup';
import { IPractitionerRole } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitionerRole';
import { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';
import { v4 } from 'uuid';
import { keycloakIdentifierCoding } from '@opensrp/fhir-helpers';
import {
  practitionerResourceType,
  groupResourceType,
  practitionerRoleResourceType,
  PRACTITIONER_USER_TYPE_CODE,
} from '../constants';

export interface KeycloakUser {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  enabled: boolean;
  attributes?: {
    nationalId?: string[];
    phoneNumber?: string[];
  };
}

export interface UserSyncStatus {
  userId: string;
  username: string;
  hasPractitioner: boolean;
  hasGroup: boolean;
  hasPractitionerRole: boolean;
  needsSync: boolean;
}

export interface SyncProgress {
  total: number;
  scanned: number;
  needsSync: number;
  synced: number;
  failed: number;
  currentUser?: string;
  status: 'idle' | 'scanning' | 'syncing' | 'completed' | 'error';
}

/**
 * Get all Keycloak users with pagination
 * Fetches users in batches of 100 to avoid timeouts and memory issues
 *
 * @param keycloakBaseURL - Keycloak API base URL
 * @returns Promise resolving to array of Keycloak users
 */
export const getAllKeycloakUsers = async (keycloakBaseURL: string): Promise<KeycloakUser[]> => {
  const usersService = new KeycloakService(KEYCLOAK_URL_USERS, keycloakBaseURL);
  const allUsers: KeycloakUser[] = [];
  let offset = 0;
  const pageSize = 100;
  let hasMore = true;

  while (hasMore) {
    try {
      const users: KeycloakUser[] = await usersService.list({
        first: offset,
        max: pageSize,
      });

      if (users.length > 0) {
        allUsers.push(...users);

        // Stop if we got fewer than requested (last page)
        if (users.length < pageSize) {
          hasMore = false;
        } else {
          offset += users.length;
        }
      } else {
        hasMore = false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to fetch Keycloak users: ${errorMessage}`);
    }
  }

  return allUsers;
};

/**
 * Check if a practitioner exists for a given Keycloak user ID
 *
 * @param fhirBaseURL - FHIR server base URL
 * @param keycloakUserId - Keycloak user ID to search for
 * @returns Promise resolving to practitioner or null if not found
 */
export const checkPractitionerExists = async (
  fhirBaseURL: string,
  keycloakUserId: string
): Promise<IPractitioner | null> => {
  const service = new FHIRServiceClass<IBundle>(fhirBaseURL, practitionerResourceType);
  const bundle = await service.list({ identifier: keycloakUserId });
  const practitioners = getResourcesFromBundle<IPractitioner>(bundle);
  return practitioners.length > 0 ? practitioners[0] : null;
};

/**
 * Check if a group exists for a given Keycloak user ID
 *
 * @param fhirBaseURL - FHIR server base URL
 * @param keycloakUserId - Keycloak user ID to search for
 * @returns Promise resolving to group or null if not found
 */
export const checkGroupExists = async (
  fhirBaseURL: string,
  keycloakUserId: string
): Promise<IGroup | null> => {
  const service = new FHIRServiceClass<IBundle>(fhirBaseURL, groupResourceType);
  const bundle = await service.list({ identifier: keycloakUserId });
  const groups = getResourcesFromBundle<IGroup>(bundle);
  return groups.length > 0 ? groups[0] : null;
};

/**
 * Check if a practitioner role exists for a given Keycloak user ID
 *
 * @param fhirBaseURL - FHIR server base URL
 * @param keycloakUserId - Keycloak user ID to search for
 * @returns Promise resolving to practitioner role or null if not found
 */
export const checkPractitionerRoleExists = async (
  fhirBaseURL: string,
  keycloakUserId: string
): Promise<IPractitionerRole | null> => {
  const service = new FHIRServiceClass<IBundle>(fhirBaseURL, practitionerRoleResourceType);
  const bundle = await service.list({ identifier: keycloakUserId });
  const roles = getResourcesFromBundle<IPractitionerRole>(bundle);
  return roles.length > 0 ? roles[0] : null;
};

/**
 * Scan all users and check their resource status
 *
 * @param keycloakBaseURL - Keycloak API base URL
 * @param fhirBaseURL - FHIR server base URL
 * @param onProgress - Optional callback for progress updates
 * @returns Promise resolving to array of user sync statuses
 */
export const scanUsers = async (
  keycloakBaseURL: string,
  fhirBaseURL: string,
  onProgress?: (progress: SyncProgress) => void
): Promise<UserSyncStatus[]> => {
  const users = await getAllKeycloakUsers(keycloakBaseURL);
  const statuses: UserSyncStatus[] = [];
  let needsSyncCount = 0;

  for (let i = 0; i < users.length; i++) {
    const user = users[i];

    const [practitioner, group, practitionerRole] = await Promise.all([
      checkPractitionerExists(fhirBaseURL, user.id),
      checkGroupExists(fhirBaseURL, user.id),
      checkPractitionerRoleExists(fhirBaseURL, user.id),
    ]);

    const hasPractitioner = !!practitioner;
    const hasGroup = !!group;
    const hasPractitionerRole = !!practitionerRole;
    const needsSync = !hasPractitioner || !hasGroup || !hasPractitionerRole;

    if (needsSync) {
      needsSyncCount++;
    }

    const status: UserSyncStatus = {
      userId: user.id,
      username: user.username,
      hasPractitioner,
      hasGroup,
      hasPractitionerRole,
      needsSync,
    };

    statuses.push(status);

    if (onProgress) {
      onProgress({
        total: users.length,
        scanned: i + 1,
        needsSync: needsSyncCount,
        synced: 0,
        failed: 0,
        currentUser: user.username,
        status: 'scanning',
      });
    }
  }

  return statuses;
};

/**
 * Create practitioner resource
 *
 * @param fhirBaseURL - FHIR server base URL
 * @param user - Keycloak user data
 * @param existingPractitioner - Existing practitioner to update (optional)
 * @returns Promise resolving to created or updated practitioner
 */
const createPractitioner = async (
  fhirBaseURL: string,
  user: KeycloakUser,
  existingPractitioner?: IPractitioner
): Promise<IPractitioner> => {
  const practitionerId = existingPractitioner?.id || v4();

  const payload: IPractitioner = {
    resourceType: practitionerResourceType,
    id: practitionerId,
    identifier: [
      {
        use: IdentifierUseCodes.OFFICIAL,
        value: practitionerId,
      },
      {
        use: IdentifierUseCodes.SECONDARY,
        type: {
          coding: [keycloakIdentifierCoding],
          text: 'Keycloak user ID',
        },
        value: user.id,
      },
    ],
    active: user.enabled,
    name: [
      {
        use: IdentifierUseCodes.OFFICIAL,
        family: user.lastName || user.username,
        given: user.firstName ? [user.firstName] : [],
      },
    ],
    telecom: user.email
      ? [
          {
            system: 'email',
            value: user.email,
          },
        ]
      : [],
  };

  const service = new FHIRServiceClass<IPractitioner>(fhirBaseURL, practitionerResourceType);
  return service.update(payload);
};

/**
 * Create group resource
 *
 * @param fhirBaseURL - FHIR server base URL
 * @param user - Keycloak user data
 * @param practitionerId - ID of the associated practitioner
 * @param existingGroup - Existing group to update (optional)
 * @returns Promise resolving to created or updated group
 */
const createGroup = async (
  fhirBaseURL: string,
  user: KeycloakUser,
  practitionerId: string,
  existingGroup?: IGroup
): Promise<IGroup> => {
  const groupId = existingGroup?.id || v4();

  const payload: IGroup = {
    resourceType: groupResourceType,
    id: groupId,
    identifier: [
      {
        use: IdentifierUseCodes.OFFICIAL,
        value: groupId,
      },
      {
        use: IdentifierUseCodes.SECONDARY,
        type: {
          coding: [keycloakIdentifierCoding],
          text: 'Keycloak user ID',
        },
        value: user.id,
      },
    ],
    active: user.enabled,
    type: 'practitioner',
    actual: true,
    code: {
      coding: [
        {
          system: 'http://snomed.info/sct',
          code: PRACTITIONER_USER_TYPE_CODE,
          display: 'Assigned practitioner',
        },
      ],
    },
    name: `${user.firstName || ''} ${user.lastName || user.username}`.trim(),
    member: [
      {
        entity: {
          reference: `Practitioner/${practitionerId}`,
        },
      },
    ],
  };

  const service = new FHIRServiceClass<IGroup>(fhirBaseURL, groupResourceType);
  return service.update(payload);
};

/**
 * Create practitioner role resource
 *
 * @param fhirBaseURL - FHIR server base URL
 * @param user - Keycloak user data
 * @param practitionerId - ID of the associated practitioner
 * @param practitionerName - Display name for the practitioner
 * @param existingRole - Existing practitioner role to update (optional)
 * @returns Promise resolving to created or updated practitioner role
 */
const createPractitionerRole = async (
  fhirBaseURL: string,
  user: KeycloakUser,
  practitionerId: string,
  practitionerName: string,
  existingRole?: IPractitionerRole
): Promise<IPractitionerRole> => {
  const roleId = existingRole?.id || v4();

  const payload: IPractitionerRole = {
    resourceType: practitionerRoleResourceType,
    id: roleId,
    identifier: [
      {
        use: IdentifierUseCodes.OFFICIAL,
        value: roleId,
      },
      {
        use: IdentifierUseCodes.SECONDARY,
        type: {
          coding: [keycloakIdentifierCoding],
          text: 'Keycloak user ID',
        },
        value: user.id,
      },
    ],
    active: user.enabled,
    practitioner: {
      reference: `Practitioner/${practitionerId}`,
      display: practitionerName,
    },
    code: [
      {
        coding: [
          {
            system: 'http://snomed.info/sct',
            code: PRACTITIONER_USER_TYPE_CODE,
            display: 'Assigned practitioner',
          },
        ],
      },
    ],
  };

  const service = new FHIRServiceClass<IPractitionerRole>(
    fhirBaseURL,
    practitionerRoleResourceType
  );
  return service.update(payload);
};

/**
 * Sync a single user - create missing resources
 *
 * @param keycloakBaseURL - Keycloak API base URL
 * @param fhirBaseURL - FHIR server base URL
 * @param user - Keycloak user data
 * @param status - Current sync status for the user
 * @returns Promise that resolves when sync is complete
 */
export const syncUser = async (
  keycloakBaseURL: string,
  fhirBaseURL: string,
  user: KeycloakUser,
  status: UserSyncStatus
): Promise<void> => {
  // Get existing resources
  const [existingPractitioner, existingGroup, existingRole] = await Promise.all([
    status.hasPractitioner ? checkPractitionerExists(fhirBaseURL, user.id) : Promise.resolve(null),
    status.hasGroup ? checkGroupExists(fhirBaseURL, user.id) : Promise.resolve(null),
    status.hasPractitionerRole
      ? checkPractitionerRoleExists(fhirBaseURL, user.id)
      : Promise.resolve(null),
  ]);

  // Create practitioner if missing
  let practitioner = existingPractitioner;
  if (!status.hasPractitioner) {
    practitioner = await createPractitioner(fhirBaseURL, user);
  }

  if (!practitioner || !practitioner.id) {
    throw new Error(`Failed to obtain valid Practitioner for user ${user.username} (${user.id})`);
  }

  const practitionerId = practitioner.id;

  const practitionerName = practitioner.name?.[0]
    ? `${practitioner.name[0].given?.join(' ') || ''} ${practitioner.name[0].family || ''}`.trim()
    : user.username;

  // Create group and practitioner role in parallel
  const promises: Promise<unknown>[] = [];

  if (!status.hasGroup) {
    promises.push(createGroup(fhirBaseURL, user, practitionerId, existingGroup || undefined));
  }

  if (!status.hasPractitionerRole) {
    promises.push(
      createPractitionerRole(
        fhirBaseURL,
        user,
        practitionerId,
        practitionerName,
        existingRole || undefined
      )
    );
  }

  await Promise.all(promises);
};

/**
 * Sync all users that need syncing
 *
 * @param keycloakBaseURL - Keycloak API base URL
 * @param fhirBaseURL - FHIR server base URL
 * @param usersToSync - Array of users that need syncing
 * @param onProgress - Optional callback for progress updates
 * @returns Promise resolving to object with synced and failed counts
 */
export const syncAllUsers = async (
  keycloakBaseURL: string,
  fhirBaseURL: string,
  usersToSync: UserSyncStatus[],
  onProgress?: (progress: SyncProgress) => void
): Promise<{ synced: number; failed: number }> => {
  const users = await getAllKeycloakUsers(keycloakBaseURL);
  const userMap = new Map(users.map((u) => [u.id, u]));

  let synced = 0;
  let failed = 0;

  for (let i = 0; i < usersToSync.length; i++) {
    const status = usersToSync[i];
    const user = userMap.get(status.userId);

    if (!user) {
      failed++;
      continue;
    }

    try {
      await syncUser(keycloakBaseURL, fhirBaseURL, user, status);
      synced++;

      if (onProgress) {
        onProgress({
          total: usersToSync.length,
          scanned: usersToSync.length,
          needsSync: usersToSync.length,
          synced,
          failed,
          currentUser: status.username,
          status: 'syncing',
        });
      }
    } catch (error) {
      failed++;
      // Error is tracked in the failed count and progress callback

      if (onProgress) {
        onProgress({
          total: usersToSync.length,
          scanned: usersToSync.length,
          needsSync: usersToSync.length,
          synced,
          failed,
          currentUser: status.username,
          status: 'syncing',
        });
      }
    }
  }

  return { synced, failed };
};
