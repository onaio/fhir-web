import {
  getAllKeycloakUsers,
  checkPractitionerExists,
  checkGroupExists,
  checkPractitionerRoleExists,
  scanUsers,
  syncUser,
  syncAllUsers,
} from '../syncService';
import { KeycloakService } from '@opensrp/keycloak-service';
import { FHIRServiceClass, getResourcesFromBundle } from '@opensrp/react-utils';

// Mock dependencies
jest.mock('@opensrp/keycloak-service');
jest.mock('@opensrp/react-utils');

const MockKeycloakService = KeycloakService as jest.MockedClass<typeof KeycloakService>;
const MockFHIRServiceClass = FHIRServiceClass as jest.MockedClass<typeof FHIRServiceClass>;
const mockGetResourcesFromBundle = getResourcesFromBundle as jest.MockedFunction<
  typeof getResourcesFromBundle
>;

describe('syncService', () => {
  const mockKeycloakBaseURL = 'https://keycloak.example.com';
  const mockFhirBaseURL = 'https://fhir.example.com';

  const mockKeycloakUser = {
    id: 'user-1',
    username: 'john.doe',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    enabled: true,
  };

  const mockKeycloakUser2 = {
    id: 'user-2',
    username: 'jane.smith',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    enabled: true,
  };

  const mockPractitioner = {
    id: 'practitioner-1',
    resourceType: 'Practitioner' as const,
  };

  const mockGroup = {
    id: 'group-1',
    resourceType: 'Group' as const,
  };

  const mockPractitionerRole = {
    id: 'role-1',
    resourceType: 'PractitionerRole' as const,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllKeycloakUsers', () => {
    it('should fetch all users from Keycloak with pagination', async () => {
      const mockListMethod = jest.fn().mockResolvedValue([mockKeycloakUser, mockKeycloakUser2]);
      MockKeycloakService.prototype.list = mockListMethod;

      const result = await getAllKeycloakUsers(mockKeycloakBaseURL);

      expect(result).toEqual([mockKeycloakUser, mockKeycloakUser2]);
      expect(mockListMethod).toHaveBeenCalledWith({ first: 0, max: 100 });
    });

    it('should handle pagination with multiple pages', async () => {
      const page1 = Array(100)
        .fill(null)
        .map((_, i) => ({ id: `user-${i}`, username: `user${i}`, enabled: true }));
      const page2 = [mockKeycloakUser];

      const mockListMethod = jest.fn().mockResolvedValueOnce(page1).mockResolvedValueOnce(page2);
      MockKeycloakService.prototype.list = mockListMethod;

      const result = await getAllKeycloakUsers(mockKeycloakBaseURL);

      expect(result).toHaveLength(101);
      expect(mockListMethod).toHaveBeenCalledTimes(2);
      expect(mockListMethod).toHaveBeenNthCalledWith(1, { first: 0, max: 100 });
      expect(mockListMethod).toHaveBeenNthCalledWith(2, { first: 100, max: 100 });
    });

    it('should handle empty user list', async () => {
      const mockListMethod = jest.fn().mockResolvedValue([]);
      MockKeycloakService.prototype.list = mockListMethod;

      const result = await getAllKeycloakUsers(mockKeycloakBaseURL);

      expect(result).toEqual([]);
    });

    it('should handle errors from Keycloak service', async () => {
      const mockListMethod = jest.fn().mockRejectedValue(new Error('Network error'));
      MockKeycloakService.prototype.list = mockListMethod;

      await expect(getAllKeycloakUsers(mockKeycloakBaseURL)).rejects.toThrow(
        'Failed to fetch Keycloak users: Network error'
      );
    });
  });

  describe('checkPractitionerExists', () => {
    it('should return practitioner if found', async () => {
      const mockListMethod = jest.fn().mockResolvedValue({
        entry: [{ resource: mockPractitioner }],
      });
      MockFHIRServiceClass.prototype.list = mockListMethod;
      mockGetResourcesFromBundle.mockReturnValue([mockPractitioner]);

      const result = await checkPractitionerExists(mockFhirBaseURL, mockKeycloakUser.id);

      expect(result).toEqual(mockPractitioner);
    });

    it('should return null if practitioner not found', async () => {
      const mockListMethod = jest.fn().mockResolvedValue({
        entry: [],
      });
      MockFHIRServiceClass.prototype.list = mockListMethod;
      mockGetResourcesFromBundle.mockReturnValue([]);

      const result = await checkPractitionerExists(mockFhirBaseURL, mockKeycloakUser.id);

      expect(result).toBeNull();
    });
  });

  describe('checkGroupExists', () => {
    it('should return group if found', async () => {
      const mockListMethod = jest.fn().mockResolvedValue({
        entry: [{ resource: mockGroup }],
      });
      MockFHIRServiceClass.prototype.list = mockListMethod;
      mockGetResourcesFromBundle.mockReturnValue([mockGroup]);

      const result = await checkGroupExists(mockFhirBaseURL, mockKeycloakUser.id);

      expect(result).toEqual(mockGroup);
    });

    it('should return null if group not found', async () => {
      const mockListMethod = jest.fn().mockResolvedValue({
        entry: [],
      });
      MockFHIRServiceClass.prototype.list = mockListMethod;
      mockGetResourcesFromBundle.mockReturnValue([]);

      const result = await checkGroupExists(mockFhirBaseURL, mockKeycloakUser.id);

      expect(result).toBeNull();
    });
  });

  describe('checkPractitionerRoleExists', () => {
    it('should return practitioner role if found', async () => {
      const mockListMethod = jest.fn().mockResolvedValue({
        entry: [{ resource: mockPractitionerRole }],
      });
      MockFHIRServiceClass.prototype.list = mockListMethod;
      mockGetResourcesFromBundle.mockReturnValue([mockPractitionerRole]);

      const result = await checkPractitionerRoleExists(mockFhirBaseURL, mockKeycloakUser.id);

      expect(result).toEqual(mockPractitionerRole);
    });

    it('should return null if practitioner role not found', async () => {
      const mockListMethod = jest.fn().mockResolvedValue({
        entry: [],
      });
      MockFHIRServiceClass.prototype.list = mockListMethod;
      mockGetResourcesFromBundle.mockReturnValue([]);

      const result = await checkPractitionerRoleExists(mockFhirBaseURL, mockKeycloakUser.id);

      expect(result).toBeNull();
    });
  });

  describe('scanUsers', () => {
    it('should scan all users and return their sync status', async () => {
      const mockKeycloakListMethod = jest
        .fn()
        .mockResolvedValue([mockKeycloakUser, mockKeycloakUser2]);
      MockKeycloakService.prototype.list = mockKeycloakListMethod;

      const mockFhirListMethod = jest.fn().mockResolvedValue({
        entry: [],
      });
      MockFHIRServiceClass.prototype.list = mockFhirListMethod;
      mockGetResourcesFromBundle.mockReturnValue([]);

      const result = await scanUsers(mockKeycloakBaseURL, mockFhirBaseURL);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        userId: mockKeycloakUser.id,
        username: mockKeycloakUser.username,
        hasPractitioner: false,
        hasGroup: false,
        hasPractitionerRole: false,
        needsSync: true,
      });
      expect(result[1]).toEqual({
        userId: mockKeycloakUser2.id,
        username: mockKeycloakUser2.username,
        hasPractitioner: false,
        hasGroup: false,
        hasPractitionerRole: false,
        needsSync: true,
      });
    });

    it('should call progress callback during scanning', async () => {
      const mockKeycloakListMethod = jest.fn().mockResolvedValue([mockKeycloakUser]);
      MockKeycloakService.prototype.list = mockKeycloakListMethod;

      const mockFhirListMethod = jest.fn().mockResolvedValue({
        entry: [],
      });
      MockFHIRServiceClass.prototype.list = mockFhirListMethod;
      mockGetResourcesFromBundle.mockReturnValue([]);

      const progressCallback = jest.fn();

      await scanUsers(mockKeycloakBaseURL, mockFhirBaseURL, progressCallback);

      expect(progressCallback).toHaveBeenCalledWith(
        expect.objectContaining({
          total: 1,
          scanned: 1,
          needsSync: 1,
          status: 'scanning',
          currentUser: mockKeycloakUser.username,
        })
      );
    });

    it('should detect users that have all resources', async () => {
      const mockKeycloakListMethod = jest.fn().mockResolvedValue([mockKeycloakUser]);
      MockKeycloakService.prototype.list = mockKeycloakListMethod;

      const mockFhirListMethod = jest
        .fn()
        .mockResolvedValueOnce({ entry: [{ resource: mockPractitioner }] }) // Practitioner found
        .mockResolvedValueOnce({ entry: [{ resource: mockGroup }] }) // Group found
        .mockResolvedValueOnce({ entry: [{ resource: mockPractitionerRole }] }); // Role found

      MockFHIRServiceClass.prototype.list = mockFhirListMethod;
      mockGetResourcesFromBundle
        .mockReturnValueOnce([mockPractitioner])
        .mockReturnValueOnce([mockGroup])
        .mockReturnValueOnce([mockPractitionerRole]);

      const result = await scanUsers(mockKeycloakBaseURL, mockFhirBaseURL);

      expect(result[0].hasPractitioner).toBe(true);
      expect(result[0].hasGroup).toBe(true);
      expect(result[0].hasPractitionerRole).toBe(true);
      expect(result[0].needsSync).toBe(false);
    });

    it('should handle mixed resource states', async () => {
      const mockKeycloakListMethod = jest.fn().mockResolvedValue([mockKeycloakUser]);
      MockKeycloakService.prototype.list = mockKeycloakListMethod;

      const mockFhirListMethod = jest
        .fn()
        .mockResolvedValueOnce({ entry: [{ resource: mockPractitioner }] }) // Practitioner found
        .mockResolvedValueOnce({ entry: [] }) // Group not found
        .mockResolvedValueOnce({ entry: [{ resource: mockPractitionerRole }] }); // Role found

      MockFHIRServiceClass.prototype.list = mockFhirListMethod;
      mockGetResourcesFromBundle
        .mockReturnValueOnce([mockPractitioner])
        .mockReturnValueOnce([])
        .mockReturnValueOnce([mockPractitionerRole]);

      const result = await scanUsers(mockKeycloakBaseURL, mockFhirBaseURL);

      expect(result[0].hasPractitioner).toBe(true);
      expect(result[0].hasGroup).toBe(false);
      expect(result[0].hasPractitionerRole).toBe(true);
      expect(result[0].needsSync).toBe(true);
    });

    it('should handle no progress callback', async () => {
      const mockKeycloakListMethod = jest.fn().mockResolvedValue([mockKeycloakUser]);
      MockKeycloakService.prototype.list = mockKeycloakListMethod;

      const mockFhirListMethod = jest.fn().mockResolvedValue({
        entry: [],
      });
      MockFHIRServiceClass.prototype.list = mockFhirListMethod;
      mockGetResourcesFromBundle.mockReturnValue([]);

      // Should not throw when no callback is provided
      const result = await scanUsers(mockKeycloakBaseURL, mockFhirBaseURL);

      expect(result).toHaveLength(1);
    });
  });

  describe('syncUser', () => {
    it('should sync a user with missing resources', async () => {
      const mockUpdateMethod = jest.fn().mockResolvedValue(mockPractitioner);
      MockFHIRServiceClass.prototype.update = mockUpdateMethod;

      const mockFhirListMethod = jest.fn().mockResolvedValue({
        entry: [],
      });
      MockFHIRServiceClass.prototype.list = mockFhirListMethod;
      mockGetResourcesFromBundle.mockReturnValue([]);

      const status = {
        userId: mockKeycloakUser.id,
        username: mockKeycloakUser.username,
        hasPractitioner: false,
        hasGroup: false,
        hasPractitionerRole: false,
        needsSync: true,
      };

      await syncUser(mockKeycloakBaseURL, mockFhirBaseURL, mockKeycloakUser, status);

      // Should have called update to create Practitioner, Group, and PractitionerRole
      expect(mockUpdateMethod).toHaveBeenCalledTimes(3);
    });

    it('should throw error if practitioner creation fails', async () => {
      const mockUpdateMethod = jest.fn().mockResolvedValue(null);
      MockFHIRServiceClass.prototype.update = mockUpdateMethod;

      const mockFhirListMethod = jest.fn().mockResolvedValue({
        entry: [],
      });
      MockFHIRServiceClass.prototype.list = mockFhirListMethod;
      mockGetResourcesFromBundle.mockReturnValue([]);

      const status = {
        userId: mockKeycloakUser.id,
        username: mockKeycloakUser.username,
        hasPractitioner: false,
        hasGroup: false,
        hasPractitionerRole: false,
        needsSync: true,
      };

      await expect(
        syncUser(mockKeycloakBaseURL, mockFhirBaseURL, mockKeycloakUser, status)
      ).rejects.toThrow(
        `Failed to obtain valid Practitioner for user ${mockKeycloakUser.username}`
      );
    });

    it('should skip creating existing resources', async () => {
      const mockUpdateMethod = jest.fn().mockResolvedValue(mockPractitioner);
      MockFHIRServiceClass.prototype.update = mockUpdateMethod;

      const mockFhirListMethod = jest
        .fn()
        .mockResolvedValueOnce({ entry: [{ resource: mockPractitioner }] }) // Check practitioner
        .mockResolvedValueOnce({ entry: [] }) // Check group
        .mockResolvedValueOnce({ entry: [] }); // Check practitioner role

      MockFHIRServiceClass.prototype.list = mockFhirListMethod;
      mockGetResourcesFromBundle
        .mockReturnValueOnce([mockPractitioner])
        .mockReturnValueOnce([])
        .mockReturnValueOnce([]);

      const status = {
        userId: mockKeycloakUser.id,
        username: mockKeycloakUser.username,
        hasPractitioner: true,
        hasGroup: false,
        hasPractitionerRole: false,
        needsSync: true,
      };

      await syncUser(mockKeycloakBaseURL, mockFhirBaseURL, mockKeycloakUser, status);

      // Should only create Group and PractitionerRole, not Practitioner
      expect(mockUpdateMethod).toHaveBeenCalledTimes(2);
    });
  });

  describe('syncAllUsers', () => {
    it('should sync multiple users and report results', async () => {
      const mockKeycloakListMethod = jest
        .fn()
        .mockResolvedValue([mockKeycloakUser, mockKeycloakUser2]);
      MockKeycloakService.prototype.list = mockKeycloakListMethod;

      const mockUpdateMethod = jest.fn().mockResolvedValue(mockPractitioner);
      MockFHIRServiceClass.prototype.update = mockUpdateMethod;

      const mockFhirListMethod = jest.fn().mockResolvedValue({
        entry: [],
      });
      MockFHIRServiceClass.prototype.list = mockFhirListMethod;
      mockGetResourcesFromBundle.mockReturnValue([]);

      const usersToSync = [
        {
          userId: mockKeycloakUser.id,
          username: mockKeycloakUser.username,
          hasPractitioner: false,
          hasGroup: false,
          hasPractitionerRole: false,
          needsSync: true,
        },
        {
          userId: mockKeycloakUser2.id,
          username: mockKeycloakUser2.username,
          hasPractitioner: false,
          hasGroup: false,
          hasPractitionerRole: false,
          needsSync: true,
        },
      ];

      const result = await syncAllUsers(mockKeycloakBaseURL, mockFhirBaseURL, usersToSync);

      expect(result.synced).toBe(2);
      expect(result.failed).toBe(0);
    });

    it('should call progress callback during sync', async () => {
      const mockKeycloakListMethod = jest.fn().mockResolvedValue([mockKeycloakUser]);
      MockKeycloakService.prototype.list = mockKeycloakListMethod;

      const mockUpdateMethod = jest.fn().mockResolvedValue(mockPractitioner);
      MockFHIRServiceClass.prototype.update = mockUpdateMethod;

      const mockFhirListMethod = jest.fn().mockResolvedValue({
        entry: [],
      });
      MockFHIRServiceClass.prototype.list = mockFhirListMethod;
      mockGetResourcesFromBundle.mockReturnValue([]);

      const progressCallback = jest.fn();

      const usersToSync = [
        {
          userId: mockKeycloakUser.id,
          username: mockKeycloakUser.username,
          hasPractitioner: false,
          hasGroup: false,
          hasPractitionerRole: false,
          needsSync: true,
        },
      ];

      await syncAllUsers(mockKeycloakBaseURL, mockFhirBaseURL, usersToSync, progressCallback);

      expect(progressCallback).toHaveBeenCalledWith(
        expect.objectContaining({
          synced: 1,
          failed: 0,
          status: 'syncing',
          currentUser: mockKeycloakUser.username,
        })
      );
    });

    it('should handle sync failures gracefully', async () => {
      const mockKeycloakListMethod = jest
        .fn()
        .mockResolvedValue([mockKeycloakUser, mockKeycloakUser2]);
      MockKeycloakService.prototype.list = mockKeycloakListMethod;

      const mockUpdateMethod = jest
        .fn()
        // First user: 3 successful updates (Practitioner, Group, PractitionerRole)
        .mockResolvedValueOnce(mockPractitioner)
        .mockResolvedValueOnce(mockGroup)
        .mockResolvedValueOnce(mockPractitionerRole)
        // Second user: fails on first update (Practitioner creation)
        .mockRejectedValueOnce(new Error('FHIR error'));

      MockFHIRServiceClass.prototype.update = mockUpdateMethod;

      const mockFhirListMethod = jest.fn().mockResolvedValue({
        entry: [],
      });
      MockFHIRServiceClass.prototype.list = mockFhirListMethod;
      mockGetResourcesFromBundle.mockReturnValue([]);

      const usersToSync = [
        {
          userId: mockKeycloakUser.id,
          username: mockKeycloakUser.username,
          hasPractitioner: false,
          hasGroup: false,
          hasPractitionerRole: false,
          needsSync: true,
        },
        {
          userId: mockKeycloakUser2.id,
          username: mockKeycloakUser2.username,
          hasPractitioner: false,
          hasGroup: false,
          hasPractitionerRole: false,
          needsSync: true,
        },
      ];

      const result = await syncAllUsers(mockKeycloakBaseURL, mockFhirBaseURL, usersToSync);

      expect(result.synced).toBe(1);
      expect(result.failed).toBe(1);
    });

    it('should handle missing user in sync list', async () => {
      const mockKeycloakListMethod = jest.fn().mockResolvedValue([mockKeycloakUser]);
      MockKeycloakService.prototype.list = mockKeycloakListMethod;

      const usersToSync = [
        {
          userId: 'non-existent-user',
          username: 'ghost.user',
          hasPractitioner: false,
          hasGroup: false,
          hasPractitionerRole: false,
          needsSync: true,
        },
      ];

      const result = await syncAllUsers(mockKeycloakBaseURL, mockFhirBaseURL, usersToSync);

      expect(result.synced).toBe(0);
      expect(result.failed).toBe(1);
    });

    it('should handle empty sync list', async () => {
      const mockKeycloakListMethod = jest.fn().mockResolvedValue([mockKeycloakUser]);
      MockKeycloakService.prototype.list = mockKeycloakListMethod;

      const result = await syncAllUsers(mockKeycloakBaseURL, mockFhirBaseURL, []);

      expect(result.synced).toBe(0);
      expect(result.failed).toBe(0);
    });
  });
});
