/* eslint-disable @typescript-eslint/camelcase */
export const manifestRelease4 = {
  identifier: '1.0.30',
  json: '{"forms_version":"1.0.16","identifiers":["blood_screening.json"}',
  appId: 'org.smartregister.foo',
  appVersion: '1.2.18',
  createdAt: '2020-06-09T14:40:04.189+02:00',
  updatedAt: '2020-06-09T14:40:04.189+02:00',
};

export const fixManifestReleases = [
  {
    identifier: '1.0.11',
    json: '{"forms_version":"1.0.11","identifiers":["blood_screening.json"}',
    appId: 'org.smartregister.reveal',
    appVersion: '1.2.14',
    createdAt: '2020-06-08T15:00:38.413+02:00',
    updatedAt: '2020-06-08T15:00:38.413+02:00',
  },
  {
    identifier: '1.0.12',
    json: '{"forms_version":"1.0.12","identifiers":["blood_screening.json"}',
    appId: 'org.smartregister.reveal',
    appVersion: '1.2.14',
    createdAt: '2020-06-08T15:03:00.950+02:00',
    updatedAt: '2020-06-08T15:03:00.950+02:00',
  },
  {
    identifier: '1.0.16',
    json: '{"forms_version":"1.0.16","identifiers":["blood_screening.json"}',
    appId: 'org.smartregister.reveal',
    appVersion: '1.2.16',
    createdAt: '2020-06-09T14:40:04.189+02:00',
    updatedAt: '2020-06-09T14:40:04.189+02:00',
  },
];

export const manifestFile1 = {
  createdAt: 'Jun 19, 2020, 12:31:37 PM',
  form_relation: '',
  id: '52',
  identifier: 'test-form-1.json',
  isDraft: false,
  isJsonValidator: false,
  jursdiction: '',
  label: 'test form',
  module: '',
  version: '1.0.26',
};

export const manifestFile2 = {
  createdAt: 'Jun 19, 2020, 4:23:22 PM',
  form_relation: '',
  id: '53',
  identifier: 'reveal-test-file.json',
  isDraft: false,
  isJsonValidator: false,
  jursdiction: '',
  label: 'test publish',
  module: '',
  version: '1.0.27',
};

export const manifestFile3 = {
  createdAt: 'Jun 19, 2020, 6:23:22 PM',
  form_relation: '',
  id: '54',
  identifier: 'foo.json',
  isDraft: false,
  isJsonValidator: false,
  jursdiction: '',
  label: 'foo',
  module: 'baz',
  version: '1.0.28',
};

export const draftFile1 = {
  ...manifestFile1,
  isDraft: true,
  isJsonValidator: false,
};

export const draftFile2 = {
  ...manifestFile2,
  isDraft: true,
  isJsonValidator: false,
};

export const draftFile3 = {
  ...manifestFile3,
  isDraft: true,
  isJsonValidator: false,
};

export const fixManifestFiles = [manifestFile1, manifestFile2];

export const FixManifestDraftFiles = [
  {
    ...fixManifestFiles[0],
    isDraft: false,
  },
  {
    ...fixManifestFiles[1],
    isDraft: false,
  },
];

export const downloadFile = {
  clientForm: {
    json: JSON.stringify(fixManifestFiles[0]),
  },
};
