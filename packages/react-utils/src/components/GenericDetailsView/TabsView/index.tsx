import { Tabs, TabsProps } from 'antd';
import React from 'react';
import { useSearchParams } from '../../../hooks/useSearchParams';
import { activeTabQuery, tabViewQuery } from '../../../constants';

export interface GenericTabsViewProps extends TabsProps {
  tabViewId: string;
}
export interface GenericListTabsViewProps {
  tabsData: GenericTabsViewProps[];
}

/**
 * An extension of Tabs component that can navigate to an active tab based on url params
 *
 * @param props - GenericTabsView component props
 */
export function GenericTabsView(props: GenericTabsViewProps) {
  const { tabViewId, ...restprops } = props;
  const { sParams, addParamsToURL } = useSearchParams();
  const activeTabKey = sParams.get(activeTabQuery) ?? undefined;
  const tabView = sParams.get(tabViewQuery) ?? undefined;

  const onTabChangeHandler = (key: string) => {
    addParamsToURL({ [tabViewQuery]: tabViewId, [activeTabQuery]: key });
  };

  const extraTabProps: Record<string, React.ReactNode> = {};
  if (activeTabKey && tabViewId === tabView) {
    extraTabProps['activeKey'] = activeTabKey;
  }

  const tabProps = {
    onChange: onTabChangeHandler,
    ...restprops,
    ...extraTabProps,
  };

  return (
    <div className="details-tab">
      <Tabs {...tabProps} />
    </div>
  );
}

/**
 * Component that renders a list of GenericTabsView
 *
 * @param props - GenericListTabsView component props
 */
export function GenericListTabsView(props: GenericListTabsViewProps) {
  const { tabsData } = props;
  return (
    <>
      {tabsData.map((tabProp) => (
        <GenericTabsView key={tabProp.tabViewId} {...tabProp} />
      ))}
    </>
  );
}
