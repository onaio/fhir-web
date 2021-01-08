import React, { Component } from 'react';
import { Result, Button } from 'antd';

interface Props {
  homeUrl?: string;
}

class ErrorBoundary extends Component<Props> {
  render() {
    const { homeUrl } = this.props;
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
  }
}

export { ErrorBoundary };
