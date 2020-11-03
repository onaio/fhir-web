import { Result, Button } from 'antd';
import { useHistory } from 'react-router';

const ErrorBoundary: React.FC = () => {
  const history = useHistory();

  return (
    <Result
      status="error"
      title="An Error Occurred"
      subTitle="There has been an error. It’s been reported to the site administrators via email and
      should be fixed shortly. Thanks for your patience."
      extra={
        <Button id="backHome" key="error" onClick={() => history.push('/')} type="primary">
          Back Home
        </Button>
      }
    />
  );
};

export default ErrorBoundary;
export { ErrorBoundary };
