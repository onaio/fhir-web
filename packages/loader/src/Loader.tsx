import React from 'react';
import { Ripple } from '@onaio/loaders';

/** interface for Ripple props */
export interface LoaderProps {
  borderColor?: string;
  borderStyle?: string;
  borderWidth?: string;
  height?: string;
  minHeight?: string;
  width?: string;
}

export const defaultProps: Partial<LoaderProps> = {
  borderColor: '#ff5d00',
  borderStyle: 'solid',
  borderWidth: '4px',
  height: '64px',
  minHeight: '80vh',
  width: '64px',
};

/** Loading component that displays a nice ripple
 *
 * @param {object} props should contain the UI styles.
 * @returns {Element} - actions
 */
const Loader: React.FC<LoaderProps> = (props: LoaderProps) => <Ripple {...props} />;

Loader.defaultProps = defaultProps;

export { Loader };
