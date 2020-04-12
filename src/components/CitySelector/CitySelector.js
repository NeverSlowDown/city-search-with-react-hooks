import React, {useEffect, useState} from 'react';
import * as R from "ramda"
import styled, {createGlobalStyle} from "styled-components";
import {Select, Spin, notification, Form, Button} from "antd";
import debounce from "lodash.debounce";
import Image from "../../assets/image.png";

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
  .ant-select-selector {
    > span {
      display: flex;
    }
  }
  .ant-form-item-control-input-content {
    display: flex;
    align-items: center;
  }
`;

const CitySelectorContainer = styled.section`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const ChooseContainer = styled.div`
  position: relative;
  background: #2f0c6a;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0px 15px 30px rgba(0,0,0,0.6);
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  max-width: 850px;
  min-height: 550px;
`;

const StyledForm = styled(Form)`
  flex: ${props => props.initialLoading ? 0 : "1 1 50%"};
  background: white;
  overflow: hidden;
  padding: ${props => props.initialLoading ? "0 !important" : "20px"};
  transition: 0.5s ease;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .btn-save {
    background: #982bba;
    background: linear-gradient(45deg,  #982bba 0%,#f26576 100%);
    color: white;
    border: none;
    margin: 0 auto;
  }
  .city-input {
    transform: translateY(10px);
    opacity: 0;
    animation: fadeIn 0.5s 0.5s ease forwards;
    @keyframes fadeIn {
      100% {
        transform: translateY(0);
        opacity: 1;
      }
    }
  }
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
  z-index: 1;
  ${props => props.absolute && `
    position: absolute;
    right: 5px;
  `}
`;

const ImageContainer = styled.figure`
  flex: 1 1 30%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 20px;
  img {
    width: 320px;
  }
`;

const CustomTag = props => {
  const {label, closable, onClose} = props;
  return (
    <TagContainer closable={closable} onClick={onClose}>
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

const CitySelector = () => {
  
  const [initialLoading, setInitialLoading] = useState(true);
  const [initialCities, setInitialCities] = useState([]);
  const [chosenOptions, setChosenOptions] = useState([]);

  const [data, setData] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [submiting, setSubmiting] = useState(false);
  
  const loadInitial = async () => {
    try {
      setInitialLoading(true);
      const response = await fetch("http://localhost:3030/preferences/cities")
      const responseJSON = await response.json();
      console.log({responseJSON});

      // I see that there is some null stuff coming from this GET, let's remove it
      const mutatedResponse = R.reject(R.isNil, responseJSON.data);
      console.log({mutatedResponse});
      
      await Promise.all(mutatedResponse.map(item=>fetch(`http://localhost:3030/cities/${item}`)))
      .then(async responses =>
        await Promise.all(responses.map(res => res.json()))
      ).then(responseJson => {
        // let's check if one of these couldn't load properly, by the way it doesn't matter if it was not load properly, when you save your new options (PATCH), this failed loaded options won't dissapear, they will be there next time you refresh
        R.any(R.has("error"), responseJson) && notification.error({
          message: 'Error',
          description: 'Una ciudad o varias no se han cargado correctamente',
        });
        // let's trash this errors
        const cleanResponse = R.reject(R.has("error"), responseJson)
        const initialMutated = cleanResponse.map(item => ({
          label: item,
          value: item.geonameid
        }));

        // set this initial cities for selects' tag render
        setInitialCities(R.concat(initialMutated, initialCities))

        // set already chosen options
        const alreadyChosen = R.zipObj(mutatedResponse, R.repeat(true, mutatedResponse.length))
        setChosenOptions(alreadyChosen);

        setInitialLoading(false);
      })
    } catch(error) {
      setInitialLoading(false);
      console.error(error);
      notification.error({
        message: 'Error',
        description: 'No se han podido cargar los datos iniciales, intente nuevamente',
      });
    }
  }

  useEffect(() => {
    loadInitial();
  }, [])

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


  const onFinish = async () => {
    try {
      setSubmiting(true);
      const response = await fetch("http://localhost:3030/preferences/cities", {method: "PATCH", body: JSON.stringify(chosenOptions),  headers: {"Content-type": "application/json"}})
      setSubmiting(false);      

      await response.ok ?
      notification.success({
        message: 'Genial',
        description: 'Los cambios se han guardado correctamente.',
      })
      :
      notification.error({
        message: 'Error',
        description: 'Los cambios no se han guardado, intente nuevamente.',
      });
    } catch(error) {
      setSubmiting(false);
      console.error(error);
      console.log({data})
      notification.error({
        message: 'Error',
        description: 'Los cambios no se han guardado, intente nuevamente.',
      });
    }

  }

  const handleDeselect = i => {
    const id = R.view(R.lensProp("value"),i)
    console.log({id})
    // I check where this id is and change its value to false
    const result = R.set(R.lensProp(id), false, chosenOptions)
    console.log({result})
    setChosenOptions(result)
  }

  const handleSelect = i => {
    const id = R.view(R.lensProp("value"),i)
    console.log({id})
    setChosenOptions(R.assoc(id, true, chosenOptions))
  }
  

  return (
    <CitySelectorContainer>
     <GlobalStyle />
      <ChooseContainer>
        <StyledForm
          name="select-city"
          onFinish={onFinish}
          initialLoading={initialLoading}
        >
          {!initialLoading && (
            <Form.Item className="city-input" name="city">
              {fetching && (
                  <Loading absolute>
                    <Spin size="small" />
                  </Loading>
                )
              }
              <Select
                mode="multiple"
                filterOption={false}
                onSearch={debounce(loadOptions,800)}
                style={{ width: '100%' }}
                autoClearSearchValue={false}
                labelInValue={true}
                optionLabelProp="label"
                tagRender={CustomTag}
                defaultValue={initialCities}
                onDeselect={handleDeselect}
                onSelect={handleSelect}
                placeholder="Buscar ciudades"
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
          )}  

          <Form.Item>
            <Button size="large" shape="round" className="btn-save" loading={submiting} type="primary" htmlType="submit">
              Guardar
            </Button>
          </Form.Item>
           
        </StyledForm>
        <ImageContainer>
          <img src={Image} alt="just-a-decorative-image" />
        </ImageContainer>
      </ChooseContainer>
      
    </CitySelectorContainer>
  );
}

export default CitySelector;
