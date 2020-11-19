import React from 'react';
import { Spin } from 'antd';
import './style.css';

const Ripple = () => {
  return (
    <div className="lds-ripple-parent">
      <Spin size="large" />
    </div>
  );
};

export default Ripple;
