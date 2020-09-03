import React from 'react';
import './style.css';

/** interface for Ripple props */
export interface RippleProps {
  borderColor: string;
  borderStyle: string;
  borderWidth: string;
  height: string;
  minHeight: string;
  width: string;
}

export const defaultProps: Partial<RippleProps> = {
  borderColor: '#ff5d00',
  borderStyle: 'solid',
  borderWidth: '4px',
  height: '64px',
  minHeight: '80vh',
  width: '64px',
};

/** Loading component that displays a nice ripple */
const Ripple = (props: RippleProps) => {
  const { borderColor, borderStyle, borderWidth, height, minHeight, width } = props;

  const innerDivStyle: React.CSSProperties = {
    borderColor,
    borderStyle,
    borderWidth,
  };
  return (
    <div className="lds-ripple-parent" style={{ minHeight }}>
      <div className="lds-ripple" style={{ height, width }}>
        <div style={innerDivStyle} />
        <div style={innerDivStyle} />
      </div>
    </div>
  );
};

Ripple.defaultProps = defaultProps;

export default Ripple;
