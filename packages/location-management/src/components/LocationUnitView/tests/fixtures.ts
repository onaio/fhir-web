export const sampleHierarchy = {
  locationsHierarchy: {
    map: {
      'a26ca9c8-1441-495a-83b6-bb5df7698996': {
        id: 'a26ca9c8-1441-495a-83b6-bb5df7698996',
        label: 'Tunisia',
        node: {
          locationId: 'a26ca9c8-1441-495a-83b6-bb5df7698996',
          name: 'Tunisia',
          attributes: { geographicLevel: 0 },
          voided: false,
        },
        children: {
          'e66a6f38-93d5-42c2-ba1d-57b6d529baa6': {
            id: 'e66a6f38-93d5-42c2-ba1d-57b6d529baa6',
            label: 'KAIROUAN',
            node: {
              locationId: 'e66a6f38-93d5-42c2-ba1d-57b6d529baa6',
              name: 'KAIROUAN',
              parentLocation: { locationId: 'a26ca9c8-1441-495a-83b6-bb5df7698996', voided: false },
              attributes: { geographicLevel: 1 },
              voided: false,
            },
            children: {
              '7aeda5bb-62b9-4b11-b4a1-30fecd6b4c95': {
                id: '7aeda5bb-62b9-4b11-b4a1-30fecd6b4c95',
                label: 'BOUHAJLA',
                node: {
                  locationId: '7aeda5bb-62b9-4b11-b4a1-30fecd6b4c95',
                  name: 'BOUHAJLA',
                  parentLocation: {
                    locationId: 'e66a6f38-93d5-42c2-ba1d-57b6d529baa6',
                    voided: false,
                  },
                  attributes: { geographicLevel: 2 },
                  voided: false,
                },
                children: {
                  '3a2b98d2-b122-4d28-b0d8-528dd4b0a014': {
                    id: '3a2b98d2-b122-4d28-b0d8-528dd4b0a014',
                    label: 'BOUHAJLA Delegation',
                    node: {
                      locationId: '3a2b98d2-b122-4d28-b0d8-528dd4b0a014',
                      name: 'BOUHAJLA Delegation',
                      parentLocation: {
                        locationId: '7aeda5bb-62b9-4b11-b4a1-30fecd6b4c95',
                        voided: false,
                      },
                      attributes: { geographicLevel: 3 },
                      voided: false,
                    },
                    children: {
                      'bc171a9a-be50-4bdf-9843-54287f634c25': {
                        id: 'bc171a9a-be50-4bdf-9843-54287f634c25',
                        label: 'CSB Trad',
                        node: {
                          locationId: 'bc171a9a-be50-4bdf-9843-54287f634c25',
                          name: 'CSB Trad',
                          parentLocation: {
                            locationId: '3a2b98d2-b122-4d28-b0d8-528dd4b0a014',
                            voided: false,
                          },
                          attributes: { geographicLevel: 4 },
                          voided: false,
                        },
                        parent: '3a2b98d2-b122-4d28-b0d8-528dd4b0a014',
                      },
                    },
                    parent: '7aeda5bb-62b9-4b11-b4a1-30fecd6b4c95',
                  },
                },
                parent: 'e66a6f38-93d5-42c2-ba1d-57b6d529baa6',
              },
            },
            parent: 'a26ca9c8-1441-495a-83b6-bb5df7698996',
          },
          'ede2c7cf-331e-497e-9c7f-2f914d734604': {
            id: 'ede2c7cf-331e-497e-9c7f-2f914d734604',
            label: 'Sousse',
            node: {
              locationId: 'ede2c7cf-331e-497e-9c7f-2f914d734604',
              name: 'Sousse',
              parentLocation: { locationId: 'a26ca9c8-1441-495a-83b6-bb5df7698996', voided: false },
              attributes: { geographicLevel: 1 },
              voided: false,
            },
            children: {
              '18b3841b-b5b1-4971-93d0-d36ac20c4565': {
                id: '18b3841b-b5b1-4971-93d0-d36ac20c4565',
                label: 'Bouficha',
                node: {
                  locationId: '18b3841b-b5b1-4971-93d0-d36ac20c4565',
                  name: 'Bouficha',
                  parentLocation: {
                    locationId: 'ede2c7cf-331e-497e-9c7f-2f914d734604',
                    voided: false,
                  },
                  attributes: { geographicLevel: 2 },
                  voided: false,
                },
                children: {
                  '70589012-899c-401d-85a1-13fabce26aab': {
                    id: '70589012-899c-401d-85a1-13fabce26aab',
                    label: 'Bouficha Delegation',
                    node: {
                      locationId: '70589012-899c-401d-85a1-13fabce26aab',
                      name: 'Bouficha Delegation',
                      parentLocation: {
                        locationId: '18b3841b-b5b1-4971-93d0-d36ac20c4565',
                        voided: false,
                      },
                      attributes: { geographicLevel: 3 },
                      voided: false,
                    },
                    children: {
                      'e2b4a441-21b5-4d03-816b-09d45b17cad7': {
                        id: 'e2b4a441-21b5-4d03-816b-09d45b17cad7',
                        label: 'CSB Hopital Bouficha',
                        node: {
                          locationId: 'e2b4a441-21b5-4d03-816b-09d45b17cad7',
                          name: 'CSB Hopital Bouficha',
                          parentLocation: {
                            locationId: '70589012-899c-401d-85a1-13fabce26aab',
                            voided: false,
                          },
                          attributes: { geographicLevel: 4 },
                          voided: false,
                        },
                        parent: '70589012-899c-401d-85a1-13fabce26aab',
                      },
                    },
                    parent: '18b3841b-b5b1-4971-93d0-d36ac20c4565',
                  },
                },
                parent: 'ede2c7cf-331e-497e-9c7f-2f914d734604',
              },
              'fee237ef-75e8-4ada-b15f-6d1a92633f33': {
                id: 'fee237ef-75e8-4ada-b15f-6d1a92633f33',
                label: 'Enfidha',
                node: {
                  locationId: 'fee237ef-75e8-4ada-b15f-6d1a92633f33',
                  name: 'Enfidha',
                  parentLocation: {
                    locationId: 'ede2c7cf-331e-497e-9c7f-2f914d734604',
                    voided: false,
                  },
                  attributes: { geographicLevel: 2 },
                  voided: false,
                },
                children: {
                  'e5631d3e-70c3-4083-ac17-46f9467c6dd5': {
                    id: 'e5631d3e-70c3-4083-ac17-46f9467c6dd5',
                    label: 'Enfidha delegation',
                    node: {
                      locationId: 'e5631d3e-70c3-4083-ac17-46f9467c6dd5',
                      name: 'Enfidha delegation',
                      parentLocation: {
                        locationId: 'fee237ef-75e8-4ada-b15f-6d1a92633f33',
                        voided: false,
                      },
                      attributes: { geographicLevel: 3 },
                      voided: false,
                    },
                    children: {
                      '5d99a60e-126e-4c40-b5ce-439f920de090': {
                        id: '5d99a60e-126e-4c40-b5ce-439f920de090',
                        label: 'CSB Takrouna',
                        node: {
                          locationId: '5d99a60e-126e-4c40-b5ce-439f920de090',
                          name: 'CSB Takrouna',
                          parentLocation: {
                            locationId: 'e5631d3e-70c3-4083-ac17-46f9467c6dd5',
                            voided: false,
                          },
                          attributes: { geographicLevel: 4 },
                          voided: false,
                        },
                        parent: 'e5631d3e-70c3-4083-ac17-46f9467c6dd5',
                      },
                    },
                    parent: 'fee237ef-75e8-4ada-b15f-6d1a92633f33',
                  },
                },
                parent: 'ede2c7cf-331e-497e-9c7f-2f914d734604',
              },
            },
            parent: 'a26ca9c8-1441-495a-83b6-bb5df7698996',
          },
        },
      },
    },
    parentChildren: {
      'e66a6f38-93d5-42c2-ba1d-57b6d529baa6': ['7aeda5bb-62b9-4b11-b4a1-30fecd6b4c95'],
      'ede2c7cf-331e-497e-9c7f-2f914d734604': [
        '18b3841b-b5b1-4971-93d0-d36ac20c4565',
        'fee237ef-75e8-4ada-b15f-6d1a92633f33',
      ],
      '18b3841b-b5b1-4971-93d0-d36ac20c4565': ['70589012-899c-401d-85a1-13fabce26aab'],
      '7aeda5bb-62b9-4b11-b4a1-30fecd6b4c95': ['3a2b98d2-b122-4d28-b0d8-528dd4b0a014'],
      '70589012-899c-401d-85a1-13fabce26aab': ['e2b4a441-21b5-4d03-816b-09d45b17cad7'],
      'e5631d3e-70c3-4083-ac17-46f9467c6dd5': ['5d99a60e-126e-4c40-b5ce-439f920de090'],
      'a26ca9c8-1441-495a-83b6-bb5df7698996': [
        'e66a6f38-93d5-42c2-ba1d-57b6d529baa6',
        'ede2c7cf-331e-497e-9c7f-2f914d734604',
      ],
      'fee237ef-75e8-4ada-b15f-6d1a92633f33': ['e5631d3e-70c3-4083-ac17-46f9467c6dd5'],
      '3a2b98d2-b122-4d28-b0d8-528dd4b0a014': ['bc171a9a-be50-4bdf-9843-54287f634c25'],
    },
  },
};
