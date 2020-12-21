import { getFetchOptions } from '@opensrp/server-service';
import { ToastOptions } from 'react-toastify';
import { DrillDownTableProps } from '@onaio/drill-down-table';

/** form config default component props types */
export interface FormConfigProps {
  baseURL: string;
  customAlert?: (message: string, options: ToastOptions) => void;
  endpoint: string;
  getPayload: typeof getFetchOptions;
  LoadingComponent?: JSX.Element;
}

/** Pick required properties from DrillDownTableProps */
type SelectDrillDownProps = Pick<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  DrillDownTableProps<any>,
  | 'loading'
  | 'loadingComponent'
  | 'paginate'
  | 'renderInBottomFilterBar'
  | 'renderInTopFilterBar'
  | 'renderNullDataComponent'
>;
/** params to pass to drill down table parent components */
export type DrillDownProps = Partial<SelectDrillDownProps>;
