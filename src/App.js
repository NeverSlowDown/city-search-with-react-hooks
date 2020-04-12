import React from 'react';
import './App.css';
import 'antd/dist/antd.css';
import CitySelector from './components/CitySelector';
import styled from "styled-components";

const Main = styled.main`
  background: #982bba;
  background: linear-gradient(45deg,  #982bba 0%,#f26576 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const App = () => {
  return (
    <Main className="App">
     {/* well, I am not using react router so I'll just pass the component here */}
     <CitySelector />
    </Main>
  );
}

export default App;
