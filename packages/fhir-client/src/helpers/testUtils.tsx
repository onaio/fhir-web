import { mount, MountRendererProps } from 'enzyme';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

/**
 * wrapper to add providers when mounting components with tests
 *
 * @param component - child component
 * @param options - mount wrapper options
 */
export const mountWithProviders: typeof mount = (
  component: React.ReactNode,
  options?: MountRendererProps
) => {
  return mount(
    <QueryClientProvider client={queryClient}>{component}</QueryClientProvider>,
    options
  );
};
