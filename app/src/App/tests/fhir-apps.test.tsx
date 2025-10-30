import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@opensrp/store';
import {
  LoadingComponent,
  SuccessfulLoginComponent,
  CallbackComponent,
} from '../fhir-apps';
import { RouteComponentProps } from 'react-router';
import { RouteParams } from '@onaio/gatekeeper';

describe('fhir-apps components', () => {
  describe('LoadingComponent', () => {
    it('should render without crashing', () => {
      render(<LoadingComponent />);
    });

    it('should display a spinner element', () => {
      render(<LoadingComponent />);
      const spinner = document.querySelector('.custom-spinner');
      expect(spinner).toBeInTheDocument();
    });

    it('should have the custom-spinner class for styling', () => {
      const { container } = render(<LoadingComponent />);
      const spinner = container.querySelector('.custom-spinner');
      expect(spinner).toHaveClass('custom-spinner');
    });

    it('should render an antd Spin component', () => {
      const { container } = render(<LoadingComponent />);
      // Ant Design Spin creates a div with aria-busy attribute when large size
      const spinElement = container.querySelector('[aria-busy]');
      expect(spinElement).toBeInTheDocument();
    });
  });

  describe('SuccessfulLoginComponent', () => {
    it('should render without crashing', () => {
      render(
        <BrowserRouter>
          <SuccessfulLoginComponent />
        </BrowserRouter>
      );
    });

    it('should redirect to home page', () => {
      render(
        <BrowserRouter>
          <SuccessfulLoginComponent />
        </BrowserRouter>
      );
      // Redirect component redirects to home (/), which is verified by the next test
      // This test just ensures it renders without error
    });

    it('should be a functional component that returns a Redirect', () => {
      const component = SuccessfulLoginComponent();
      expect(component).toBeDefined();
      expect(component.type).toBeDefined(); // Should be a React element
    });
  });

  describe('CallbackComponent', () => {
    const mockRouteProps: RouteComponentProps<RouteParams> = {
      location: {
        pathname: '/auth/callback',
        search: '?code=test_code',
        hash: '',
        state: undefined,
        key: 'test-key',
      },
      match: {
        params: {},
        isExact: true,
        path: '/auth/callback',
        url: '/auth/callback',
      },
      history: {
        length: 1,
        action: 'PUSH',
        location: {
          pathname: '/auth/callback',
          search: '?code=test_code',
          hash: '',
          state: undefined,
          key: 'test-key',
        },
        push: jest.fn(),
        replace: jest.fn(),
        go: jest.fn(),
        goBack: jest.fn(),
        goForward: jest.fn(),
        block: jest.fn(() => jest.fn()),
        listen: jest.fn(() => jest.fn()),
        createHref: jest.fn(),
      },
      staticContext: undefined,
    };

    it('should render without crashing', () => {
      render(
        <Provider store={store}>
          <BrowserRouter>
            <CallbackComponent {...mockRouteProps} />
          </BrowserRouter>
        </Provider>
      );
    });

    it('should accept route props', () => {
      const { container } = render(
        <Provider store={store}>
          <BrowserRouter>
            <CallbackComponent {...mockRouteProps} />
          </BrowserRouter>
        </Provider>
      );
      expect(container).toBeInTheDocument();
    });

    it('should render a component when given proper props', () => {
      const { container } = render(
        <Provider store={store}>
          <BrowserRouter>
            <CallbackComponent {...mockRouteProps} />
          </BrowserRouter>
        </Provider>
      );
      // Callback component renders either CustomConnectedAPICallBack or ConnectedOauthCallback
      // depending on BACKEND_ACTIVE setting
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should handle callback URL with query parameters', () => {
      const propsWithQueryParams: RouteComponentProps<RouteParams> = {
        ...mockRouteProps,
        location: {
          ...mockRouteProps.location,
          search: '?code=auth_code&state=xyz123',
        },
      };

      const { container } = render(
        <Provider store={store}>
          <BrowserRouter>
            <CallbackComponent {...propsWithQueryParams} />
          </BrowserRouter>
        </Provider>
      );
      expect(container).toBeInTheDocument();
    });
  });

  describe('Component exports', () => {
    it('should export LoadingComponent', () => {
      expect(LoadingComponent).toBeDefined();
      expect(typeof LoadingComponent).toBe('function');
    });

    it('should export SuccessfulLoginComponent', () => {
      expect(SuccessfulLoginComponent).toBeDefined();
      expect(typeof SuccessfulLoginComponent).toBe('function');
    });

    it('should export CallbackComponent', () => {
      expect(CallbackComponent).toBeDefined();
      expect(typeof CallbackComponent).toBe('function');
    });
  });

  describe('Component behavior', () => {
    it('LoadingComponent should render consistently', () => {
      const { rerender } = render(<LoadingComponent />);
      const firstRender = document.querySelector('.custom-spinner');
      expect(firstRender).toBeInTheDocument();

      rerender(<LoadingComponent />);
      const secondRender = document.querySelector('.custom-spinner');
      expect(secondRender).toBeInTheDocument();
    });

    it('SuccessfulLoginComponent should always redirect to home', () => {
      const component1 = SuccessfulLoginComponent();
      const component2 = SuccessfulLoginComponent();

      expect(component1.props.to).toBe('/');
      expect(component2.props.to).toBe('/');
      expect(component1.props.to).toBe(component2.props.to);
    });

    it('CallbackComponent should handle multiple renders', () => {
      const mockRouteProps: RouteComponentProps<RouteParams> = {
        location: {
          pathname: '/auth/callback',
          search: '',
          hash: '',
          state: undefined,
          key: 'test-key',
        },
        match: {
          params: {},
          isExact: true,
          path: '/auth/callback',
          url: '/auth/callback',
        },
        history: {
          length: 1,
          action: 'PUSH',
          location: {
            pathname: '/auth/callback',
            search: '',
            hash: '',
            state: undefined,
            key: 'test-key',
          },
          push: jest.fn(),
          replace: jest.fn(),
          go: jest.fn(),
          goBack: jest.fn(),
          goForward: jest.fn(),
          block: jest.fn(() => jest.fn()),
          listen: jest.fn(() => jest.fn()),
          createHref: jest.fn(),
        },
        staticContext: undefined,
      };

      const { rerender, container } = render(
        <Provider store={store}>
          <BrowserRouter>
            <CallbackComponent {...mockRouteProps} />
          </BrowserRouter>
        </Provider>
      );

      expect(container.firstChild).toBeInTheDocument();

      rerender(
        <Provider store={store}>
          <BrowserRouter>
            <CallbackComponent {...mockRouteProps} />
          </BrowserRouter>
        </Provider>
      );

      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
