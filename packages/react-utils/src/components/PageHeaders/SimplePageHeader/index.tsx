import React from 'react';
import { Typography } from 'antd';

export interface SimplePageHeaderProps {
  title: string;
}

const { Title } = Typography;

const SimplePageHeader = (props: SimplePageHeaderProps) => {
  const { title } = props;

  return (
    <div className="header">
      <Title level={4} className="page-header">
        {title}
      </Title>
    </div>
  );
};

export { SimplePageHeader };
