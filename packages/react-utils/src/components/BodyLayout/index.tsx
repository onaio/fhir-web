import React, { ReactNode } from 'react';
import { RichPageHeader, RichPageHeaderProps } from '../PageHeaders/RichPageHeader';

export interface BodyLayoutProps {
  headerProps: RichPageHeaderProps;
  children: ReactNode;
  id?: string;
}

export const BodyLayout = (props: BodyLayoutProps) => {
  const { headerProps, children } = props;
  return (
    <div className="details-full-view">
      <RichPageHeader {...headerProps} />
      <div className="content-body">{children}</div>
    </div>
  );
};
