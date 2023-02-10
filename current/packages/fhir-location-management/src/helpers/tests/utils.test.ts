import { convertApiResToTree, serializeTree } from '../utils';
import { fhirHierarchy, serializedSample } from '../../ducks/tests/fixtures';

test('parses fhir hierarchy correctly', () => {
  const tree = convertApiResToTree(fhirHierarchy);
  expect(tree.hasChildren()).toBeTruthy();
  expect(tree.model.label).toEqual('Root FHIR Location');

  const allNodeIds = tree
    .all((x) => !!x)
    .map((node) => {
      return node.model.node.id;
    });
  expect(allNodeIds).toEqual([
    '2252',
    '303',
    '3700',
    '971',
    '3453',
    '3698',
    '3701',
    '3699',
    '3691',
    '3752',
    '3590',
    '739',
    '3464',
    '3753',
    '3756',
    '3757',
    '3754',
    '3755',
    '3773',
    '3774',
    '3758',
    '3772',
    '3775',
    '3776',
  ]);
});

test('serializes tress', () => {
  const cloneHierarchy = JSON.parse(JSON.stringify(fhirHierarchy));
  const rootLocation =
    cloneHierarchy.entry[0].resource.LocationHierarchyTree.locationsHierarchy.listOfNodes
      .treeNode[0];
  const firstRootLocChild = JSON.parse(JSON.stringify(rootLocation.children[0]));
  delete firstRootLocChild.treeNode.children;

  rootLocation.children = [firstRootLocChild];

  const tree = convertApiResToTree(cloneHierarchy);
  // has 2 nodes only
  expect(tree.all(() => true)).toHaveLength(2);

  expect(serializeTree([tree])).toEqual(serializedSample);
  expect(serializeTree()).toBeUndefined();
});
