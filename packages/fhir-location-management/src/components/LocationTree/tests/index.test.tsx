import React from 'react';
import Tree from '../';
import { store } from '@opensrp/store';
import { Provider } from 'react-redux';
import { screen, render } from '@testing-library/react';
import { fhirHierarchy } from '../../../ducks/tests/fixtures';
import { convertApiResToTree } from '../../../helpers/utils';
import userEvent from '@testing-library/user-event';

describe('location-management/src/components/LocationTree', () => {
  const treeData = convertApiResToTree(fhirHierarchy).children;

  const AppWrapper = (props: { children: React.ReactNode }) => {
    return <Provider store={store}>{props.children}</Provider>;
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('works correctly', async () => {
    render(
      <AppWrapper>
        <Tree data={treeData} onSelect={jest.fn} />
      </AppWrapper>
    );

    expect(screen.getByText(/Ona Office Sub Location/)).toBeInTheDocument();
    expect(document.querySelector('.ant-tree-node-content-wrapper')).toMatchSnapshot(
      'single top record'
    );

    // go into some interactions
    // search for Langata

    const input = document.querySelector('input');
    expect(input).toMatchSnapshot('search input');
    await userEvent.type(input, 'laNgaTa');
    expect(screen.getByTitle(/langata/i)).toMatchSnapshot('langata search value');
  });

  // TODO - test #474
});
