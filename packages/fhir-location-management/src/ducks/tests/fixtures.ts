import { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';
import { ILocation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ILocation';

export const onaOfficeSubLocation = {
  resourceType: 'Location',
  id: '303',
  meta: {
    versionId: '4',
    lastUpdated: '2021-10-14T13:12:22.740+00:00',
    source: '#13bbc7f09daa1751',
  },
  identifier: [
    {
      use: 'official',
      value: '93bc9c3d-6321-41b0-9b93-1275d7114e22',
    },
  ],
  status: 'active',
  name: 'Ona Office Sub Location',
  alias: ['ona office'],
  description: 'The Sub location',
  physicalType: {
    coding: [
      {
        system: 'http://terminology.hl7.org/CodeSystem/location-physical-type',
        code: 'jdn',
        display: 'Jurisdiction',
      },
    ],
  },
  partOf: {
    reference: 'Location/2252',
    display: 'Root FHIR Location',
  },
} as ILocation;

export const fhirHierarchy = ({
  resourceType: 'Bundle',
  id: 'cc865903-180d-444c-968c-24fd935cc101',
  meta: {
    lastUpdated: '2022-02-02T07:09:19.472+00:00',
  },
  type: 'searchset',
  total: 1,
  link: [
    {
      relation: 'self',
      url:
        'http://fhir.labs.smartregister.org/fhir/LocationHierarchy/?_format=json&identifier=eff94f33-c356-4634-8795-d52340706ba9',
    },
  ],
  entry: [
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/LocationHierarchy/Location Resource : 2252',
      resource: {
        resourceType: 'LocationHierarchy',
        id: 'Location Resource : 2252',
        meta: {
          profile: ['http://hl7.org/fhir/profiles/custom-resource'],
        },
        LocationHierarchyTree: {
          locationsHierarchy: {
            listOfNodes: {
              treeNodeId: 'Location/2252',
              treeNode: [
                {
                  nodeId: 'Location/2252',
                  label: 'Root FHIR Location',
                  node: {
                    resourceType: 'Location',
                    id: '2252',
                    meta: {
                      versionId: '3',
                      lastUpdated: '2021-10-14T13:10:14.524+00:00',
                      source: '#5887f723a045b500',
                    },
                    identifier: [
                      {
                        use: 'official',
                        value: 'eff94f33-c356-4634-8795-d52340706ba9',
                      },
                    ],
                    status: 'active',
                    name: 'Root FHIR Location',
                    alias: ['Root Location'],
                    description:
                      'This is the Root Location that all other locations are part of. Any locations that are directly part of this should be displayed as the root location.',
                    physicalType: {
                      coding: [
                        {
                          system: 'http://terminology.hl7.org/CodeSystem/location-physical-type',
                          code: 'jdn',
                          display: 'Jurisdiction',
                        },
                      ],
                    },
                  },
                  children: [
                    {
                      childId: 'Location/303',
                      treeNode: {
                        nodeId: 'Location/303',
                        label: 'Ona Office Sub Location',
                        node: {
                          resourceType: 'Location',
                          id: '303',
                          meta: {
                            versionId: '4',
                            lastUpdated: '2021-10-14T13:12:22.740+00:00',
                            source: '#13bbc7f09daa1751',
                          },
                          identifier: [
                            {
                              use: 'official',
                              value: '93bc9c3d-6321-41b0-9b93-1275d7114e22',
                            },
                          ],
                          status: 'active',
                          name: 'Ona Office Sub Location',
                          alias: ['ona office'],
                          description: 'The Sub location',
                          physicalType: {
                            coding: [
                              {
                                system:
                                  'http://terminology.hl7.org/CodeSystem/location-physical-type',
                                code: 'jdn',
                                display: 'Jurisdiction',
                              },
                            ],
                          },
                          partOf: {
                            reference: 'Location/2252',
                            display: 'Root FHIR Location',
                          },
                        },
                        parent: 'Location/2252',
                        children: [
                          {
                            childId: 'Location/3700',
                            treeNode: {
                              nodeId: 'Location/3700',
                              label: 'Level 0',
                              node: {
                                resourceType: 'Location',
                                id: '3700',
                                meta: {
                                  versionId: '1',
                                  lastUpdated: '2021-10-25T17:35:03.037+00:00',
                                  source: '#29bc16483de49917',
                                },
                                identifier: [
                                  {
                                    use: 'official',
                                    value: 'aefb6487-952f-43e0-890e-13bc49c66d7a',
                                  },
                                ],
                                status: 'active',
                                name: 'Level 0',
                                alias: ['alias 0'],
                                description: 'This is a test desc',
                                physicalType: {
                                  coding: [
                                    {
                                      system:
                                        'http://terminology.hl7.org/CodeSystem/location-physical-type',
                                      code: 'jdn',
                                      display: 'Jurisdiction',
                                    },
                                  ],
                                },
                                partOf: {
                                  reference: 'Location/303',
                                  display: 'Ona Office Sub Location',
                                },
                              },
                              parent: 'Location/303',
                            },
                          },
                          {
                            childId: 'Location/971',
                            treeNode: {
                              nodeId: 'Location/971',
                              label: 'Arundel mobile clinic',
                              node: {
                                resourceType: 'Location',
                                id: '971',
                                meta: {
                                  versionId: '15',
                                  lastUpdated: '2021-10-22T13:59:17.824+00:00',
                                  source: '#8c44090bcdecfecd',
                                },
                                identifier: [
                                  {
                                    use: 'official',
                                    value: '0f184aac-83e7-498e-8232-5c8b360ad97b',
                                  },
                                ],
                                status: 'active',
                                name: 'Arundel mobile clinic',
                                alias: ['Part of you'],
                                description: 'Vaccination Site',
                                physicalType: {
                                  coding: [
                                    {
                                      system:
                                        'http://terminology.hl7.org/CodeSystem/location-physical-type',
                                      code: 'jdn',
                                      display: 'Jurisdiction',
                                    },
                                  ],
                                },
                                partOf: {
                                  reference: 'Location/303',
                                  display: 'Ona Office Sub Location',
                                },
                              },
                              parent: 'Location/303',
                            },
                          },
                          {
                            childId: 'Location/3453',
                            treeNode: {
                              nodeId: 'Location/3453',
                              label: 'Part Of Sub Location',
                              node: {
                                resourceType: 'Location',
                                id: '3453',
                                meta: {
                                  versionId: '2',
                                  lastUpdated: '2021-10-14T13:12:50.738+00:00',
                                  source: '#ee7f951054c1498e',
                                },
                                identifier: [
                                  {
                                    use: 'official',
                                    value: 'c3ff106e-91cb-4346-b45f-d7ad5346af5a',
                                  },
                                ],
                                status: 'active',
                                name: 'Part Of Sub Location',
                                alias: ['part off'],
                                description: 'Testing the part of ',
                                physicalType: {
                                  coding: [
                                    {
                                      system:
                                        'http://terminology.hl7.org/CodeSystem/location-physical-type',
                                      code: 'jdn',
                                      display: 'Jurisdiction',
                                    },
                                  ],
                                },
                                partOf: {
                                  reference: 'Location/303',
                                  display: 'Ona Office Sub Location',
                                },
                              },
                              parent: 'Location/303',
                              children: [
                                {
                                  childId: 'Location/3698',
                                  treeNode: {
                                    nodeId: 'Location/3698',
                                    label: 'Nairobii',
                                    node: {
                                      resourceType: 'Location',
                                      id: '3698',
                                      meta: {
                                        versionId: '1',
                                        lastUpdated: '2021-10-25T11:47:40.060+00:00',
                                        source: '#7b5eb661a6a154a6',
                                      },
                                      identifier: [
                                        {
                                          use: 'official',
                                          value: 'cef7b7fd-46cd-4975-bd47-b1a6d045dc3d',
                                        },
                                      ],
                                      status: 'active',
                                      name: 'Nairobii',
                                      alias: ['Desc alias'],
                                      description: 'Desc',
                                      physicalType: {
                                        coding: [
                                          {
                                            system:
                                              'http://terminology.hl7.org/CodeSystem/location-physical-type',
                                            code: 'jdn',
                                            display: 'Jurisdiction',
                                          },
                                        ],
                                      },
                                      partOf: {
                                        reference: 'Location/3453',
                                        display: 'Part Of Sub Location',
                                      },
                                    },
                                    parent: 'Location/3453',
                                    children: [
                                      {
                                        childId: 'Location/3701',
                                        treeNode: {
                                          nodeId: 'Location/3701',
                                          label: 'Langata',
                                          node: {
                                            resourceType: 'Location',
                                            id: '3701',
                                            meta: {
                                              versionId: '1',
                                              lastUpdated: '2021-10-25T17:39:30.390+00:00',
                                              source: '#ed9c4d2c21507afc',
                                            },
                                            identifier: [
                                              {
                                                use: 'official',
                                                value: 'b4bed6fc-35eb-4de1-ab3a-d7df5bf7f346',
                                              },
                                            ],
                                            status: 'active',
                                            name: 'Langata',
                                            alias: ['langata alias'],
                                            description: 'langata desc',
                                            physicalType: {
                                              coding: [
                                                {
                                                  system:
                                                    'http://terminology.hl7.org/CodeSystem/location-physical-type',
                                                  code: 'jdn',
                                                  display: 'Jurisdiction',
                                                },
                                              ],
                                            },
                                            partOf: {
                                              reference: 'Location/3698',
                                              display: 'Nairobii',
                                            },
                                          },
                                          parent: 'Location/3698',
                                        },
                                      },
                                      {
                                        childId: 'Location/3699',
                                        treeNode: {
                                          nodeId: 'Location/3699',
                                          label: 'Ngong',
                                          node: {
                                            resourceType: 'Location',
                                            id: '3699',
                                            meta: {
                                              versionId: '1',
                                              lastUpdated: '2021-10-25T12:13:50.248+00:00',
                                              source: '#648444f01bec6b9e',
                                            },
                                            identifier: [
                                              {
                                                use: 'official',
                                                value: '6f7b3491-3651-4986-b5a7-befd3fbc9905',
                                              },
                                            ],
                                            status: 'active',
                                            name: 'Ngong',
                                            alias: ['Ngongy'],
                                            description: 'Ngong Location',
                                            physicalType: {
                                              coding: [
                                                {
                                                  system:
                                                    'http://terminology.hl7.org/CodeSystem/location-physical-type',
                                                  code: 'jdn',
                                                  display: 'Jurisdiction',
                                                },
                                              ],
                                            },
                                            partOf: {
                                              reference: 'Location/3698',
                                              display: 'Nairobii',
                                            },
                                          },
                                          parent: 'Location/3698',
                                        },
                                      },
                                    ],
                                  },
                                },
                                {
                                  childId: 'Location/3691',
                                  treeNode: {
                                    nodeId: 'Location/3691',
                                    label: 'Test Sub Loc',
                                    node: {
                                      resourceType: 'Location',
                                      id: '3691',
                                      meta: {
                                        versionId: '8',
                                        lastUpdated: '2021-10-25T09:25:24.653+00:00',
                                        source: '#6d829f7729f539f0',
                                      },
                                      identifier: [
                                        {
                                          use: 'official',
                                          value: '4991bf8d-fdbd-48a5-8b02-75d57369573e',
                                        },
                                      ],
                                      status: 'active',
                                      name: 'Test Sub Loc',
                                      alias: ['Test Sub'],
                                      description: 'The Test Sub Loc',
                                      physicalType: {
                                        coding: [
                                          {
                                            system:
                                              'http://terminology.hl7.org/CodeSystem/location-physical-type',
                                            code: 'jdn',
                                            display: 'Jurisdiction',
                                          },
                                        ],
                                      },
                                      partOf: {
                                        reference: 'Location/3453',
                                        display: 'Part Of Sub Location',
                                      },
                                    },
                                    parent: 'Location/3453',
                                    children: [
                                      {
                                        childId: 'Location/3752',
                                        treeNode: {
                                          nodeId: 'Location/3752',
                                          label: 'Embakasiii',
                                          node: {
                                            resourceType: 'Location',
                                            id: '3752',
                                            meta: {
                                              versionId: '3',
                                              lastUpdated: '2021-10-25T18:23:41.730+00:00',
                                              source: '#e53fb49dd17be516',
                                            },
                                            identifier: [
                                              {
                                                use: 'official',
                                                value: '40d75934-2a30-4426-9100-912e3c3fc459',
                                              },
                                            ],
                                            status: 'active',
                                            name: 'Embakasiii',
                                            alias: ['Emba'],
                                            description: 'Emba Desc',
                                            physicalType: {
                                              coding: [
                                                {
                                                  system:
                                                    'http://terminology.hl7.org/CodeSystem/location-physical-type',
                                                  code: 'jdn',
                                                  display: 'Jurisdiction',
                                                },
                                              ],
                                            },
                                            partOf: {
                                              reference: 'Location/3691',
                                              display: 'Test Sub Loc',
                                            },
                                          },
                                          parent: 'Location/3691',
                                        },
                                      },
                                    ],
                                  },
                                },
                                {
                                  childId: 'Location/3590',
                                  treeNode: {
                                    nodeId: 'Location/3590',
                                    label: 'Test Loc 113',
                                    node: {
                                      resourceType: 'Location',
                                      id: '3590',
                                      meta: {
                                        versionId: '1',
                                        lastUpdated: '2021-10-15T09:59:46.554+00:00',
                                        source: '#bc4c70fa7e68ac36',
                                      },
                                      identifier: [
                                        {
                                          use: 'official',
                                          value: '9f7f985b-8226-4971-ae67-c3ef241cbe01',
                                        },
                                      ],
                                      status: 'active',
                                      name: 'Test Loc 113',
                                      alias: ['113'],
                                      description: 'Desc',
                                      physicalType: {
                                        coding: [
                                          {
                                            system:
                                              'http://terminology.hl7.org/CodeSystem/location-physical-type',
                                            code: 'jdn',
                                            display: 'Jurisdiction',
                                          },
                                        ],
                                      },
                                      partOf: {
                                        reference: 'Location/3453',
                                        display: 'Part Of Sub Location',
                                      },
                                    },
                                    parent: 'Location/3453',
                                  },
                                },
                                {
                                  childId: 'Location/739',
                                  treeNode: {
                                    nodeId: 'Location/739',
                                    label: 'Test Loc 1145',
                                    node: {
                                      resourceType: 'Location',
                                      id: '739',
                                      meta: {
                                        versionId: '19',
                                        lastUpdated: '2021-10-15T12:09:59.809+00:00',
                                        source: '#68c24697322968a2',
                                      },
                                      identifier: [
                                        {
                                          use: 'official',
                                          value: '2829f50c-9189-43ee-8def-a775437c2f0b',
                                        },
                                      ],
                                      status: 'active',
                                      name: 'Test Loc 1145',
                                      alias: ['ona officee'],
                                      description: 'This is a test',
                                      physicalType: {
                                        coding: [
                                          {
                                            system:
                                              'http://terminology.hl7.org/CodeSystem/location-physical-type',
                                            code: 'jdn',
                                            display: 'Jurisdiction',
                                          },
                                        ],
                                      },
                                      partOf: {
                                        reference: 'Location/3453',
                                        display: 'Part Of Sub Location',
                                      },
                                    },
                                    parent: 'Location/3453',
                                  },
                                },
                                {
                                  childId: 'Location/3464',
                                  treeNode: {
                                    nodeId: 'Location/3464',
                                    label: 'MOH HQ 2',
                                    node: {
                                      resourceType: 'Location',
                                      id: '3464',
                                      meta: {
                                        versionId: '7',
                                        lastUpdated: '2021-10-25T18:30:13.490+00:00',
                                        source: '#a6eb7dc2fdf82484',
                                      },
                                      identifier: [
                                        {
                                          use: 'official',
                                          value: 'f725bbe8-989d-4dd9-8346-d9630e813660',
                                        },
                                      ],
                                      status: 'active',
                                      name: 'MOH HQ 2',
                                      alias: ['mohh'],
                                      description: 'HL7 Headquarters',
                                      physicalType: {
                                        coding: [
                                          {
                                            system:
                                              'http://terminology.hl7.org/CodeSystem/location-physical-type',
                                            code: 'jdn',
                                            display: 'Jurisdiction',
                                          },
                                        ],
                                      },
                                      partOf: {
                                        reference: 'Location/3453',
                                        display: 'Part Of Sub Location',
                                      },
                                    },
                                    parent: 'Location/3453',
                                    children: [
                                      {
                                        childId: 'Location/3753',
                                        treeNode: {
                                          nodeId: 'Location/3753',
                                          label: 'MOH Sub location',
                                          node: {
                                            resourceType: 'Location',
                                            id: '3753',
                                            meta: {
                                              versionId: '1',
                                              lastUpdated: '2021-10-25T18:32:20.171+00:00',
                                              source: '#00e92dd273348bed',
                                            },
                                            identifier: [
                                              {
                                                use: 'official',
                                                value: 'fe124438-6c7f-4869-bd89-b3c0fd5703ee',
                                              },
                                            ],
                                            status: 'active',
                                            name: 'MOH Sub location',
                                            alias: ['MOH Sub location'],
                                            description: 'MOH Sub location desc',
                                            physicalType: {
                                              coding: [
                                                {
                                                  system:
                                                    'http://terminology.hl7.org/CodeSystem/location-physical-type',
                                                  code: 'jdn',
                                                  display: 'Jurisdiction',
                                                },
                                              ],
                                            },
                                            partOf: {
                                              reference: 'Location/3464',
                                              display: 'MOH HQ 2',
                                            },
                                          },
                                          parent: 'Location/3464',
                                          children: [
                                            {
                                              childId: 'Location/3756',
                                              treeNode: {
                                                nodeId: 'Location/3756',
                                                label: 'MOH SUB SUB LOCATION 1',
                                                node: {
                                                  resourceType: 'Location',
                                                  id: '3756',
                                                  meta: {
                                                    versionId: '1',
                                                    lastUpdated: '2021-10-26T07:46:41.904+00:00',
                                                    source: '#ce245f0bc54b347b',
                                                  },
                                                  identifier: [
                                                    {
                                                      use: 'official',
                                                      value: 'd8e58b43-141e-4b29-a789-81ab6677c2ba',
                                                    },
                                                  ],
                                                  status: 'active',
                                                  name: 'MOH SUB SUB LOCATION 1',
                                                  alias: ['MOH SUB SUB LOCATION 1'],
                                                  description: 'MOH SUB SUB LOCATION 1',
                                                  physicalType: {
                                                    coding: [
                                                      {
                                                        system:
                                                          'http://terminology.hl7.org/CodeSystem/location-physical-type',
                                                        code: 'jdn',
                                                        display: 'Jurisdiction',
                                                      },
                                                    ],
                                                  },
                                                  partOf: {
                                                    reference: 'Location/3753',
                                                    display: 'MOH Sub location',
                                                  },
                                                },
                                                parent: 'Location/3753',
                                                children: [
                                                  {
                                                    childId: 'Location/3757',
                                                    treeNode: {
                                                      nodeId: 'Location/3757',
                                                      label: 'MOH SUB SUB SUB LOCATION 1',
                                                      node: {
                                                        resourceType: 'Location',
                                                        id: '3757',
                                                        meta: {
                                                          versionId: '1',
                                                          lastUpdated:
                                                            '2021-10-26T07:48:19.889+00:00',
                                                          source: '#d11c67f354d91869',
                                                        },
                                                        identifier: [
                                                          {
                                                            use: 'official',
                                                            value:
                                                              '26401d5f-167a-4df8-a4b8-243add38779b',
                                                          },
                                                        ],
                                                        status: 'active',
                                                        name: 'MOH SUB SUB SUB LOCATION 1',
                                                        alias: ['MOH SUB SUB SUB LOCATION 1'],
                                                        description: 'MOH SUB SUB SUB LOCATION 1',
                                                        physicalType: {
                                                          coding: [
                                                            {
                                                              system:
                                                                'http://terminology.hl7.org/CodeSystem/location-physical-type',
                                                              code: 'jdn',
                                                              display: 'Jurisdiction',
                                                            },
                                                          ],
                                                        },
                                                        partOf: {
                                                          reference: 'Location/3756',
                                                          display: 'MOH SUB SUB LOCATION 1',
                                                        },
                                                      },
                                                      parent: 'Location/3756',
                                                    },
                                                  },
                                                ],
                                              },
                                            },
                                            {
                                              childId: 'Location/3754',
                                              treeNode: {
                                                nodeId: 'Location/3754',
                                                label: 'MOH SUB SUB LOCATION',
                                                node: {
                                                  resourceType: 'Location',
                                                  id: '3754',
                                                  meta: {
                                                    versionId: '1',
                                                    lastUpdated: '2021-10-26T07:43:36.298+00:00',
                                                    source: '#18b051aedc5f2f73',
                                                  },
                                                  identifier: [
                                                    {
                                                      use: 'official',
                                                      value: 'e13e4c1c-d5c6-43e3-94b0-7efd3f2153c4',
                                                    },
                                                  ],
                                                  status: 'active',
                                                  name: 'MOH SUB SUB LOCATION',
                                                  alias: ['MOH SUB SUB LOCATION'],
                                                  description: 'MOH SUB SUB LOCATION',
                                                  physicalType: {
                                                    coding: [
                                                      {
                                                        system:
                                                          'http://terminology.hl7.org/CodeSystem/location-physical-type',
                                                        code: 'jdn',
                                                        display: 'Jurisdiction',
                                                      },
                                                    ],
                                                  },
                                                  partOf: {
                                                    reference: 'Location/3753',
                                                    display: 'MOH Sub location',
                                                  },
                                                },
                                                parent: 'Location/3753',
                                                children: [
                                                  {
                                                    childId: 'Location/3755',
                                                    treeNode: {
                                                      nodeId: 'Location/3755',
                                                      label: 'MOH HQ',
                                                      node: {
                                                        resourceType: 'Location',
                                                        id: '3755',
                                                        meta: {
                                                          versionId: '2',
                                                          lastUpdated:
                                                            '2021-10-26T07:50:53.540+00:00',
                                                          source: '#5339f0868dd39478',
                                                        },
                                                        identifier: [
                                                          {
                                                            use: 'official',
                                                            value:
                                                              '08fd0492-c513-4814-8dca-b5d19feb79d1',
                                                          },
                                                        ],
                                                        status: 'active',
                                                        name: 'MOH HQ',
                                                        alias: ['MOH HQ'],
                                                        description: 'MOH HQ',
                                                        physicalType: {
                                                          coding: [
                                                            {
                                                              system:
                                                                'http://terminology.hl7.org/CodeSystem/location-physical-type',
                                                              code: 'jdn',
                                                              display: 'Jurisdiction',
                                                            },
                                                          ],
                                                        },
                                                        partOf: {
                                                          reference: 'Location/3754',
                                                          display: 'MOH SUB SUB LOCATION',
                                                        },
                                                      },
                                                      parent: 'Location/3754',
                                                      children: [
                                                        {
                                                          childId: 'Location/3773',
                                                          treeNode: {
                                                            nodeId: 'Location/3773',
                                                            label: 'MOH SUB LOCATION 1',
                                                            node: {
                                                              resourceType: 'Location',
                                                              id: '3773',
                                                              meta: {
                                                                versionId: '1',
                                                                lastUpdated:
                                                                  '2021-10-26T10:57:59.491+00:00',
                                                                source: '#10a430746e2909fd',
                                                              },
                                                              identifier: [
                                                                {
                                                                  use: 'official',
                                                                  value:
                                                                    'baa79c00-1605-4a3a-bb51-856cee820a96',
                                                                },
                                                              ],
                                                              status: 'active',
                                                              name: 'MOH SUB LOCATION 1',
                                                              alias: ['MOH SUB LOCATION 1'],
                                                              description: 'MOH SUB LOCATION 1',
                                                              physicalType: {
                                                                coding: [
                                                                  {
                                                                    system:
                                                                      'http://terminology.hl7.org/CodeSystem/location-physical-type',
                                                                    code: 'jdn',
                                                                    display: 'Jurisdiction',
                                                                  },
                                                                ],
                                                              },
                                                              partOf: {
                                                                reference: 'Location/3755',
                                                                display: 'MOH HQ',
                                                              },
                                                            },
                                                            parent: 'Location/3755',
                                                            children: [
                                                              {
                                                                childId: 'Location/3774',
                                                                treeNode: {
                                                                  nodeId: 'Location/3774',
                                                                  label: 'MOH SUB SUB LOCATION 1',
                                                                  node: {
                                                                    resourceType: 'Location',
                                                                    id: '3774',
                                                                    meta: {
                                                                      versionId: '1',
                                                                      lastUpdated:
                                                                        '2021-10-26T10:59:20.719+00:00',
                                                                      source: '#03c5b06d6f5c392c',
                                                                    },
                                                                    identifier: [
                                                                      {
                                                                        use: 'official',
                                                                        value:
                                                                          '4e6a37e9-d832-42f8-b019-cd5a951f385d',
                                                                      },
                                                                    ],
                                                                    status: 'active',
                                                                    name: 'MOH SUB SUB LOCATION 1',
                                                                    alias: [
                                                                      'MOH SUB SUB LOCATION 1',
                                                                    ],
                                                                    description:
                                                                      'MOH SUB SUB LOCATION 1',
                                                                    physicalType: {
                                                                      coding: [
                                                                        {
                                                                          system:
                                                                            'http://terminology.hl7.org/CodeSystem/location-physical-type',
                                                                          code: 'jdn',
                                                                          display: 'Jurisdiction',
                                                                        },
                                                                      ],
                                                                    },
                                                                    partOf: {
                                                                      reference: 'Location/3773',
                                                                      display: 'MOH SUB LOCATION 1',
                                                                    },
                                                                  },
                                                                  parent: 'Location/3773',
                                                                },
                                                              },
                                                            ],
                                                          },
                                                        },
                                                        {
                                                          childId: 'Location/3758',
                                                          treeNode: {
                                                            nodeId: 'Location/3758',
                                                            label: 'MOH SUB LOCATION',
                                                            node: {
                                                              resourceType: 'Location',
                                                              id: '3758',
                                                              meta: {
                                                                versionId: '1',
                                                                lastUpdated:
                                                                  '2021-10-26T08:21:48.281+00:00',
                                                                source: '#fb1ac76193a49328',
                                                              },
                                                              identifier: [
                                                                {
                                                                  use: 'official',
                                                                  value:
                                                                    '60eb5ec3-0800-4cb1-b316-2c8ca996db2d',
                                                                },
                                                              ],
                                                              status: 'active',
                                                              name: 'MOH SUB LOCATION',
                                                              alias: ['MOH SUB LOCATION'],
                                                              description: 'MOH SUB LOCATION',
                                                              physicalType: {
                                                                coding: [
                                                                  {
                                                                    system:
                                                                      'http://terminology.hl7.org/CodeSystem/location-physical-type',
                                                                    code: 'jdn',
                                                                    display: 'Jurisdiction',
                                                                  },
                                                                ],
                                                              },
                                                              partOf: {
                                                                reference: 'Location/3755',
                                                                display: 'MOH HQ',
                                                              },
                                                            },
                                                            parent: 'Location/3755',
                                                            children: [
                                                              {
                                                                childId: 'Location/3772',
                                                                treeNode: {
                                                                  nodeId: 'Location/3772',
                                                                  label: 'MOH SUB SUB LOCATION',
                                                                  node: {
                                                                    resourceType: 'Location',
                                                                    id: '3772',
                                                                    meta: {
                                                                      versionId: '1',
                                                                      lastUpdated:
                                                                        '2021-10-26T10:56:51.495+00:00',
                                                                      source: '#8dec0ad9b4b20d3c',
                                                                    },
                                                                    identifier: [
                                                                      {
                                                                        use: 'official',
                                                                        value:
                                                                          'adba8456-6bdd-470e-a056-ece49867f60e',
                                                                      },
                                                                    ],
                                                                    status: 'active',
                                                                    name: 'MOH SUB SUB LOCATION',
                                                                    alias: ['MOH SUB SUB LOCATION'],
                                                                    description:
                                                                      'MOH SUB SUB LOCATION',
                                                                    physicalType: {
                                                                      coding: [
                                                                        {
                                                                          system:
                                                                            'http://terminology.hl7.org/CodeSystem/location-physical-type',
                                                                          code: 'jdn',
                                                                          display: 'Jurisdiction',
                                                                        },
                                                                      ],
                                                                    },
                                                                    partOf: {
                                                                      reference: 'Location/3758',
                                                                      display: 'MOH SUB LOCATION',
                                                                    },
                                                                  },
                                                                  parent: 'Location/3758',
                                                                  children: [
                                                                    {
                                                                      childId: 'Location/3775',
                                                                      treeNode: {
                                                                        nodeId: 'Location/3775',
                                                                        label:
                                                                          'MOH SUB SUB SUB LOCATION',
                                                                        node: {
                                                                          resourceType: 'Location',
                                                                          id: '3775',
                                                                          meta: {
                                                                            versionId: '1',
                                                                            lastUpdated:
                                                                              '2021-10-26T11:32:51.171+00:00',
                                                                            source:
                                                                              '#55d61406a3186f08',
                                                                          },
                                                                          identifier: [
                                                                            {
                                                                              use: 'official',
                                                                              value:
                                                                                '58d49744-bb61-47b4-990e-c4b88e7aa1c6',
                                                                            },
                                                                          ],
                                                                          status: 'active',
                                                                          name:
                                                                            'MOH SUB SUB SUB LOCATION',
                                                                          alias: [
                                                                            'MOH SUB SUB SUB LOCATION',
                                                                          ],
                                                                          description:
                                                                            'MOH SUB SUB SUB LOCATION',
                                                                          physicalType: {
                                                                            coding: [
                                                                              {
                                                                                system:
                                                                                  'http://terminology.hl7.org/CodeSystem/location-physical-type',
                                                                                code: 'jdn',
                                                                                display:
                                                                                  'Jurisdiction',
                                                                              },
                                                                            ],
                                                                          },
                                                                          partOf: {
                                                                            reference:
                                                                              'Location/3772',
                                                                            display:
                                                                              'MOH SUB SUB LOCATION',
                                                                          },
                                                                        },
                                                                        parent: 'Location/3772',
                                                                        children: [
                                                                          {
                                                                            childId:
                                                                              'Location/3776',
                                                                            treeNode: {
                                                                              nodeId:
                                                                                'Location/3776',
                                                                              label:
                                                                                'MOH SUB SUB SUB LOCATION 1',
                                                                              node: {
                                                                                resourceType:
                                                                                  'Location',
                                                                                id: '3776',
                                                                                meta: {
                                                                                  versionId: '1',
                                                                                  lastUpdated:
                                                                                    '2021-10-26T11:40:02.091+00:00',
                                                                                  source:
                                                                                    '#3b9b650a82a1ebf0',
                                                                                },
                                                                                identifier: [
                                                                                  {
                                                                                    use: 'official',
                                                                                    value:
                                                                                      '1815f774-c85b-4bb1-825d-f6af11753d08',
                                                                                  },
                                                                                ],
                                                                                status: 'active',
                                                                                name:
                                                                                  'MOH SUB SUB SUB LOCATION 1',
                                                                                alias: [
                                                                                  'MOH SUB SUB SUB LOCATION 1',
                                                                                ],
                                                                                description:
                                                                                  'MOH SUB SUB SUB LOCATION 1',
                                                                                physicalType: {
                                                                                  coding: [
                                                                                    {
                                                                                      system:
                                                                                        'http://terminology.hl7.org/CodeSystem/location-physical-type',
                                                                                      code: 'jdn',
                                                                                      display:
                                                                                        'Jurisdiction',
                                                                                    },
                                                                                  ],
                                                                                },
                                                                                partOf: {
                                                                                  reference:
                                                                                    'Location/3775',
                                                                                  display:
                                                                                    'MOH SUB SUB SUB LOCATION',
                                                                                },
                                                                              },
                                                                              parent:
                                                                                'Location/3775',
                                                                            },
                                                                          },
                                                                        ],
                                                                      },
                                                                    },
                                                                  ],
                                                                },
                                                              },
                                                            ],
                                                          },
                                                        },
                                                      ],
                                                    },
                                                  },
                                                ],
                                              },
                                            },
                                          ],
                                        },
                                      },
                                    ],
                                  },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              ],
            },
            parentChildren: [
              {
                identifier: 'Location/2252',
                childIdentifiers: ['Location/303'],
              },
              {
                identifier: 'Location/303',
                childIdentifiers: ['Location/3700', 'Location/971', 'Location/3453'],
              },
              {
                identifier: 'Location/3453',
                childIdentifiers: [
                  'Location/3698',
                  'Location/3691',
                  'Location/3590',
                  'Location/739',
                  'Location/3464',
                ],
              },
              {
                identifier: 'Location/3698',
                childIdentifiers: ['Location/3701', 'Location/3699'],
              },
              {
                identifier: 'Location/3691',
                childIdentifiers: ['Location/3752'],
              },
              {
                identifier: 'Location/3464',
                childIdentifiers: ['Location/3753'],
              },
              {
                identifier: 'Location/3753',
                childIdentifiers: ['Location/3756', 'Location/3754'],
              },
              {
                identifier: 'Location/3756',
                childIdentifiers: ['Location/3757'],
              },
              {
                identifier: 'Location/3754',
                childIdentifiers: ['Location/3755'],
              },
              {
                identifier: 'Location/3755',
                childIdentifiers: ['Location/3773', 'Location/3758'],
              },
              {
                identifier: 'Location/3773',
                childIdentifiers: ['Location/3774'],
              },
              {
                identifier: 'Location/3758',
                childIdentifiers: ['Location/3772'],
              },
              {
                identifier: 'Location/3772',
                childIdentifiers: ['Location/3775'],
              },
              {
                identifier: 'Location/3775',
                childIdentifiers: ['Location/3776'],
              },
            ],
          },
        },
        locationId: '2252',
      },
    },
  ],
} as unknown) as IBundle;

export const serializedSample =
  '["{\\"config\\":{\\"childrenPropertyName\\":\\"children\\"},\\"model\\":{\\"nodeId\\":\\"Location/2252\\",\\"label\\":\\"Root FHIR Location\\",\\"node\\":{\\"resourceType\\":\\"Location\\",\\"id\\":\\"2252\\",\\"meta\\":{\\"versionId\\":\\"3\\",\\"lastUpdated\\":\\"2021-10-14T13:10:14.524+00:00\\",\\"source\\":\\"#5887f723a045b500\\"},\\"identifier\\":[{\\"use\\":\\"official\\",\\"value\\":\\"eff94f33-c356-4634-8795-d52340706ba9\\"}],\\"status\\":\\"active\\",\\"name\\":\\"Root FHIR Location\\",\\"alias\\":[\\"Root Location\\"],\\"description\\":\\"This is the Root Location that all other locations are part of. Any locations that are directly part of this should be displayed as the root location.\\",\\"physicalType\\":{\\"coding\\":[{\\"system\\":\\"http://terminology.hl7.org/CodeSystem/location-physical-type\\",\\"code\\":\\"jdn\\",\\"display\\":\\"Jurisdiction\\"}]}},\\"children\\":[{\\"nodeId\\":\\"Location/303\\",\\"label\\":\\"Ona Office Sub Location\\",\\"node\\":{\\"resourceType\\":\\"Location\\",\\"id\\":\\"303\\",\\"meta\\":{\\"versionId\\":\\"4\\",\\"lastUpdated\\":\\"2021-10-14T13:12:22.740+00:00\\",\\"source\\":\\"#13bbc7f09daa1751\\"},\\"identifier\\":[{\\"use\\":\\"official\\",\\"value\\":\\"93bc9c3d-6321-41b0-9b93-1275d7114e22\\"}],\\"status\\":\\"active\\",\\"name\\":\\"Ona Office Sub Location\\",\\"alias\\":[\\"ona office\\"],\\"description\\":\\"The Sub location\\",\\"physicalType\\":{\\"coding\\":[{\\"system\\":\\"http://terminology.hl7.org/CodeSystem/location-physical-type\\",\\"code\\":\\"jdn\\",\\"display\\":\\"Jurisdiction\\"}]},\\"partOf\\":{\\"reference\\":\\"Location/2252\\",\\"display\\":\\"Root FHIR Location\\"}},\\"parent\\":\\"Location/2252\\",\\"children\\":[]}]},\\"children\\":[{\\"config\\":{\\"$ref\\":\\"$[\\\\\\"config\\\\\\"]\\"},\\"model\\":{\\"$ref\\":\\"$[\\\\\\"model\\\\\\"][\\\\\\"children\\\\\\"][0]\\"},\\"children\\":[],\\"parent\\":{\\"$ref\\":\\"$\\"}}]}"]';
