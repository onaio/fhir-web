import React from 'react';
import '../../index.css';
/** interface for Ripple props */
export interface RippleProps {
  borderColor?: string;
  borderStyle?: string;
  borderWidth?: string;
  height?: string;
  minHeight?: string;
  width?: string;
}
export declare const defaultProps: Partial<RippleProps>;
/**
 * Loading component that displays a nice ripple
 *
 * @param {object} props - the ripple styles
 * @returns {Element} - display the loader
 */
declare const Ripple: React.FC<RippleProps>;
export default Ripple;
