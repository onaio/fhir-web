import { mount } from 'enzyme';
import React from 'react';
import { useLoadingReducer, loadingReducer } from '..';

describe('helpers/useLoadingReducer', () => {
  it('works correctly', () => {
    // create a wrapper component to help us test the hook

    const Sample = () => {
      const { startLoading, stopLoading, loading } = useLoadingReducer(true);

      return (
        <>
          {/* tslint:disable: jsx-no-lambda */}
          <button id="button1-start" onClick={() => startLoading('button1')} />
          <button id="button1-end" onClick={() => stopLoading('button1')} />
          <button id="button2-start" onClick={() => startLoading('button2')} />
          <button id="button2-end" onClick={() => stopLoading('button2')} />

          <span>{loading() ? 'isLoading' : 'not Loading'}</span>
        </>
      );
    };

    const wrapper = mount(<Sample />);
    // should not be loading
    expect(wrapper.text()).toMatchInlineSnapshot(`"isLoading"`);

    // simulate start of a single load sequence
    wrapper.find('#button1-start').simulate('click');
    // should be loading
    expect(wrapper.text()).toMatchInlineSnapshot(`"isLoading"`);

    // simulate start of another loading sequence
    wrapper.find('#button2-start').simulate('click');
    // should still be loading
    expect(wrapper.text()).toMatchInlineSnapshot(`"isLoading"`);

    // now we start to close the loading states one at a time
    // we expect as long as there is an unresolved loading sequence the loading state will remain true
    wrapper.find('#button1-end').simulate('click');
    // is still loading
    expect(wrapper.text()).toMatchInlineSnapshot(`"isLoading"`);

    // now close the remaining loading sequence
    wrapper.find('#button2-end').simulate('click');
    // should now stop loading
    expect(wrapper.text()).toMatchInlineSnapshot(`"not Loading"`);
  });

  it('works with default state', () => {
    // create a wrapper component to help us test the hook

    const Sample = () => {
      const { startLoading, stopLoading, loading } = useLoadingReducer();

      return (
        <>
          {/* tslint:disable: jsx-no-lambda */}
          <button id="button1-start" onClick={() => startLoading('button1')} />
          <button id="button1-end" onClick={() => stopLoading('button1')} />
          <button id="button2-start" onClick={() => startLoading('button2')} />
          <button id="button2-end" onClick={() => stopLoading('button2')} />

          <span>{loading() ? 'isLoading' : 'not Loading'}</span>
        </>
      );
    };

    const wrapper = mount(<Sample />);
    // should not be loading
    expect(wrapper.text()).toMatchInlineSnapshot(`"isLoading"`);
  });

  it('reducer returns default state', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockAction: any = {
      type: 'NONEXISTENT',
    };
    let res = loadingReducer(undefined, mockAction);
    expect(res).toEqual({});

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    res = loadingReducer(undefined, {} as any);
    expect(res).toEqual({});
  });
});
