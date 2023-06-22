import React from 'react';
import { Typography } from 'antd';

export interface pageHeaderProps {
	title: string;
}

const { Title } = Typography;

const PageHeader = (props: pageHeaderProps) => {
	const { title } = props;

	return (
		<div className="header">
			<Title level={4} className='page-header'>{title}</Title>
		</div>
	);
}

export { PageHeader };