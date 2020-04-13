import React from 'react';
import styled from "styled-components";

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  max-width: 130px;
  margin-right: 20px;
  background: #ececec;
  height: 45px;
  border-radius: 5px;
  margin: 5px;
  justify-content: center;
  cursor: pointer;
  position: relative;
  transition: 0.3s ease;
  &:hover{
    opacity: 0.5;
  }
`;

const Overlay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.7);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: 0.3s ease;
  color: white;
  font-size: 10px;
  letter-spacing: 2px;
  text-transform: uppercase;
  opacity: 0;
  ${TagContainer}:hover & {
    opacity: 1;
  }
`;

const Country = styled.span`
  font-size: 14px;
  flex: 1 1 100%;
  ${TagContainer} & {
    font-size: 12px;
  }
`;
const Name = styled.span`
  font-size: 10px;
  flex: 0;
  color: gray;
  ${TagContainer} & {
   flex: 1 1 100%;
   line-height: 10px;
  }
`;
const Subcountry = styled.span`
  font-size: 10px;
  flex: 0;
  margin-left: 10px;
  color: gray;
  ${TagContainer} & {
   flex: 1 1 100%;
   margin-left: 0; 
   line-height: 10px;
  }
`;

const CustomTag = props => {
  const {label, closable, onClose} = props;
  return (
    <TagContainer closable={closable} onClick={onClose}>
      <Overlay>
        Eliminar
      </Overlay>
      <Country>
        {label.country}
      </Country>
      <Name>
        {label.name}
      </Name>
      <Subcountry>
        {label.subcountry}
      </Subcountry>
    </TagContainer>
  );
}

export default CustomTag;