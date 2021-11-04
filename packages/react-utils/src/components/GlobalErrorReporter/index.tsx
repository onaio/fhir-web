/** Helps report errors in a render tree, The reporter function
 * will be available to other packages through the context defined here within
 *
 * Downside: vendor lock in. - Sentry due to specific error boundary
 */

import React, { createContext, ReactNode } from 'react';
import * as Sentry from '@sentry/react';

export interface ErrorReporterProviderProps<ErrorReporterFun = typeof Sentry.captureException> {
  // reporter is a function that can take an error and its context and
  // send the error race and send it to an error monitoring service
  reporter: ErrorReporterFun;
  children: JSX.Element;
  fallbackComponent: () => ReactNode;
}

export type ErrorReporterT<ErrorReporterFun = typeof Sentry.captureException> = Pick<
  ErrorReporterProviderProps<ErrorReporterFun>,
  'reporter'
>;

export const ErrorReporterContext = createContext<ErrorReporterT>({
  reporter: () => '',
});

export const ErrorReporterProvider = ({
  reporter = Sentry.captureException,
  children,
  fallbackComponent,
}: ErrorReporterProviderProps) => {
  return (
    <ErrorReporterContext.Provider value={{ reporter }}>
      <Sentry.ErrorBoundary fallback={fallbackComponent}>{children}</Sentry.ErrorBoundary>
    </ErrorReporterContext.Provider>
  );
};
