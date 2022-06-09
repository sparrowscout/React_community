import './App.css';
import React from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import Main from './Main';
import NotFound from './NotFound';
import SignUp from './SignUp';
import Login from './LogIn';
import { getDocs, where, query, collection, getDoc } from 'firebase/firestore';
import styled from 'styled-components';
import { auth, db } from './shared/firebase';
import { onAuthStateChanged, signOut } from "firebase/auth";

import Posting from './Posting';
import Detail from './Detail';
import Edit from './Edit';
import { useDispatch, useSelector } from 'react-redux';
import { loadUserFB } from './redux/modules/User';




function App() {
  const history = useHistory();

  const [is_login, setIsLogin] = React.useState(false);

  const dispatch = useDispatch();

    // const users = useSelector((state) => state.users);
  // console.log(users)

  //원래는 웹 저장소에 저장된 토큰 가지고와서 웹 서버에 한번 줘서 체크해야함.
  //지금은 파이어베이스에서 제공해주는 auth.curretUser 랑 onAuthStateChanged 사용해서 로그인 체크

  const loginCheck = async (user) => {
    if (user) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }

  //onAuthStateChagend (auth, 어떻게 로그인 체크할건지의 함수)
  React.useEffect(() => {
    onAuthStateChanged(auth, loginCheck)
  }, [])



  React.useEffect(() => {
      dispatch(loadUserFB())
  }, [auth.currentUser]);


  // const my_user = useSelector((state) => state.users.list);

  // let my_nickname = [];
  // for( let i=0; i<my_user.length; i++ ){
  //   if (my_user[i].user_email === auth.currentUser.email){
  //     my_nickname.push(my_user[i].nickname);
  //   }
  // }
  // console.log(...my_nickname)


  return (
    <div className="App">
      <Header>
        <Btn onClick={() => { history.push("/"); }}> 홈 </Btn>
        <div>
          프사
          {is_login ? "닉네임" : ""}
        </div>
        {is_login ? <Btn onClick={() => { history.push("/signup"); }}> 마이페이지 </Btn>
          : <Btn onClick={() => { history.push("/signup"); }}> 회원가입 </Btn>}
        {is_login ? <Btn onClick={() => { signOut(auth) }}> 로그아웃 </Btn>
          : <Btn onClick={() => { history.push("/login"); }}> 로그인 </Btn>}

      </Header>

      <Switch>

        <Route path="/" exact component={Main} />
        <Route path="/signup" exact component={SignUp} />
        <Route path="/login" exact component={Login} />
        <Route path="/posting" exact component={Posting} />
        <Route path="/detail/:index" exact component={Detail} />
        <Route path="/edit/:index" exact component={Edit} />

        <Route component={NotFound} />
      </Switch>

    </div>
  );
}

const Header = styled.header`
display: grid ;
grid-template-columns: 1fr 1fr 1fr 1fr;
align-items: center;
margin: 15px;
`;

const Btn = styled.button`
background-color: #9c27b0;
color: white;
border: 1px solid #9c27b0;
padding: 10px;
margin-right: 5px;
border-radius: 20px;
`;

export default App;
