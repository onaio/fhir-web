import React, { useState } from 'react';
import {
  Button,
  Card,
  Progress,
  Alert,
  Space,
  Typography,
  Divider,
  Statistic,
  Row,
  Col,
} from 'antd';
import { SyncOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Helmet } from 'react-helmet';
import { BodyLayout } from '@opensrp/react-utils';
import { useTranslation } from '../../mls';
import { scanUsers, syncAllUsers, SyncProgress, UserSyncStatus } from '../../helpers/syncService';

const { Title, Text, Paragraph } = Typography;

export interface UserSyncProps {
  fhirBaseURL: string;
  keycloakBaseURL: string;
}

export const UserSync: React.FC<UserSyncProps> = ({ fhirBaseURL, keycloakBaseURL }) => {
  const { t } = useTranslation();
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState<SyncProgress>({
    total: 0,
    scanned: 0,
    needsSync: 0,
    synced: 0,
    failed: 0,
    status: 'idle',
  });
  const [usersNeedingSync, setUsersNeedingSync] = useState<UserSyncStatus[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleSync = async () => {
    setIsRunning(true);
    setShowResults(false);
    setProgress({
      total: 0,
      scanned: 0,
      needsSync: 0,
      synced: 0,
      failed: 0,
      status: 'scanning',
    });

    try {
      // Step 1: Scan all users
      const statuses = await scanUsers(keycloakBaseURL, fhirBaseURL, (scanProgress) => {
        setProgress(scanProgress);
      });

      const usersToSync = statuses.filter((s) => s.needsSync);
      setUsersNeedingSync(usersToSync);

      if (usersToSync.length === 0) {
        setProgress((prev) => ({
          ...prev,
          status: 'completed',
        }));
        setShowResults(true);
        setIsRunning(false);
        return;
      }

      // Step 2: Sync users
      setProgress((prev) => ({
        ...prev,
        status: 'syncing',
      }));

      const result = await syncAllUsers(
        keycloakBaseURL,
        fhirBaseURL,
        usersToSync,
        (syncProgress) => {
          setProgress(syncProgress);
        }
      );

      setProgress((prev) => ({
        ...prev,
        status: 'completed',
        synced: result.synced,
        failed: result.failed,
      }));
      setShowResults(true);
    } catch (error) {
      setProgress((prev) => ({
        ...prev,
        status: 'error',
      }));
    } finally {
      setIsRunning(false);
    }
  };

  const getScanningProgress = () => {
    if (progress.total === 0) return 0;
    return Math.round((progress.scanned / progress.total) * 100);
  };

  const getSyncingProgress = () => {
    if (progress.needsSync === 0) return 0;
    const completed = progress.synced + progress.failed;
    return Math.round((completed / progress.needsSync) * 100);
  };

  const title = t('User Sync');
  const headerProps = {
    pageHeaderProps: {
      title,
      onBack: undefined,
    },
  };

  return (
    <BodyLayout headerProps={headerProps}>
      <Helmet>
        <title>{title}</title>
      </Helmet>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
        <Card>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
              <Title level={2}>{t('Keycloak User to FHIR Resources Synchronization')}</Title>
              <Paragraph type="secondary">
                {t(
                  'This tool scans all Keycloak users and ensures each user has the required FHIR resources (Practitioner, Group, and PractitionerRole). Missing resources will be automatically created.'
                )}
              </Paragraph>
            </div>

            {progress.status === 'idle' && (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <Button
                  type="primary"
                  size="large"
                  icon={<SyncOutlined />}
                  onClick={handleSync}
                  loading={isRunning}
                >
                  {t('Start Synchronization')}
                </Button>
              </div>
            )}

            {progress.status === 'scanning' && (
              <div>
                <Alert
                  message={t('Scanning Keycloak Users')}
                  description={t('Checking each user for missing FHIR resources...')}
                  type="info"
                  showIcon
                />
                <div style={{ marginTop: 24 }}>
                  <Text strong>
                    {t('Progress')}: {progress.scanned} / {progress.total}
                  </Text>
                  {progress.currentUser && (
                    <div>
                      <Text type="secondary">
                        {t('Current user')}: {progress.currentUser}
                      </Text>
                    </div>
                  )}
                  <Progress percent={getScanningProgress()} status="active" />
                  <div style={{ marginTop: 16 }}>
                    <Text>
                      {t('Users needing sync')}: <Text strong>{progress.needsSync}</Text>
                    </Text>
                  </div>
                </div>
              </div>
            )}

            {progress.status === 'syncing' && (
              <div>
                <Alert
                  message={t('Synchronizing Users')}
                  description={t('Creating missing FHIR resources for users...')}
                  type="info"
                  showIcon
                />
                <div style={{ marginTop: 24 }}>
                  <Text strong>
                    {t('Progress')}: {progress.synced + progress.failed} / {progress.needsSync}
                  </Text>
                  {progress.currentUser && (
                    <div>
                      <Text type="secondary">
                        {t('Current user')}: {progress.currentUser}
                      </Text>
                    </div>
                  )}
                  <Progress percent={getSyncingProgress()} status="active" />
                  <Row gutter={16} style={{ marginTop: 16 }}>
                    <Col span={12}>
                      <Text>
                        {t('Synced')}:{' '}
                        <Text strong type="success">
                          {progress.synced}
                        </Text>
                      </Text>
                    </Col>
                    <Col span={12}>
                      <Text>
                        {t('Failed')}:{' '}
                        <Text strong type="danger">
                          {progress.failed}
                        </Text>
                      </Text>
                    </Col>
                  </Row>
                </div>
              </div>
            )}

            {progress.status === 'completed' && showResults && (
              <div>
                <Alert
                  message={t('Synchronization Completed')}
                  description={
                    progress.needsSync === 0
                      ? t('All users already have the required FHIR resources.')
                      : t('The synchronization process has completed.')
                  }
                  type="success"
                  showIcon
                  icon={<CheckCircleOutlined />}
                />

                <Divider />

                <Row gutter={16}>
                  <Col span={6}>
                    <Statistic
                      title={t('Total Users Scanned')}
                      value={progress.total}
                      prefix={<SyncOutlined />}
                    />
                  </Col>
                  <Col span={6}>
                    <Statistic
                      title={t('Users Needing Sync')}
                      value={progress.needsSync}
                      valueStyle={{ color: progress.needsSync > 0 ? '#faad14' : '#3f8600' }}
                    />
                  </Col>
                  <Col span={6}>
                    <Statistic
                      title={t('Successfully Synced')}
                      value={progress.synced}
                      valueStyle={{ color: '#3f8600' }}
                      prefix={<CheckCircleOutlined />}
                    />
                  </Col>
                  <Col span={6}>
                    <Statistic
                      title={t('Failed')}
                      value={progress.failed}
                      valueStyle={{ color: progress.failed > 0 ? '#cf1322' : undefined }}
                      prefix={progress.failed > 0 ? <CloseCircleOutlined /> : undefined}
                    />
                  </Col>
                </Row>

                {usersNeedingSync.length > 0 && (
                  <>
                    <Divider />
                    <div>
                      <Title level={4}>{t('Users Missing Resources')}</Title>
                      <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                        {usersNeedingSync.map((user) => (
                          <div
                            key={user.userId}
                            style={{
                              padding: '8px 12px',
                              borderBottom: '1px solid #f0f0f0',
                            }}
                          >
                            <Text strong>{user.username}</Text>
                            <div style={{ marginLeft: 16, marginTop: 4 }}>
                              {!user.hasPractitioner && (
                                <Text type="secondary" style={{ marginRight: 16 }}>
                                  ✗ Practitioner
                                </Text>
                              )}
                              {!user.hasGroup && (
                                <Text type="secondary" style={{ marginRight: 16 }}>
                                  ✗ Group
                                </Text>
                              )}
                              {!user.hasPractitionerRole && (
                                <Text type="secondary">✗ PractitionerRole</Text>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <Divider />

                <div style={{ textAlign: 'center' }}>
                  <Button
                    onClick={() => {
                      setProgress({
                        total: 0,
                        scanned: 0,
                        needsSync: 0,
                        synced: 0,
                        failed: 0,
                        status: 'idle',
                      });
                      setShowResults(false);
                      setUsersNeedingSync([]);
                    }}
                  >
                    {t('Run Again')}
                  </Button>
                </div>
              </div>
            )}

            {progress.status === 'error' && (
              <div>
                <Alert
                  message={t('Synchronization Error')}
                  description={t('An error occurred during the synchronization process.')}
                  type="error"
                  showIcon
                  icon={<CloseCircleOutlined />}
                />
                <div style={{ textAlign: 'center', marginTop: 16 }}>
                  <Button
                    onClick={() => {
                      setProgress({
                        total: 0,
                        scanned: 0,
                        needsSync: 0,
                        synced: 0,
                        failed: 0,
                        status: 'idle',
                      });
                    }}
                  >
                    {t('Try Again')}
                  </Button>
                </div>
              </div>
            )}
          </Space>
        </Card>
      </div>
    </BodyLayout>
  );
};
