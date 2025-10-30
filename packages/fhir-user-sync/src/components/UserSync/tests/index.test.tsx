import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UserSync } from '../index';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@opensrp/store';
import * as syncService from '../../../helpers/syncService';
import type { SyncProgress } from '../../../helpers/syncService';

// Mock the sync service
jest.mock('../../../helpers/syncService');

const mockSyncService = syncService as jest.Mocked<typeof syncService>;

describe('UserSync component', () => {
  const props = {
    fhirBaseURL: 'https://fhir.example.com/fhir',
    keycloakBaseURL: 'https://keycloak.example.com/auth/admin/realms/test',
  };

  const mockUserStatuses = [
    {
      userId: 'user1',
      username: 'john.doe',
      hasPractitioner: false,
      hasGroup: true,
      hasPractitionerRole: false,
      needsSync: true,
    },
    {
      userId: 'user2',
      username: 'jane.smith',
      hasPractitioner: true,
      hasGroup: false,
      hasPractitionerRole: true,
      needsSync: true,
    },
    {
      userId: 'user3',
      username: 'bob.jones',
      hasPractitioner: true,
      hasGroup: true,
      hasPractitionerRole: true,
      needsSync: false,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <UserSync {...props} />
        </BrowserRouter>
      </Provider>
    );
  });

  it('renders the title and description', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <UserSync {...props} />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText(/User Sync/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Keycloak User to FHIR Resources Synchronization/i)
    ).toBeInTheDocument();
  });

  it('renders the start synchronization button in idle state', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <UserSync {...props} />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByRole('button', { name: /Start Synchronization/i })).toBeInTheDocument();
  });

  it('shows scanning progress when sync is initiated with users needing sync', async () => {
    mockSyncService.scanUsers.mockResolvedValue(mockUserStatuses);
    mockSyncService.syncAllUsers.mockResolvedValue({
      synced: 2,
      failed: 0,
    });

    const { getByRole } = render(
      <Provider store={store}>
        <BrowserRouter>
          <UserSync {...props} />
        </BrowserRouter>
      </Provider>
    );

    const startButton = getByRole('button', { name: /Start Synchronization/i });
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(screen.getByText(/Scanning Keycloak Users/i)).toBeInTheDocument();
    });

    // The sync process completes after scanning, showing completed state
    await waitFor(() => {
      expect(screen.getByText(/Synchronization Completed/i)).toBeInTheDocument();
    });
  });

  it('displays completed status with statistics when sync completes successfully', async () => {
    mockSyncService.scanUsers.mockResolvedValue(mockUserStatuses);
    mockSyncService.syncAllUsers.mockResolvedValue({
      synced: 2,
      failed: 0,
    });

    const { getByRole } = render(
      <Provider store={store}>
        <BrowserRouter>
          <UserSync {...props} />
        </BrowserRouter>
      </Provider>
    );

    fireEvent.click(getByRole('button', { name: /Start Synchronization/i }));

    await waitFor(() => {
      expect(screen.getByText(/Synchronization Completed/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Total Users Scanned/i)).toBeInTheDocument();
    expect(screen.getByText(/Users Needing Sync/i)).toBeInTheDocument();
    expect(screen.getByText(/Successfully Synced/i)).toBeInTheDocument();
    expect(screen.getByText(/Failed/i)).toBeInTheDocument();
  });

  it('displays users missing resources when sync finds users needing sync', async () => {
    mockSyncService.scanUsers.mockResolvedValue(mockUserStatuses);
    mockSyncService.syncAllUsers.mockResolvedValue({
      synced: 2,
      failed: 0,
    });

    const { getByRole } = render(
      <Provider store={store}>
        <BrowserRouter>
          <UserSync {...props} />
        </BrowserRouter>
      </Provider>
    );

    fireEvent.click(getByRole('button', { name: /Start Synchronization/i }));

    await waitFor(() => {
      expect(screen.getByText(/Users Missing Resources/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/john.doe/)).toBeInTheDocument();
    expect(screen.getByText(/jane.smith/)).toBeInTheDocument();
  });

  it('shows "All users already have required FHIR resources" when no users need sync', async () => {
    const usersWithAllResources = [
      {
        userId: 'user1',
        username: 'john.doe',
        hasPractitioner: true,
        hasGroup: true,
        hasPractitionerRole: true,
        needsSync: false,
      },
    ];

    mockSyncService.scanUsers.mockResolvedValue(usersWithAllResources);
    mockSyncService.syncAllUsers.mockResolvedValue({
      synced: 0,
      failed: 0,
    });

    const { getByRole } = render(
      <Provider store={store}>
        <BrowserRouter>
          <UserSync {...props} />
        </BrowserRouter>
      </Provider>
    );

    fireEvent.click(getByRole('button', { name: /Start Synchronization/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/All users already have the required FHIR resources/i)
      ).toBeInTheDocument();
    });
  });

  it('displays error state when sync fails', async () => {
    mockSyncService.scanUsers.mockRejectedValue(new Error('Network error'));

    const { getByRole } = render(
      <Provider store={store}>
        <BrowserRouter>
          <UserSync {...props} />
        </BrowserRouter>
      </Provider>
    );

    fireEvent.click(getByRole('button', { name: /Start Synchronization/i }));

    await waitFor(() => {
      expect(screen.getByText(/Synchronization Error/i)).toBeInTheDocument();
    });
  });

  it('shows try again button in error state and resets state on click', async () => {
    mockSyncService.scanUsers.mockRejectedValue(new Error('Network error'));

    const { getByRole } = render(
      <Provider store={store}>
        <BrowserRouter>
          <UserSync {...props} />
        </BrowserRouter>
      </Provider>
    );

    // First sync attempt fails
    fireEvent.click(getByRole('button', { name: /Start Synchronization/i }));

    await waitFor(() => {
      expect(screen.getByText(/Synchronization Error/i)).toBeInTheDocument();
    });

    // Try Again button exists in error state
    expect(screen.getByRole('button', { name: /Try Again/i })).toBeInTheDocument();

    // Click Try Again button to reset state
    fireEvent.click(screen.getByRole('button', { name: /Try Again/i }));

    // After clicking Try Again, should return to idle state
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Start Synchronization/i })).toBeInTheDocument();
    });
  });

  it('shows run again button in completed state and resets state on click', async () => {
    mockSyncService.scanUsers.mockResolvedValue(mockUserStatuses);
    mockSyncService.syncAllUsers.mockResolvedValue({
      synced: 2,
      failed: 0,
    });

    const { getByRole } = render(
      <Provider store={store}>
        <BrowserRouter>
          <UserSync {...props} />
        </BrowserRouter>
      </Provider>
    );

    // First sync
    fireEvent.click(getByRole('button', { name: /Start Synchronization/i }));

    await waitFor(() => {
      expect(screen.getByText(/Synchronization Completed/i)).toBeInTheDocument();
    });

    // Run Again button exists in completed state
    expect(screen.getByRole('button', { name: /Run Again/i })).toBeInTheDocument();

    // Click Run Again button to reset state
    fireEvent.click(screen.getByRole('button', { name: /Run Again/i }));

    // After clicking Run Again, should return to idle state
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Start Synchronization/i })).toBeInTheDocument();
    });
  });

  it('displays current user being processed during scanning', async () => {
    let scanCallback: ((progress: SyncProgress) => void) | undefined;

    mockSyncService.scanUsers.mockImplementation((_keycloakUrl, _fhirUrl, callback) => {
      scanCallback = callback;
      return Promise.resolve(mockUserStatuses);
    });

    const { getByRole } = render(
      <Provider store={store}>
        <BrowserRouter>
          <UserSync {...props} />
        </BrowserRouter>
      </Provider>
    );

    fireEvent.click(getByRole('button', { name: /Start Synchronization/i }));

    // Simulate progress updates
    if (scanCallback) {
      scanCallback({
        total: 3,
        scanned: 1,
        needsSync: 1,
        synced: 0,
        failed: 0,
        currentUser: 'john.doe',
        status: 'scanning',
      });
    }

    await waitFor(() => {
      expect(screen.getByText(/Current user/i)).toBeInTheDocument();
    });
  });

  it('displays synced and failed statistics during syncing', async () => {
    let syncCallback: ((progress: SyncProgress) => void) | undefined;

    mockSyncService.scanUsers.mockResolvedValue(mockUserStatuses);
    mockSyncService.syncAllUsers.mockImplementation((_keycloakUrl, _fhirUrl, _users, callback) => {
      syncCallback = callback;
      return Promise.resolve({
        synced: 2,
        failed: 0,
      });
    });

    const { getByRole } = render(
      <Provider store={store}>
        <BrowserRouter>
          <UserSync {...props} />
        </BrowserRouter>
      </Provider>
    );

    fireEvent.click(getByRole('button', { name: /Start Synchronization/i }));

    await waitFor(() => {
      expect(screen.getByText(/Synchronizing Users/i)).toBeInTheDocument();
    });

    // Simulate sync progress update
    if (syncCallback) {
      syncCallback({
        total: 2,
        scanned: 2,
        needsSync: 2,
        synced: 1,
        failed: 0,
        currentUser: 'jane.smith',
        status: 'syncing',
      });
    }

    await waitFor(() => {
      const syncedText = screen.getAllByText(/Synced/i);
      expect(syncedText.length).toBeGreaterThan(0);
    });
  });

  it('calls scanUsers with correct parameters', async () => {
    mockSyncService.scanUsers.mockResolvedValue([]);
    mockSyncService.syncAllUsers.mockResolvedValue({
      synced: 0,
      failed: 0,
    });

    const { getByRole } = render(
      <Provider store={store}>
        <BrowserRouter>
          <UserSync {...props} />
        </BrowserRouter>
      </Provider>
    );

    fireEvent.click(getByRole('button', { name: /Start Synchronization/i }));

    await waitFor(() => {
      expect(mockSyncService.scanUsers).toHaveBeenCalledWith(
        props.keycloakBaseURL,
        props.fhirBaseURL,
        expect.any(Function)
      );
    });
  });

  it('calls syncAllUsers with correct parameters', async () => {
    mockSyncService.scanUsers.mockResolvedValue(mockUserStatuses);
    mockSyncService.syncAllUsers.mockResolvedValue({
      synced: 2,
      failed: 0,
    });

    const { getByRole } = render(
      <Provider store={store}>
        <BrowserRouter>
          <UserSync {...props} />
        </BrowserRouter>
      </Provider>
    );

    fireEvent.click(getByRole('button', { name: /Start Synchronization/i }));

    await waitFor(() => {
      expect(mockSyncService.syncAllUsers).toHaveBeenCalledWith(
        props.keycloakBaseURL,
        props.fhirBaseURL,
        expect.arrayContaining([
          expect.objectContaining({
            userId: 'user1',
            needsSync: true,
          }),
        ]),
        expect.any(Function)
      );
    });
  });
});
