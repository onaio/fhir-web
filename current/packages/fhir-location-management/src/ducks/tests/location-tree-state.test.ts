import { reducerName, reducer, setSelectedNode, getSelectedNode } from '../location-tree-state';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { convertApiResToTree } from '../../helpers/utils';
import { fhirHierarchy } from '../tests/fixtures';
import { store } from '@opensrp/store';

reducerRegistry.register(reducerName, reducer);

const node = convertApiResToTree(fhirHierarchy);

describe('src/ducks/location-state', () => {
  it('selects the correct data', () => {
    let result = getSelectedNode(store.getState());
    expect(result).toBeUndefined();

    store.dispatch(setSelectedNode(node));
    result = getSelectedNode(store.getState());
    expect(result.model.node.name).toEqual('Root FHIR Location');
  });
});
