import React from 'react';
import logo from './logo.svg';
import './App.css';
import { JsonFormRender } from './Components/jsonFormSchema';
import { UniformAntd } from './Components/uniforms';

function App() {
  return (
    <div className="App">
      <JsonFormRender />
      <UniformAntd/>
    </div>
  );
}

export default App;
