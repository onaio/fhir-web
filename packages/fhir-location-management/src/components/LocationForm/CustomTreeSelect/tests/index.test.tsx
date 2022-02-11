import { CustomTreeSelect } from '..';
import React, { ReactNode } from 'react';
import { store } from '@opensrp/store';
import { authenticateUser } from '@onaio/session-reducer';
import { Form } from 'antd';
import { fhirHierarchy } from '../../../../ducks/tests/fixtures';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { convertApiResToTree } from '../../../../helpers/utils';

jest.mock('fhirclient', () => {
  return jest.requireActual('fhirclient/lib/entry/browser');
});

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

const tree = convertApiResToTree(fhirHierarchy);

describe('FormComponents/CustomTreeSelect', () => {
  const props = {
    tree,
    placeholder: 'select',
    disabledTreeNodesCallback: () => false,
  };

  const AppWrapper = (props: { children: ReactNode }) => {
    return <Form>{props.children}</Form>;
  };

  beforeAll(() => {
    store.dispatch(
      authenticateUser(
        true,
        {
          email: 'bob@example.com',
          name: 'Bobbie',
          username: 'RobertBaratheon',
        },
        // eslint-disable-next-line @typescript-eslint/camelcase
        { api_token: 'hunter2', oAuth2Data: { access_token: 'hunter2', state: 'abcde' } }
      )
    );
  });

  it('works correctly', async () => {
    const fullNodeCallback = jest.fn();

    render(
      <AppWrapper>
        <CustomTreeSelect fullDataCallback={fullNodeCallback} {...props} />
      </AppWrapper>
    );

    await waitFor(() => {
      expect(document.querySelector('.ant-select-arrow')).not.toHaveClass(
        'ant-select-arrow-loading'
      );
    });
    expect(screen.getByText(/select/)).toBeInTheDocument();

    const input = screen.getByRole('combobox');
    expect(input).toMatchSnapshot('tree select combobox');

    fireEvent.mouseDown(input);

    expect(screen.getByTitle(/Ona Office Sub Location/)).toMatchSnapshot('root location');
    fireEvent.click(document.querySelector('.ant-select-tree-switcher_close'));

    fireEvent.click(screen.getByText(/Part Of Sub Location/));

    expect(document.querySelector('.ant-select-selection-item')).toMatchSnapshot('selected option');
  });
});
