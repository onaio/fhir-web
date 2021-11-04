/** Helps report errors in a render tree, The reporter function
 * will be available to other packages through the context defined here within
 *
 */

import React, { createContext } from 'react';

export type ErrorReportingFun = (err: Error, options?: Record<string, unknown>) => void;

export interface ErrorReporterProviderProps {
  // reporter is a function that can take an error and its context and
  // send the error race and send it to an error monitoring service
  reporter: ErrorReportingFun;
  children: JSX.Element;
}

export type ErrorReporterT = Pick<ErrorReporterProviderProps, 'reporter'>;

/** To be used only for errors that need to be tracked from sentry */
export const ErrorReporterContext = createContext<ErrorReporterT>({
  reporter: () => '',
});

/**
 * @param root0 -
 * @param root0.reporter - error reporter function
 * @param root0.children - nested child components
 */
export function ErrorReporterProvider({ reporter, children }: ErrorReporterProviderProps) {
  return (
    <ErrorReporterContext.Provider value={{ reporter }}>{children}</ErrorReporterContext.Provider>
  );
}
