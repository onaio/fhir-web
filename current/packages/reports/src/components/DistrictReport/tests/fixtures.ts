export const sampleTeamAssignment = {
  team: {
    team: {
      location: {
        display: 'Some District',
        name: 'Some District',
        uuid: 'some-location-uuid',
      },
    },
  },
};

export const locationsHierarchy = {
  locationsHierarchy: {
    map: {
      'some-location-uuid': {
        id: 'some-location-uuid',
        label: 'Some Location Name',
        node: {
          locationId: 'some-location-uuid',
          name: 'Some Location Name',
          attributes: { geographicLevel: 4 },
          voided: false,
        },
      },
    },
    parentChildren: {},
  },
};
