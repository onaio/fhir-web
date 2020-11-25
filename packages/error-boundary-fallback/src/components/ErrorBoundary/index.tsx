import React, { Component } from 'react';
import { Result, Button } from 'antd';
import * as Sentry from '@sentry/react';

interface Props {
  children: unknown;
  dsn: string;
  homeUrl?: string;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  componentDidMount() {
    const { dsn } = this.props;
    if (dsn && dsn !== '') {
      Sentry.init({ dsn: dsn });
    }
  }

  componentDidCatch(err: unknown) {
    this.setState({ hasError: true });
    Sentry.captureException(err);
  }

  render() {
    const { hasError } = this.state;
    const { homeUrl, children } = this.props;
    if (hasError) {
      return (
        <Result
          status="error"
          title="An Error Occurred"
          subTitle="There has been an error. It’s been reported to the site administrators via email and
        should be fixed shortly. Thanks for your patience."
          extra={
            <Button
              id="backHome"
              key="error"
              onClick={() => (window.location.href = homeUrl ? homeUrl : '/')}
              type="primary"
            >
              Back Home
            </Button>
          }
        />
      );
    } else {
      return children ? children : <></>;
    }
  }
}

export { ErrorBoundary };
