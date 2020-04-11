import React, {useEffect, useState} from 'react';
import './App.css';
import styled from "styled-components";
import {Select, Spin} from "antd";
import 'antd/dist/antd.css';
import debounce from "lodash.debounce";

const {Option} = Select;

const StyledOption = styled(Option)`
  margin: 10px 0;
  display: flex;
  flex-direction: column;
  background: ${props => props.selected ? "lime" : "transparent"};
`;

const Country = styled.span`
`;
const Name = styled.span``;
const Subcountry = styled.span``;

const CustomTag = props => {
  const {label} = props
  return (
    <div>
      <Country>
        {label.country}
      </Country>
      <Name>
        {label.name}
      </Name>
      <Subcountry>
        {label.subcountry}
      </Subcountry>
    </div>
  );
}

const App = () => {

  const [data, setData] = useState([]);
  const [value, onChange] = useState(null);
  const [next, setNext] = useState(false);
  const [fetching, setFetching] = useState(false);

  const loadOptions = async search => {
    try {
      const query = search ? next ? `${next}&filter=${search}` : `/cities/?filter=${search}&limit=10` : `/cities/?limit=10`;
      console.log({query});
      
      setFetching(true);
      const response = await fetch(query);
      const responseJSON = await response.json();
      // const data = responseJSON.data.map(item => ({
      //   ...item,
      //   label: item.name,
      //   value: item.geonameid
      // }));
      await setData(responseJSON.data);
      setFetching(false);
      
      // responseJSON.links.next && setNext(responseJSON.links.next)
    }
    catch(error) {
      console.error(error);
    }
  }

  return (
    <div className="App">
     <button onClick={() => console.log(data)}>
       hey
     </button>
      <Select
        mode="multiple"
        notFoundContent={fetching ? <Spin size="small" /> : null}
        filterOption={false}
        onSearch={debounce(loadOptions,800)}
        style={{ width: '100%' }}
        autoClearSearchValue={false}
        labelInValue={true}
        optionLabelProp="label"
        tagRender={CustomTag}
      >
        {data ? data.map((item, index) => {          
          return(
            <StyledOption label={item} key={`${item.value}-${index}`} value={item.geonameid}>
              <Country>
                {item.country}
              </Country>
              <Name>
                {item.name}
              </Name>
              <Subcountry>
                {item.subcountry}
              </Subcountry>
            </StyledOption>
          )
        }) : null}
      </Select>
    </div>
  );
}

export default App;
