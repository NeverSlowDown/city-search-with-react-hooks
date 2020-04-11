import React, {useState} from 'react';
import * as R from "ramda"
import './App.css';
import styled, {createGlobalStyle} from "styled-components";
import {Select, Spin, notification, Form, Button} from "antd";
import 'antd/dist/antd.css';
import debounce from "lodash.debounce";

const {Option} = Select;

const GlobalStyle = createGlobalStyle`
  .ant-select-item {
    display: flex;
    align-items: center;
  }
  .ant-select-item-option-content {
    order: 1;
    transition: 0.3s ease;
  }
  .ant-select-item-option-state {
    order: 0;
    margin-right: 5px;
  }
  .ant-select-item-option-selected {
    .ant-select-item-option-content {
      transform: translateX(10px);
    }
  }
`;

const ChooseContainer = styled.section`
  position: relative;
`;

const StyledOption = styled(Option)`
  margin: 10px 0;
`;

const ItemContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
`;

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
  transition: 0.3s ease;
  &:hover{
    opacity: 0.5;
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

const Loading = styled.div`
  display: flex;
  position: absolute;
  right: 0;
  z-index: 1;
`;

const CustomTag = props => {
  const {label} = props;
  return (
    <TagContainer closable={props.closable} onClick={props.onClose}>
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

const loadInitial = () => {
  // const initial = [{"country":"Djibouti","geonameid":225284,"name":"'Ali Sabieh","subcountry":"Ali Sabieh"},{"country":"Netherlands","geonameid":2747364,"name":"'s-Gravenzande","subcountry":"South Holland"},{"country":"Netherlands","geonameid":2747351,"name":"'s-Hertogenbosch","subcountry":"North Brabant"},{"country":"Palestinian Territory","geonameid":281165,"name":"‘Abasān al Kabīrah","subcountry":"Gaza Strip"},{"country":"Iraq","geonameid":99738,"name":"‘Afak","subcountry":"Al Qādisīyah"},{"country":"Saudi Arabia","geonameid":110250,"name":"‘Afīf","subcountry":"Ar Riyāḑ"},{"country":"Syria","geonameid":174186,"name":"‘Afrīn","subcountry":"Aleppo"},{"country":"Israel","geonameid":295739,"name":"‘Afula ‘Illit","subcountry":"Northern District"},{"country":"Algeria","geonameid":2508157,"name":"‘Aïn el Hadjel","subcountry":"Mʼsila"},{"country":"Iran","geonameid":144443,"name":"‘Ajab Shīr","subcountry":"East Azerbaijan"}]

  // const initialMutated = initial.map(item => ({
  //   label: item,
  //   value: item.geonameid
  // }));
  // return initialMutated;
}

const App = () => {

  const [data, setData] = useState([]);
  const [initialData, setInitialData] = useState(loadInitial);
  const [fetching, setFetching] = useState(false);
  const [submiting, setSubmiting] = useState(false);

  const loadOptions = async search => {
    try {
      const query = search ? `/cities/?filter=${search}&limit=10` : `/cities/?limit=10`;
      console.log({query});
      
      setFetching(true);
      const response = await fetch(query);
      const responseJSON = await response.json();
      const data = responseJSON.data.map(item => ({
        label: item,
        value: item.geonameid
      }));
      await setData(data);
      setFetching(false);
    }
    catch(error) {
      setFetching(false);
      notification.error({
        message: 'Error',
        description: 'Se ha producido un error, intente nuevamente la búsqueda.',
      });
      console.error(error);
    }
  }


  const onFinish = async formData => {
    console.log({formData})
    // just taking the values from the "value" key (geonameid in this case) and create new list
    const justValues = R.pluck("value",formData.city);
    // convertion to string
    const convertedToString = R.map(R.toString, justValues);
    // then I create a new object making this strings as keys and assign true as its value for each element
    const finalResult = await R.zipObj(convertedToString, R.repeat(true, convertedToString.length))
    console.log({finalResult})

    try {
      setSubmiting(true);
      const response = await fetch("http://localhost:3030/preferences/cities", {method: "PATCH", body: JSON.stringify(finalResult)})
      console.log(response.json());
      notification.success({
        message: 'Genial',
        description: 'Los cambios se han guardado correctamente.',
      });
    } catch(error) {
      setSubmiting(false);
      console.error(error);
      notification.error({
        message: 'Error',
        description: 'Los cambios no se han guardado, intente nuevamente.',
      });
    }

  }

  

  return (
    <div className="App">
     <button onClick={() => console.log(data)}>
       la data
     </button>
     <button onClick={() => console.log(initialData)}>
       initial
     </button>
     
     <GlobalStyle />
     <ChooseContainer>
      {fetching && (
          <Loading>
            <Spin size="small" />
          </Loading>
        )
      }
      <Form
        name="select-city"
        onFinish={onFinish}
      >
        <Form.Item
          name="city"
          rules={[{ required: true, message: 'Debe seleccionar al menos una opción' }]}
        >
          <Select
            mode="multiple"
            filterOption={false}
            onSearch={debounce(loadOptions,800)}
            style={{ width: '100%' }}
            autoClearSearchValue={false}
            labelInValue={true}
            optionLabelProp="label"
            tagRender={CustomTag}
            defaultValue={initialData}
          >
            {data.length > 0 ? data.map((item, index) => {          
              return(
                <StyledOption label={item.label} key={`${item.value}-${index}`} value={item.geonameid}>
                  <ItemContainer>
                    <Country>
                      {item.label.country}
                    </Country>
                    <Name>
                      {item.label.name}
                    </Name>
                    <Subcountry>
                      {item.label.subcountry}
                    </Subcountry>
                  </ItemContainer>
                </StyledOption>
              )
            }) : <StyledOption disabled key={`empty`}>Vacio, prueba buscando un pais, estado o ciudad</StyledOption>}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Guardar
          </Button>
        </Form.Item>
      </Form>
      
     </ChooseContainer>
    </div>
  );
}

export default App;
