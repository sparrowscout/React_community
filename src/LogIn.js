import React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";


//아이디 값 알고 있으면 겟독으로만으로도 괜찮은데 우린 랜덤이니까 where절 사용,
//디비에서 지금 로그인한 이메일(고유값)과 동일한 이메일 찾는 애
import { getDocs, where, query, collection } from "firebase/firestore";

//로그인하기
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth, db } from "./shared/firebase";

const Login = () => {

  

    const mail_ref = React.useRef(null);
    const pw_ref = React.useRef(null);

    const loginFB = async () => {

        const user = await signInWithEmailAndPassword(auth, mail_ref.current.value, pw_ref.current.value)
        console.log(user)


        history.push("/")

        //쿼리: 어느 데이터베이스에서 어떤 조건을 가지고 어떤걸 가지고와! 하는 애
        const user_docs = await getDocs(
            query(collection(db,"users"), where("user_email", "==", user.user.email))
        )   
        
        //배열에 담긴거 하나밖에없을거임
        user_docs.forEach(u => {
            console.log(u.data().nickname)
        })

  
        };

        const onKeyPress = (e) => {
            if (e.key === 'Enter'){
                loginFB();
            }
          }
        

    const history = useHistory();
    return (
        <div>
                  <BackButton onClick={()=>history.goBack()}>← 뒤로가기</BackButton> <h1>로그인페이지 입니다.</h1>
                  <LogInContainer>
                      이메일 <br/>
                      <input ref={mail_ref} onKeyPress={onKeyPress}/><br/>
                      비밀번호 <br/>
                      <input ref={pw_ref} type="password" onKeyPress={onKeyPress} /><br/>

                      <button onClick={loginFB}>로그인하기</button>
                </LogInContainer>
        </div>
   
        
    )
}


const BackButton = styled.button`
    position: fixed;
    left: 0;
    margin: 15px;
`; 
   


const LogInContainer = styled.div`
text-align: left;
margin: auto;
width: 80vw;
`;


export default Login;