/** interface for settings */
export interface Setting {
  value: 'true' | 'false';
  label: string;
  description: string;
  inheritedFrom?: string;
  uuid: string;
  settingsId: string;
  settingIdentifier: string;
  settingMetadataId: string;
  locationId: string;
  providerId?: string;
  v1Settings: boolean;
  resolveSettings: boolean;
  documentId: string;
  serverVersion: number;
  team?: string;
  teamId?: string;
  type: string;
  key: string;
  identifier?: string;
  _id?: string;
}
