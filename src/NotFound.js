import React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

const NotFound = () => {
    const history = useHistory();
    return (
        <Container>
                  <button onClick={()=>history.goBack()}>← 뒤로가기</button> <h1>잘못된 주소 입니다.</h1>
        </Container>
  
        
    )
}

const Container = styled.div`
display: flex;
justify-content: center;
align-items: center;

button {
    position: absolute;
    left: 0;
    margin: 15px;
    

}
`;


export default NotFound;